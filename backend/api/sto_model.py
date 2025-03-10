import pandas as pd
import numpy as np
from datetime import timedelta
from django.db import connection
# from sto_app.models import UserEngagement  # Ensure correct absolute import
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

def fetch_user_data(user_id):
    return None
    """ Fetch user engagement data from the database """
    user_data = UserEngagement.objects.filter(user_id=user_id).values(
        'send_time', 'open_time', 'engagement_delay'
    ).order_by('-send_time')[:50]

    df = pd.DataFrame(user_data)
    if df.empty:
        return None

    df['send_time'] = pd.to_datetime(df['send_time']).dt.hour
    df['open_time'] = pd.to_datetime(df['open_time']).dt.hour
    return df

def preprocess_data(df):
    """ Preprocess data for training the model """
    if df is None:
        return None, None, None, None
    
    X = df[['send_time']]
    y = df['open_time']
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
    
    return X_train, X_test, y_train, y_test, scaler

def train_model(X_train, y_train):
    """ Train a machine learning model to predict the best send time """
    if X_train is None or y_train is None:
        return None
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    return model

def get_optimal_send_time(user_id):
    """ Predict the optimal send time based on past engagement """
    df = fetch_user_data(user_id)
    X_train, X_test, y_train, y_test, scaler = preprocess_data(df)
    model = train_model(X_train, y_train)
    
    if model is None or df is None:
        return "12:00 PM"  # Default fallback
    
    last_send_time = df.iloc[0]['send_time']
    last_send_time_scaled = scaler.transform([[last_send_time]])
    predicted_open_time = model.predict(last_send_time_scaled)
    
    optimal_send_time = (last_send_time - (predicted_open_time[0] - last_send_time)) % 24
    return f"{int(optimal_send_time)}:00"
