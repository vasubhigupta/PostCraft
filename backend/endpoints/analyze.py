from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from services import file_handler, analyzer

router = APIRouter(prefix="/analyze", tags=["Analyze"])

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    try:
        allowed_types = [".txt", ".pdf", ".png", ".jpg", ".jpeg"]
        if not any(file.filename.lower().endswith(ext) for ext in allowed_types):
            raise HTTPException(status_code=400, detail="Unsupported file type")

        text = await file_handler.extract_text(file)
        if not text.strip():
            raise HTTPException(status_code=422, detail="No text could be extracted from file")

        result = analyzer.analyze_text(text)

        return JSONResponse(content={
            "extracted_text": text,
            "analysis": result.get("analysis", "No analysis available"),
            "recommendations": result.get("recommendations", "No recommendations available"),
            "rewrite": result.get("rewrite", "No rewrite available")
        })

    except HTTPException as e:
        raise e
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Internal server error: {str(e)}"}
        )

