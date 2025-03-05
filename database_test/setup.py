import psycopg2
import config

# Load database connection parameters
params = config.config()

# Connect to PostgreSQL
connection = psycopg2.connect(**params)
connection.autocommit = True

cursor = connection.cursor()
cursor.execute("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public';")
tables = cursor.fetchall()

# Drop each table
for table in tables:
    table_name = table[0]
    print(f"Dropping table: {table_name}")
    cursor.execute(f"DROP TABLE IF EXISTS {table_name} CASCADE;")

# Commit and close connection
connection.commit()
cursor.close()
connection.close()

print("All tables dropped successfully!")