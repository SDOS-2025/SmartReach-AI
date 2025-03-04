import mysql.connector as connector
import config

params = config.config()

# Connect to MySQL
connection = connector.connect(**params)
print('Connected to MySQL database')

cursor = connection.cursor()
cursor.execute('show databases;')
cursor.fetchall()
cursor.execute('use smartreach_db;')
cursor.execute('show tables;')
