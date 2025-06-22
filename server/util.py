import json
import pickle
import numpy as np

__location = None
__data_cols = None
__model = None

def get_location():
    return __location

def predict_price(location, sqft, bath, bhk):
    try:
        loc_index = __data_cols.index(location.lower())
    except:
        loc_index = -1

    x = np.zeros(len(__data_cols))
    x[0] = float(sqft)
    x[1] = float(bath)
    x[2] = float(bhk)

    if loc_index >= 0:
        x[loc_index] = 1

    return round(__model.predict([x])[0], 2)

def load_save_artifacts():
    global __data_cols, __location, __model

    with open(r'C:\Users\HP\ML-projects\server\artifects\columns.json', 'r') as f:
        __data_cols = json.load(f)['data_columns']
        __location = __data_cols[3:]  # Assuming first 3 cols are sqft, bath, bhk

    with open(r'C:\Users\HP\ML-projects\server\artifects\predictionModel', 'rb') as f:
        __model = pickle.load(f)
