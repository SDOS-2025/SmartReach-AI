import psycopg2
import config

# Load database connection parameters
params = config.config()

# Connect to PostgreSQL
connection = psycopg2.connect(**params)
connection.autocommit = True