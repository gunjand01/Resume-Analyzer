import csv
import json
import os
import random
import re
import statistics
import warnings
import fitz
import spacy
import pyresparser
import pandas as pd
import sys
import requests
from spacy.matcher import Matcher
from fuzzywuzzy import fuzz
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk import pos_tag, word_tokenize
from spacy import load
from sklearn.ensemble import RandomForestRegressor
from sklearn.feature_extraction.text import TfidfVectorizer
from fitz import open as fitz_open
from pymongo import MongoClient
from dotenv import load_dotenv
import random
import joblib 

# Load environment variables from .env file
load_dotenv()

# Connect to MongoDB
mongodb_uri = os.getenv("MONGODB_URI")
client = MongoClient(mongodb_uri)
db = client.MajorProject
collection = db.resume_datas


stop_words = stopwords.words('english')
lemmatizer = WordNetLemmatizer()
nlp = load('en_core_web_lg')
nlp_sm = spacy.load("en_core_web_sm")
matcher = Matcher(nlp.vocab)
    
# Function to preprocess text
def preprocess_text(text):
    doc = nlp(text)
    return " ".join(token.lemma_ for token in doc if not token.is_stop and token.is_alpha and len(token.text) > 2)

# Function to read skills from CSV
def read_skills_from_csv(csv_file):
    with open(csv_file, 'r', newline='', encoding='utf-8') as file:
        reader = csv.reader(file)
        skills = [row[0].strip('" \n') for row in reader]
    return skills

# Function to extract text from PDF
def extract_text_from_pdf(pdf_file):
    text = ""
    with fitz.open(pdf_file) as doc:
        text = " ".join(page.get_text() for page in doc)
    return text


# Function to extract name
def extract_name(resume_text):
    nlp_text = nlp_sm(resume_text)
    pattern = [{'POS': 'PROPN'}, {'POS': 'PROPN'}]
    matcher.add('NAME', [pattern])
    matches = matcher(nlp_text)
    for match_id, start, end in matches:
        span = nlp_text[start:end]
        return span.text

# Function to extract email
def extract_email(doc):
    email_pattern = [{"TEXT": {"REGEX": "[a-zA-Z0-9-_.]+@[a-zA-Z0-9-_.]+"}}]
    matcher.add("Email", [email_pattern])
    matches = matcher(doc)
    return [doc[start:end].text for match_id, start, end in matches if nlp.vocab.strings[match_id] == "Email"]

# Function to extract phone
def extract_phone(doc):
    phone_pattern = [{"TEXT": {"REGEX": r"\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}"}}]
    matcher.add("Phone", [phone_pattern])
    matches = matcher(doc)
    return [doc[start:end].text for match_id, start, end in matches if nlp.vocab.strings[match_id] == "Phone"]

# Function to extract links
def extract_links(doc):
    link_pattern = [{"TEXT": {"REGEX": r"https?://[^\s]+"}}]
    matcher.add("Link", [link_pattern])
    matches = matcher(doc)
    return [doc[start:end].text for match_id, start, end in matches if nlp.vocab.strings[match_id] == "Link"]

# Function to parse resume
def parse_resume(filepath, extract_fields=None):
    warnings.filterwarnings("ignore", category=UserWarning)
    try:
        data = pyresparser.ResumeParser(filepath).get_extracted_data()
        if extract_fields is None:
            print(data)
            return data
        else:
            selected_data = {field: data[field] for field in extract_fields if field in data}
            return selected_data
    except Exception as e:
        print(f"Error parsing resume: {e}")
        return None

# Train Random Forest Classifier
def train_classifier(resumes, scores):
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(resumes)
    clf = RandomForestRegressor()
    clf.fit(X, scores)
    print(clf)
    return clf

# Function to calculate resume score using trained classifier
def calculate_resume_score(your_resume, all_resumes, clf):
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(all_resumes)
    your_resume_vec = vectorizer.transform([your_resume])
    print(your_resume_vec)
    return clf.predict(your_resume_vec)[0]

clf = joblib.load('./ML/resume_classifier.joblib')
vectorizer = joblib.load('./ML/vectorizer.joblib')

def predict_scores(new_resumes):
    preprocessed_resumes = [preprocess_text(resume) for resume in new_resumes]
    X_new = vectorizer.transform(preprocessed_resumes)
    predicted_scores = clf.predict(X_new)
    return predicted_scores


def main(pdf_file,token):
    # Paths and settings
    skills_csv_file = './dataset/skills.csv'
    extract_fields = ["name", "email", "skills"]
    extracted_data = parse_resume(pdf_file, extract_fields)
    
    # Extracted text from PDF
    resume_text = extract_text_from_pdf(pdf_file)

    name = extract_name(resume_text)

    # Extract email, phone, links
    email = extract_email(nlp(resume_text))
    phone = extract_phone(nlp(resume_text))
    links = extract_links(nlp(resume_text))
    extracted_skills = extracted_data.get("skills", [])

    # Extracted skills from CSV
    skills_list = read_skills_from_csv(skills_csv_file)

    # Train the classifier
    # resumes_df = pd.read_csv("./dataset/URds.csv")
    # resumes_df["preprocessed_text"] = resumes_df["Resume"].fillna("") + " " + resumes_df["Category"].fillna("")
    # resumes_df["preprocessed_text"] = resumes_df["preprocessed_text"].apply(preprocess_text)
    # good_resumes = resumes_df["preprocessed_text"].tolist()
    # training_resumes = good_resumes
    # training_scores = [random.uniform(50, 100) for _ in range(len(good_resumes))]
    # clf = train_classifier(training_resumes, training_scores)


    # Calculate resume score for the given resume
    # resume_score = calculate_resume_score(preprocess_text(resume_text), good_resumes, clf)
    new_resumes =[preprocess_text(resume_text)]
    resume_score = predict_scores(new_resumes)
    resume_score = statistics.mean(resume_score)
    # print(resume_score)
    
    # Save the resume score and recommended skills in the final data
    final_data = {
        "Name": name,
        "Email": email,
        "Phone": phone,
        "Links": links,
        "Skills": extracted_data.get("skills", []),
        "Resume_Score": resume_score,
        "pdf_path":pdf_file,
    }
    
    node_server_url = "http://localhost:3001/resources"
    # Include t he token in the Authorization header
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    # Send the HTTP request with the token in the headers
    response = requests.post(node_server_url, json=final_data, headers=headers)

    # Check the response status code
    if response.status_code == 201:
        print("Resume data saved successfully")
    else:
        print(f"Failed to save resume data: {response.text}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python app.py <pdf_file> <token>")
        sys.exit(1)
    pdf_file = sys.argv[1]
    # print(pdf_file)
    token = sys.argv[2]
    main(pdf_file,token)
