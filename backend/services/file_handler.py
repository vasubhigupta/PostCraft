import fitz  
import pytesseract
from PIL import Image
import io

async def extract_text(file):
    content = await file.read()
    
    if file.filename.endswith(".pdf"):
        doc = fitz.open("pdf", content)
        text = ""
        for page in doc:
            text += page.get_text()
        return text.strip()
    
    elif file.filename.endswith((".png", ".jpg", ".jpeg")):
        image = Image.open(io.BytesIO(content))
        text = pytesseract.image_to_string(image)
        return text.strip()
    
    else:
        return "File Type not supported"
