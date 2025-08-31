# 📖 PostCraft

PostCraft is a text extraction and analysis tool that allows users to upload PDFs or Images and get meaningful insights. The system extracts text using OCR (Tesseract) and PyMuPDF, analyzes it with Gemini, and returns structured insights — making document analysis smarter and faster.

---

## ✨ Features

- 📂 **Multi-format Support** – Upload PDFs and Images.
- 🔍 **OCR Support** – Extracts text from images using Tesseract OCR.
- 📑 **PDF Parsing** – Extracts text from PDFs using PyMuPDF.
- 🤖 **AI-Powered Analysis** – Uses Google Gemini API for summarization, insights, and keyword extraction.
- ⚡ **FastAPI Backend** – REST APIs to handle file upload and text analysis.
- 🎨 **React Frontend** – Simple UI to upload and analyze documents.
- 🐳 **Dockerized Deployment** – Render-ready with Tesseract preinstalled.

---

## ⚙️ Installation (Local Setup)

### 1️⃣ Clone the Repository
```
git clone https://github.com/MrApoorv/insightlify.git
cd insightlify
```

### 2️⃣ Backend Setup (FastAPI)
```
cd backend
pip install -r requirements.txt
```
Create a .env file in backend/ with:
```
GEMINI_API_KEY=your_google_gemini_api_key
PORT=8000
ENV=DEV
```
Run backend:
```
uvicorn main:app --reload --port 8000
```
### 3️⃣ Frontend Setup (React)
```
cd frontend
npm install
```
Create a .env file in frontend/ with:
```
REACT_APP_ENV=DEV
REACT_APP_DEVELOPMENT_URL=http://localhost:8000
REACT_APP_PRODUCTION_URL=yourdomain
```
Run frontend:
```
npm start
```

👉 With this setup, just upload a PDF or Image → extract → analyze → get insights instantly.

## 📊 Analysis Output

# 1. "analysis"

This is a short evaluation of the original post. It typically includes:

Strengths – What’s already working in the post (e.g., clear announcement, engaging tone, product mention).

Weaknesses – Areas that are weak or missing (e.g., lacks keywords, no CTA, low engagement potential).

Tone – Observations about whether the tone is formal, casual, persuasive, boring, etc.

Clarity – How easy it is to read and understand the post.

Engagement potential – How likely it is to get likes, shares, or comments.

SEO effectiveness – Whether the post includes relevant keywords, hashtags, or SEO-friendly phrasing.
Example snippet:
```
"The post is brief and announces a new product, but it lacks specificity and excitement. Engagement potential is low due to absence of storytelling, benefits, or strong CTAs. SEO effectiveness is minimal."
```

# 2. "recommendations"

This provides specific, actionable advice to improve the post. It is broken down into categories:

keywords_hashtags – Suggested SEO keywords or hashtags to include for better search visibility and reach.

calls_to_action (CTAs) – Phrases that encourage readers to take an action (e.g., “Shop now”, “Learn more”).

formatting – Suggestions to make the post more readable and visually appealing (e.g., use lists, headings, line breaks).

tone_adjustments – Advice on improving tone for better engagement (e.g., make it more energetic, humorous, persuasive, friendly).
Example snippet:
```
{
  "keywords_hashtags": ["#NewProduct", "#Launch", "#Innovation"],
  "calls_to_action": ["Shop today", "Don't miss out!"],
  "formatting": ["Use bullet points for key benefits", "Add line breaks"],
  "tone_adjustments": "Make the tone more energetic and persuasive."
}
```

#3. "rewrite"

This is a fully polished, rewritten version of the original post, optimized for:

Engagement – Catchy, attention-grabbing structure and tone.

SEO – Includes suggested keywords and hashtags naturally.

Readability – Clear formatting like bullet points, headings, line breaks.

CTAs – Includes actionable phrases to drive conversions or interaction.

Example snippet:
```
"🚀 Introducing our latest innovation: the Ultimate Smart Gadget!

✨ Key Benefits:
- Sleek design and top-notch performance
- Easy to use and compatible with all devices
- Perfect gift for tech enthusiasts

Don't miss out — shop today and be among the first to experience the future of tech!

#NewProduct #Launch #Innovation #MustHave #TechGadgets"
```
# ✅ Key Points About the Output:

Actionable – You get both analysis and practical steps to improve the post.

Ready-to-use – The rewrite can be posted as-is on social media.

Structured – Helps separate evaluation, recommendations, and the final optimized post for easy display in your app (like PostCraft).

## 🗂️ Project Structure
```
project-root/
│── backend/
│   ├── main.py                 # FastAPI entrypoint
│   ├── endpoints/              # API routers
│   │   └── analyze.py          # AI model integrations
│   ├── services/               # Business logic
│   │   └── analyzer_service.py
│   │   └── file_utils.py       # File helpers (OCR, PDF parsing)
│   ├── requirements.txt
│   └── Dockerfile
│
│── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Homepage.js     # Upload & analyze component
│   │   │   └── Homepage.css    # CSS for Homepage.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
│
└── README.md
```
## 🛠️ Challenges Faced
⚡ Tesseract Installation – Deploying Tesseract OCR on Render required a custom Docker setup since pytesseract only provides Python bindings. Solution: Dockerfile installs tesseract-ocr in the container alongside Python dependencies.

🌐 CORS Issues – Ensuring frontend (React) could communicate with backend (FastAPI) required proper CORS policies and environment-based URLs.

🔑 Environment Management – Needed separate .env handling for development and production in both backend and frontend.

🚀 Deployment
Backend runs on Render using Docker (with Tesseract preinstalled).

Frontend can be hosted on Netlify/Vercel and configured to call the Render backend.

