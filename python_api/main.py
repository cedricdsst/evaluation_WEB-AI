# main.py
from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


model_note = pickle.load(open('models/model_note.pkl', 'rb'))
model_annee = pickle.load(open('models/model_annee.pkl', 'rb'))
model_garage = pickle.load(open('models/model_garage.pkl', 'rb'))
model_balcon = pickle.load(open('models/model_balcon.pkl', 'rb'))
encoder = pickle.load(open('models/encoder.pkl', 'rb'))


class NoteRequest(BaseModel):
    ville: str
    surface: float
    price: float

class AnneeRequest(BaseModel):
    ville: str

class GarageRequest(BaseModel):
    ville: str
    price: float

class BalconRequest(BaseModel):
    ville: str
    price: float

@app.post('/predict/note')
def predict_note(data: NoteRequest):
 
    df = pd.DataFrame([data.dict()])
    X = df[['ville', 'surface', 'price']]
    print("Input DataFrame:")
    print(X)

 
    X_encoded = encoder.transform(X[['ville']])
    print("Encoded 'ville':")
    print(X_encoded.toarray())


    feature_names = encoder.get_feature_names_out()
    print("Feature names:", feature_names)


    X_encoded_df = pd.DataFrame(X_encoded.toarray(), columns=feature_names)
    print("Encoded DataFrame:")
    print(X_encoded_df)

 
    X_final = pd.concat([X_encoded_df.reset_index(drop=True), X[['surface', 'price']].reset_index(drop=True)], axis=1)
    print("Final DataFrame for prediction:")
    print(X_final)


    note_pred = model_note.predict(X_final)[0]

    return {'note': note_pred}



