import pandas as pd
import numpy as np
from matplotlib import pyplot as plt
import matplotlib 
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