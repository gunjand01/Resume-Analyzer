const express = require('express');
const { urlencoded, json } = require('body-parser');
const { connect, Schema, model } = require('mongoose');
const argon2 = require('argon2');
const cors = require('cors');
const app = express();
const port = 3001;
const fs = require("node:fs")
const path = require("node:path")
const PDFDocument = require('pdfkit');
const multer = require("multer");
const { spawn } = require('child_process');
require('dotenv').config();
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

connect(process.env.MONGODB_URI);
const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-_+=]).{8,}$/;
    return passwordRegex.test(password);
};

const userSchema = new Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    email: String,
});

const User = model('User', userSchema);

app.post('/signup', async (req, res) => {
    try {
        const { username, password, firstName, lastName, email } = req.body;
        if (!username || !firstName || !lastName) {
            return res.status(400).send('Name and username are required fields');
        }
        if (!isPasswordValid(password)) {
            return res.status(400).send('Password must be at least 8 characters and contain 1 uppercase, 1 lowercase, 1 symbol, and 1 digit');
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).send('Username already taken');
        }

        const hashedPassword = await argon2.hash(password); // Use argon2 for hashing
        const newUser = new User({ username, password: hashedPassword, firstName, lastName, email });
        await newUser.save();
        res.send('Signup successful');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (user) {
            const isPasswordValid = await argon2.verify(user.password, password);
            if (isPasswordValid) {
                res.send('Login successful');
            } else {
                res.status(401).send('Invalid credentials');
            }
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './resume');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });
let resumeFileName = "Sakshi.pdf"
app.post('/upload', upload.single('resume'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const resumeFilePath = req.file.path;
    resumeFileName = req.file.originalname;
    console.log("Reading Resume.....")
    const pyProg = spawn('python', ['./app.py', resumeFilePath]);
    console.log("Running Python Script....")
    let responseData = '';
    let errorData = '';

    pyProg.stdout.on('data', (data) => {
        console.log(data.toString());
        responseData += data.toString();
    });

    pyProg.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
        errorData += data.toString();
    });

    pyProg.on('error', (err) => {
        console.error('Failed to start subprocess.', err);
        res.status(500).send('Internal Server Error');
    });

    pyProg.on('close', (code) => {
        console.log(`Python script process exited with code ${code}`);
        if (code === 0) {
            res.status(200).send(responseData);
            // res.redirect('http://localhost:3000/dashboard');
        } else {
            res.status(500).send(`Resume parsing failed. Error: ${errorData}`);
        }
    });
});

app.get('/resumes', (req, res) => {
    const jsonFileName = resumeFileName.replace(".pdf", ".json");
    // console.log(jsonFileName)
    const jsonFilePath = path.join(__dirname, './json/', jsonFileName);
    fs.readFile(jsonFilePath, (err, data) => {
        if (err) {
            console.error("Error reading JSON file:", err);
            return res.status(500).send("Error reading JSON file");
        }
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    });
});




app.get('/resumeName', (req, res) => {
    const resumeDir = path.join(__dirname, 'resume');
    const resumeFiles = fs.readdirSync(resumeDir);
    if (!fs.existsSync(resumeDir) ||resumeFiles.length === 0 ) {
        return res.status(404).send('No resumes found.');
    }
    const filePath = path.join(resumeDir, resumeFileName);
    // console.log(filePath)

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error reading resume file:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.setHeader('Content-Type', 'application/pdf');
            res.send(data);
        }
    });
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});