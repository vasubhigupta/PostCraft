import os
import json
from fastapi import HTTPException
from dotenv import load_dotenv
import logging
import google.generativeai as genai

load_dotenv()


# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-pro")

def build_prompt(text: str) -> str:
    return f"""
You are an expert social media and SEO content strategist. Analyze the following post and improve it for maximum engagement and SEO.

Post:
---
{text}
---

Perform the following tasks and return the results in **strict JSON format** with these keys:

1. "analysis": A short evaluation of the current post, including strengths, weaknesses, tone, clarity, engagement potential, and SEO effectiveness.
2. "recommendations": Specific actionable suggestions to improve engagement, readability, and SEO. Include:
   - Keywords or hashtags to add
   - Calls-to-action (CTAs)
   - Formatting improvements (lists, headings, line breaks)
   - Tone adjustments if needed
3. "rewrite": Rewrite the post in a polished, engaging, and SEO-friendly manner. Include suggested keywords, hashtags, and CTAs naturally.

Constraints:
- Strictly return valid JSON (no extra commentary or text outside JSON)
- Use clear and concise language
- Ensure readability and attention-grabbing structure
"""

def clean_ai_output(raw_output: str) -> str:
    cleaned = raw_output.replace("```json", "").replace("```", "").strip()
    return cleaned

def format_to_string(data):
    if isinstance(data, dict):
        return "\n".join([f"{k.replace('_', ' ').title()}: {v}" for k, v in data.items()])
    elif isinstance(data, list):
        return "\n".join([str(item) for item in data])
    print(str(data))
    return str(data)

def analyze_text(text: str) -> dict:
    if not text.strip():
        raise HTTPException(status_code=400, detail="No text provided for analysis.")

    prompt = build_prompt(text)

    try:
        response = model.generate_content(prompt)
        raw_output = response.text.strip()
        cleaned_output = clean_ai_output(raw_output)

        # Attempt to parse JSON
        try:
            result = json.loads(cleaned_output)
        except json.JSONDecodeError as e:
            logging.error(f"JSON parsing failed: {e}\nRaw output: {raw_output}")
            raise HTTPException(
                status_code=500,
                detail="AI returned invalid JSON. Please try again."
            )

        # Ensure all keys exist in string format
        return {
            "analysis": format_to_string(result.get("analysis", "No analysis provided.")),
            "recommendations": format_to_string(result.get("recommendations", "No recommendations provided.")),
            "rewrite": format_to_string(result.get("rewrite", "No rewrite provided."))
        }

    except HTTPException:
        # Reraise known HTTP errors
        raise
    except Exception as e:
        logging.error(f"Unexpected error during analysis: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error during analysis: {str(e)}"
        )
