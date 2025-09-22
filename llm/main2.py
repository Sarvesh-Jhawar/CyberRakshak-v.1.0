import requests
import json
import base64
import os

# -----------------------------
# Configuration
# -----------------------------
DEEPSEEK_API_KEY = "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"
GEMINI_API_KEY = "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"

DEEPSEEK_URL = "https://openrouter.ai/api/v1/chat/completions"
GEMINI_URL = "https://openrouter.ai/api/v1/chat/completions"

# -----------------------------
# Step 0: User input
# -----------------------------
text_input = """You are a cyber incident assistant specializing in Phishing and Spear-Phishing threats. 
Analyze the input and generate structured JSON with detection_summary, user_alert, playbook, evidence_to_collect, severity, cert_alert, technical_details, ui_labels."""
# Set to None if no image uploaded
image_path = r"C:\Users\anura\Desktop\ai\image.png"  # or None

# -----------------------------
# Step 1: Convert image to text using Gemini (if image provided)
# -----------------------------
if image_path and os.path.exists(image_path):
    with open(image_path, "rb") as f:
        image_bytes = f.read()
        encoded_image = base64.b64encode(image_bytes).decode()

    gemini_headers = {
        "Authorization": f"Bearer {GEMINI_API_KEY}",
        "Content-Type": "application/json"
    }

    gemini_data = {
        "model": "google/gemini-2.5-flash-preview-image",
        "messages": [
            {
                "role": "user",
                "content": f"Describe the content of this image in text:\ndata:image/jpeg;base64,{encoded_image}"
            }
        ],
        "max_tokens": 1024,
        "temperature": 0
    }

    try:
        gemini_response = requests.post(GEMINI_URL, headers=gemini_headers, data=json.dumps(gemini_data), timeout=30)
        gem_result = gemini_response.json()

        # Safely extract text
        text_input = None
        if "choices" in gem_result and len(gem_result["choices"]) > 0:
            choice = gem_result["choices"][0]
            text_input = choice.get("message", {}).get("content") or choice.get("content")
        if not text_input:
            print("Warning: Gemini response missing 'content', using default text.")
            text_input = """You are a cyber incident assistant specializing in Phishing and Spear-Phishing threats. 
Analyze the input and generate structured JSON with detection_summary, user_alert, playbook, evidence_to_collect, severity, cert_alert, technical_details, ui_labels."""

        print("Text extracted from image:\n", text_input)

    except (requests.RequestException, json.JSONDecodeError) as e:
        print("Gemini request failed or returned invalid JSON:", str(e))
        print("Using default text input.")

else:
    print("No image provided, using default text input.")

# -----------------------------
# Step 2: Analyze text with DeepSeek
# -----------------------------
deepseek_headers = {
    "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
    "Content-Type": "application/json"
}

deepseek_prompt = f"""
You are a cyber incident assistant specializing in Phishing and Spear-Phishing threats. 
Analyze the following input and generate a structured JSON object with:
1. detection_summary
2. user_alert
3. playbook
4. evidence_to_collect
5. severity
6. cert_alert
7. technical_details
8. ui_labels

Rules: Output only valid JSON, keep end-user language simple and actionable.

INPUT: {text_input}
"""

deepseek_data = {
    "model": "deepseek/deepseek-v3.1-terminus",
    "messages": [{"role": "user", "content": deepseek_prompt}],
    "max_tokens": 800
}

try:
    deepseek_response = requests.post(DEEPSEEK_URL, headers=deepseek_headers, data=json.dumps(deepseek_data), timeout=30)
    result = deepseek_response.json()

    deepseek_json = None
    if "choices" in result and len(result["choices"]) > 0:
        choice = result["choices"][0]
        deepseek_json = choice.get("message", {}).get("content") or choice.get("content")

    if deepseek_json:
        print("\nDeepSeek JSON Analysis:\n", deepseek_json)
    else:
        print("DeepSeek response missing 'content'.")
except (requests.RequestException, json.JSONDecodeError) as e:
    print("DeepSeek request failed or returned invalid JSON:", str(e))
