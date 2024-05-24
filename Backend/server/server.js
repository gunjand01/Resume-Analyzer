const express = require('express');
const { urlencoded, json } = require('body-parser');
const { mongoose, Schema, model } = require('mongoose');
const argon2 = require('argon2');
const cors = require('cors');
const app = express();
const port = 3001;
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { spawn } = require('child_process');
const axios = require('axios');
const jwt = require('jsonwebtoken');

require('dotenv').config();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(express.json());
app.use(cors());

const secretKey = 'mynameisharshal';
const userSchema = new Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    email: String,
});
const User = mongoose.model('User', userSchema);

const resourceSchema = new Schema({
    Name: String,
    Email: [String],
    Phone: [String],
    Links: [String],
    Skills: [String],
    Recommended_Skills: [String],
    Resume_Score: Number,
    pdf_path: String,

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}
    , { timestamps: true });
const Resource = mongoose.model('Resource', resourceSchema);

const VideoResumeSchema = new mongoose.Schema({
    AboutMe: String,
    input_file: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});
const VideoResumeModel = mongoose.model("Video-resume", VideoResumeSchema);


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        req.token = token;
        next();
    });
}

app.post('/signup', async (req, res) => {
    const { username, password, email, firstName, lastName } = req.body;
    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Password must contain at least one number, one symbol, one uppercase letter, one lowercase letter, and be at least 8 characters long' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }
    if (!firstName || !lastName) {
        return res.status(400).json({ message: 'First name and last name are required' });
    }
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const hashedPassword = await argon2.hash(password);
        const user = new User({ username, password: hashedPassword, email, firstName, lastName });
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const validPassword = await argon2.verify(user.password, password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ token: user._id }, secretKey);
        const userResources = await Resource.findOne({ user: user._id });

        res.json({ token, hasResources: !!userResources });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint to Post resources to the Database.
app.post('/resources', authenticateToken, async (req, res) => {
    const { username, Name, Email, Phone, Links, Skills, Resume_Score, pdf_path } = req.body;
    const userId = req.user.token;
    try {
        const resource = new Resource({ username, Name, Email, Phone, Links, Skills, Resume_Score, pdf_path, user: userId });
        const savedResource = await resource.save();
        res.status(201).json(savedResource);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Endpoint to Fetch resources from the Database.
app.get('/resources', authenticateToken, async (req, res) => {
    const userId = req.user.token;
    try {
        const resource = await Resource.findOne({ user: userId }).sort({ createdAt: -1 });
        if (resource) {
            res.json(resource);
        } else {
            res.status(404).json({ message: 'Resource not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.post('/videoResources', authenticateToken, async (req, res) => {
    const { AboutMe, input_file } = req.body;
    const userId = req.user.token;
    try {
        const videoResource = new VideoResumeModel({ AboutMe, input_file, user: userId });
        const savedResource = await videoResource.save();
        res.status(201).json(savedResource);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/videoResources', authenticateToken, async (req, res) => {
    const userId = req.user.token;
    try {
        const resource = await VideoResumeModel.findOne({ user: userId }).sort({ createdAt: -1 });
        if (resource) {
            res.json(resource);
        } else {
            res.status(404).json({ message: 'Resource not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
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
let resumeFileName = '';

app.post('/upload', authenticateToken, upload.single('resume'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const resumeFilePath = req.file.path;
    resumeFileName = req.file.originalname;
    console.log('Reading Resume.....');
    const pyProg = spawn('python', ['./app.py', resumeFilePath, req.token]);
    console.log('Running Python Script....');
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

const storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './video'); // change the destination directory as needed
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload1 = multer({ storage: storage1 });
let videoFileName = "videoResume.mp4"
app.post('/uploadVideo', authenticateToken, upload1.single('videoResume'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const videoFilePath = req.file.path;
    const videoFileName = req.file.originalname;
    console.log(videoFilePath)
    console.log('Reading Video...');

    const pyProg = spawn('python', ['./video.py', videoFilePath, req.token]);
    console.log('Running Python Script...');

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
        } else {
            res.status(500).send(`Video processing failed. Error: ${errorData}`);
        }
    });
});

app.get('/resumeName', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.token;

        console.log(userId) // Assume resourceId is passed as a query parameter
        if (!userId) {
            return res.status(400).send('Resource ID is required');
        }

        const resource = await Resource.findOne({ user: userId });
        console.log(resource)
        if (!resource || !resource.pdf_path) {
            return res.status(404).send('Resume not found');
        }

        const filePath = path.join(__dirname, resource.pdf_path);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error('Error reading resume file:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.setHeader('Content-Type', 'application/pdf');
            res.send(data);
        });
    } catch (err) {
        console.error('Error fetching resource:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/job', async (req, res) => {
    const { keyword } = req.query;
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const formattedDate = twoWeeksAgo.toISOString().split('T')[0];
    const options = {
        method: 'GET',
        url: 'https://rapid-linkedin-jobs-api.p.rapidapi.com/search-jobs',
        params: {
            keywords: keyword || 'Python',
            locationId: '102713980',
            datePosted: formattedDate,
            sort: 'mostRelevant'
        },
        headers: {
            'X-RapidAPI-Host': 'rapid-linkedin-jobs-api.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/jobs', async (req, res) => {
    try {
        const jobsData = JSON.parse(fs.readFileSync('./json/data.json', 'utf8'));
        res.json(jobsData);
    } catch (error) {
        console.error('Error reading job data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/T', async (req, res) => {
    const searchTerms = req.query.search_terms || 'Java Developer';
    const location = 'India';
    const page = '1';

    const options = {
        method: 'POST',
        url: 'https://linkedin-jobs-search.p.rapidapi.com/',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Host': 'linkedin-jobs-search.p.rapidapi.com'
        },
        data: {
            search_terms: searchTerms,
            location: location,
            page: page
        }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));