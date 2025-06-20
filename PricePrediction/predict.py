import pandas as pd
import numpy as np
from matplotlib import pyplot as plt
import matplotlib 
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn import linear_model
from sklearn.model_selection import cross_val_score, ShuffleSplit
from sklearn.model_selection import GridSearchCV
from sklearn.tree import DecisionTreeRegressor
import pickle
import json
matplotlib.rcParams['figure.figsize'] = (20, 10)

df=pd.read_csv('Bengaluru_House_Data.csv')
print(df.head())


# print(df.shape)


# get the count of area type by aggregation
df_count=df.groupby('area_type')['area_type'].agg('count')
print(df_count)

df1=df.drop(['area_type', 'society', 'balcony','availability'], axis=1)
# print(df1.shape)
# print(df1.head())

# print(df1.isnull().sum())
# df1['total_sqft'].fillna(df1['total_sqft'].mean())


# drop the na values

df2=df1.dropna()
print(df2.isnull().sum())


df2['bhk']=df2['size'].apply(lambda x:int( x.split(' ')[0]))
print(df2.head())

df2=df2.drop('size',axis=1)
print(df2['bhk'].unique())#indicates their are outliers
df2_out=df2[df2['bhk']>=20]
print(df2_out)#2400 sq ft and 43 bedrooms


print(df2['total_sqft'].unique()) #113-1348 this is a range not a number


def is_float(X):
    try:
        float(X)
    except:
        return False
    return True

def con_sqft_to_num(x):
    if pd.isna(x):
        return None
    if isinstance(x, (int, float)):
        return float(x)
    if isinstance(x, str):
        # Remove commas and trim whitespace
        x = x.replace(',', '').strip()
        
        # Handle cases like "34.46Sq."
        # Extract first sequence of digits and decimals
        import re
        match = re.search(r'[\d\.]+', x)
        if match:
            try:
                return float(match.group())
            except:
                return None
        return None
    return None

# df2[df2['total_sqft'].apply(is_float)]
# print(con_sqft_to_num(1231-1340))
df3=df2.copy()
df3['total_sqft']=df3['total_sqft'].apply(con_sqft_to_num)

# df3.loc[30]will give the values on 30 posiitioned

# print(f"Null values after conversion: {df3['total_sqft'].isnull().sum()}")
# df3 = df3.dropna(subset=['total_sqft'])

# print(df3.head())


df4=df3.copy()
df4['price_sqft']=df4['price']*100000/df4['total_sqft']
print(len(df4['location'].unique()))#1304
df4['location']=df4['location'].apply(lambda x: x.strip())
location_stat=df4.groupby('location')['location'].agg('count').sort_values(ascending=False)#how many data row a location has 
location_lessthen10=location_stat[location_stat<=10]
df4['location']=df4['location'].apply(lambda x: 'other' if x in location_lessthen10 else x)
print(location_stat)
print(df4.head())

# df_outlier=df4['total_sqft']/df4['bhk']
# print(df_outlier)
df5=df4[~(df4['total_sqft']/df4['bhk']>300)]#way of removing outliers

print(df5.shape)
print(df4.shape)

# df5=df5.drop('price_sqft')
df6=pd.get_dummies(df5['location'])
df7=pd.concat([df5.drop('location',axis=1),df6.drop('other',axis=1)],axis=1)
print(df7.columns)


# Model
X=df7.drop('price',axis=1)
Y=df7['price']
X_train,X_test,Y_train,Y_test=train_test_split(X,Y,test_size=0.2,random_state=10)
lr=LinearRegression()
lr.fit(X_train,Y_train)
print(lr.score(X_test,Y_test))

from sklearn.linear_model import LinearRegression, Lasso
from sklearn.tree import DecisionTreeRegressor
from sklearn.model_selection import GridSearchCV, ShuffleSplit, cross_val_score
import pandas as pd

# Cross-validation setup
cv = ShuffleSplit(n_splits=5, test_size=0.2, random_state=0)

# Scores with Linear Regression
print(cross_val_score(LinearRegression(), X, Y, cv=cv))

def find_best(X, Y):
    algos = {
        'LinearRegression': {
            'model': LinearRegression(),
            'params': {
                # 'normalize' is deprecated, using 'fit_intercept' as a safe alternative
                'fit_intercept': [True, False]
            }
        },
        'Lasso': {
            'model': Lasso(),
            'params': {
                'alpha': [1, 2],
                'selection': ['random', 'cyclic']
            }
        },
        'DecisionTree': {
            'model': DecisionTreeRegressor(),
            'params': {
                'criterion': ['squared_error', 'friedman_mse'],#sqaured_error
                'splitter': ['best', 'random']#best
            }
        }
    }

    scores = []

    for model_name, mp in algos.items():
        gs = GridSearchCV(mp['model'], mp['params'], cv=cv, return_train_score=False)
        gs.fit(X, Y)
        scores.append({
            'model': model_name,
            'best_score': gs.best_score_,
            'best_params': gs.best_params_
        })

    return pd.DataFrame(scores, columns=['model',  'best_params', 'best_score'])

# Call the function and print results
gscv = find_best(X, Y)
# print(gscv)




best_model=DecisionTreeRegressor(criterion='squared_error', splitter='best')
best_model.fit(X,Y)



def predict_price(location, sqft, bath, bhk):
    x = np.zeros(X.shape[1])  # Use number of features used in training

    # Fill features in the same order as in X.columns
    x[0] = sqft
    x[1] = bath
    x[2] = bhk

    # Handle location column (one-hot)
    if location in X.columns:
        loc_index = X.columns.get_loc(location)
        x[loc_index] = 1

    return best_model.predict([x])[0]



print(df.head())
print(predict_price('1st Phase JP Nagar', 1000, 8, 6))
print(predict_price('Whitefield', 1200, 2, 2))
print(predict_price('Electronic City Phase II', 1800, 3, 3))
print(predict_price('Sarjapur  Road', 2500, 4, 4))
print(predict_price('Yelahanka', 900, 2, 2))




with open('predictionModel','wb') as f :
    pickle.dump(best_model,f)
with open('predictionModel','rb') as f :
    pickle.load(f)
# Save feature columns
columns = {
    "data_columns": X.columns.tolist()  # store the exact column order
}

with open("columns.json", "w") as f:
    json.dump(columns, f)