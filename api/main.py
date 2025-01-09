from fastapi import FastAPI, File, UploadFile
import uvicorn
from PIL import Image
from io import BytesIO
import numpy as np
import tensorflow as tf
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

MODELPOTATO = tf.keras.models.load_model("../saved_models/potato/model1.keras")
MODELPAPPER = tf.keras.models.load_model("../saved_models/papper/model1.keras")
MODELFINDER = tf.keras.models.load_model("../saved_models/typefinder/model2.keras")

CLASS_NAMES_POTATO = ["Early Blight", "Late Blight", "Healthy"]
CLASS_NAMES_PAPPER = ["Bacteria Spots", "Healthy"]
CLASS_NAMES_FINDER = ["Papper", "Potato"]

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

@app.post("/predict/potato")
async def predict(
    file : UploadFile = File(...)
):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)
    prediction = MODELPOTATO.predict(img_batch)
    predicted_class = CLASS_NAMES_POTATO[np.argmax(prediction[0])]
    confidence = float(np.max(prediction[0]))
    return {
            "Health " : predicted_class,
            "confidence " : confidence
            }
    
@app.post("/predict/papper")
async def predict(
    file : UploadFile = File(...)
):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)
    prediction = MODELPAPPER.predict(img_batch)
    predicted_class = CLASS_NAMES_PAPPER[np.argmax(prediction[0])]
    confidence = float(np.max(prediction[0]))
    
    return {
            "Health " : predicted_class,
            "confidence " : confidence
            }



@app.post("/predict/finder")
async def predict(
    file : UploadFile = File(...)
):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)
    prediction = MODELFINDER.predict(img_batch)
    predicted_class = CLASS_NAMES_FINDER[np.argmax(prediction[0])]
    confidence1 = float(np.max(prediction[0]))
    predicted_class2 = "none"
    
    if predicted_class == "Potato":
        prediction1 = MODELPOTATO.predict(img_batch)
        predicted_class2 = CLASS_NAMES_POTATO[np.argmax(prediction1[0])]

    elif predicted_class == "Papper" :
        prediction1 = MODELPAPPER.predict(img_batch)
        predicted_class2 = CLASS_NAMES_PAPPER[np.argmax(prediction1[0])]

    confidence2 = float(np.max(prediction1[0]))
    confidence = (confidence1+confidence2)/2
    
    return {
            "Health " : predicted_class2,
            "confidence " : confidence
            }


if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)