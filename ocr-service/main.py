from fastapi import FastAPI, File, UploadFile
import easyocr
import numpy as np
import cv2

app = FastAPI()

# This loads the OCR "brain" once when the server starts.
reader = easyocr.Reader(['en'])

@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    # Read the uploaded image into memory
    contents = await file.read()
    image_array = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    # Run OCR on the image
    results = reader.readtext(image)

    # Format the results nicely, converting numpy types to plain Python types
    lines = []
    for (box, text, confidence) in results:
        # box is a list of 4 [x, y] corner points — convert every number to a plain int
        clean_box = [[int(point[0]), int(point[1])] for point in box]

        lines.append({
            "text": text,
            "confidence": round(float(confidence), 2),
            "box": clean_box
        })

    return {"lines": lines}

@app.get("/")
async def health_check():
    return {"status": "OCR service is running"}