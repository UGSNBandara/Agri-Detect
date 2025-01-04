from fastapi import FastAPI, File, UploadFile
import uvicorn
from PIL import Image
from io import BytesIO
import numpy as np
import tensorflow as tf
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

MODEL = tf.keras.models.load_model("../saved_models/1/model1.keras")
CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def read_file_as_image(data : bytes) -> np.ndarray:
    image = np.asarray(Image.open(BytesIO(data)))
    return image

@app.get("/ping")
async def ping():
    return "Hello, World!, I am alive"

@app.post("/predict")
async def predict(
    file : UploadFile = File(...)
):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)
    prediction = MODEL.predict(img_batch)
    predicted_class = CLASS_NAMES[np.argmax(prediction[0])]
    confidence = float(np.max(prediction[0]))
    return {
            "Health " : predicted_class,
            "confidence " : confidence
            }


if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)