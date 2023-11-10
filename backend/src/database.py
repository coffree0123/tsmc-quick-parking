'''Manage database connection and actions'''
import psycopg2
from src.user.constants import Role, Gender


db_connect = {'host': 'localhost', 'user': 'postgres',
              'password': 123, 'dbname': 'postgres', 'port': 8080}


def add_user(user_id: int, first_name: str, last_name: str, email: str, phone_num: str,
              gender: Gender, age: int, job_title: Role, special_role: str) -> int:
    '''Add a new user to the database and return the user_id'''
    # Connect to the database
    conn = psycopg2.connect(**db_connect)
    cursor = conn.cursor()
    # Define the SQL query to insert the user information into the Users table
    sql_query = """
    INSERT INTO "Users" ("id", "firstName", "lastName", "email", "phoneNo", "gender", "age", "jobTitle", "specialRole")
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    RETURNING id;
    """
    # Execute the SQL query with the user information as parameters
    cursor.execute(sql_query, (user_id, first_name, last_name, email,
                               phone_num, gender, age, job_title, special_role))
    # Fetch the result and get the id of the inserted row
    result = cursor.fetchone()
    user_id = result[0]
    # Commit the changes to the database
    conn.commit()
    # Close the cursor and the connection
    cursor.close()
    conn.close()

    return user_id
