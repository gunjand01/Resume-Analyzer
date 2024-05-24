import moviepy.editor as mp
import speech_recognition as sr
import sys
import os
from pymongo import MongoClient
import requests
import language_tool_python


mongodb_uri = os.getenv("MONGODB_URI")
client = MongoClient(mongodb_uri)
db = client.MajorProject
collection = db.video_resume


def correct_grammar(text):
    tool = language_tool_python.LanguageTool('en-US')
    matches = tool.check(text)
    corrected_text = language_tool_python.utils.correct(text, matches)
    return corrected_text

# Function to COnvert Video to Text


def video_to_text(video_path):
    video_clip = mp.VideoFileClip(video_path)
    audio_clip = video_clip.audio
    temp_audio_path = "./video/temp_audio.wav"
    audio_clip.write_audiofile(temp_audio_path)
    recognizer = sr.Recognizer()
    with sr.AudioFile(temp_audio_path) as source:
        audio_data = recognizer.record(source)
    try:
        text = recognizer.recognize_google(audio_data)
        document = {"video_path": video_path, "extracted_text": text}
        return text
    except sr.UnknownValueError:
        return "Speech recognition could not understand the audio"
    except sr.RequestError as e:
        return f"Could not request results from Google Speech Recognition service; {e}"
    finally:
        if os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)


def main(input_file, token):
    if input_file.lower().endswith(('.mp4', '.avi', '.mkv')):
        AboutMe = correct_grammar(video_to_text(input_file))

        payload = {
            "AboutMe": AboutMe,
            "input_file": input_file
        }
        print(payload)
        node_server_url = "http://localhost:3001/videoResources"
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }

        response = requests.post(
            node_server_url, json=payload, headers=headers)

        if response.status_code == 201:
            print("Video Resume data saved successfully")
        else:
            print(f"Failed to save video resume data: {response.text}")

    else:
        print("Unsupported file format. Please provide a valid video file.")
        return

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python app.py <input_file> <token>")
        sys.exit(1)
    input_file = sys.argv[1]
    token = sys.argv[2]
    main(input_file, token)
