# 🧠 AI Summary Chrome Extension

A Chrome extension that summarizes the content of any webpage using Google’s Gemini API. Choose from brief, detailed, or bullet-point summaries – right from your browser!

---

## 🚀 Features

- 🔍 Extracts article or paragraph text from any open tab
- 🤖 Uses Gemini Pro API (via Google AI Studio) to generate summaries
- 📋 Three summary types: **Brief**, **Detailed**, and **Bullet Points**
- 🔐 Secure API key storage via Chrome's `storage.sync`
- 🧾 Copy the summary to clipboard instantly
- 🧼 Handles long articles by auto-truncating text
- ⚡ Powered by JavaScript, HTML, CSS, and Chrome APIs


---

## 📦 How to Install (Developer Mode)

1. Clone this repo or download the ZIP.
2. Visit `chrome://extensions/` in Chrome.
3. Enable **Developer mode** (top right).
4. Click **Load Unpacked** and select the project folder.
5. On first run, it will prompt you to enter your **Gemini API key**.

---

## 🔑 How to Get a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account.
3. Generate an API key and copy it.
4. Paste it in the extension's **Options page**.

---

## 🧠 How It Works

1. When user clicks "Summarize This Page":
   - Content script extracts page text.
   - Popup fetches stored API key.
   - Sends prompt + text to Gemini API.
   - Displays returned summary in popup.

2. Summary types available:
   - **Brief**: 2–3 sentence overview
   - **Detailed**: Full paragraph summary
   - **Bullets**: 5–7 bullet points starting with `-`

---

## 🛠 Tech Stack

- JavaScript (ES6+)
- HTML + CSS
- Chrome Extensions (Manifest v3)
- Google Gemini API (via REST)
- Storage & messaging APIs

---

## 📁 Project Structure

```bash
AI-Summary-Extension/
├── manifest.json
├── popup.html / popup.js
├── content.js
├── options.html / options.js
├── background.js
├── icon.png
└── README.md
