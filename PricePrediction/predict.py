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
