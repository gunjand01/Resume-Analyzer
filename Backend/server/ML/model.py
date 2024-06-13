print("Running Start")
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestRegressor
import random
from spacy import load
import joblib
print("Running NLP")
nlp = load('en_core_web_lg')
print("Running  Spacy")
# Assuming preprocess_text is defined elsewhere
def preprocess_text(text):
    doc = nlp(text)
    return " ".join(token.lemma_ for token in doc if not token.is_stop and token.is_alpha and len(token.text) > 2)
# and the dataset URds.csv is in the correct directory
print("Running Pre Text")

# Load and preprocess the data
resumes_df = pd.read_csv("../dataset/URds.csv")
resumes_df["preprocessed_text"] = resumes_df["Resume"].fillna("") + " " + resumes_df["Category"].fillna("")
resumes_df["preprocessed_text"] = resumes_df["preprocessed_text"].apply(preprocess_text)
good_resumes = resumes_df["preprocessed_text"].tolist()

print("Running Training Score")

# Generate random scores for training
training_scores = [random.uniform(50, 100) for _ in range(len(good_resumes))]
print("Running Classifier")

# Train the classifier
def train_classifier(resumes, scores):
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(resumes)
    clf = RandomForestRegressor()
    clf.fit(X, scores)
    return clf, vectorizer

# Train and save the model and vectorizer
print("Running")
clf, vectorizer = train_classifier(good_resumes, training_scores)
print("Running 1")

joblib.dump(clf, 'resume_classifier.joblib')  # Save the model
print("Running 3")

joblib.dump(vectorizer, 'vectorizer.joblib')  # Save the vectorizer