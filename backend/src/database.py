'''Manage database connection and actions'''
from typing import List, Tuple
import psycopg
from src.users.constants import Role, Gender

# Define the database connection parameters
DB_CONNECT = 'postgres://postgres:123@127.0.0.1:8080/postgres'


def add_user(first_name: str, last_name: str, email: str, phone_num: str,
             gender: Gender, age: int, job_title: Role, special_role: str) -> int:
    '''Add a new user to the database and return the user_id'''
    # Connect to the database
    conn = psycopg.connect(DB_CONNECT)
    cursor = conn.cursor()
    # Define the SQL query to insert the user information into the Users table
    sql_query = """
    INSERT INTO "Users" ("firstName", "lastName", "email", "phoneNo", "gender", "age", "jobTitle", "specialRole")
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    RETURNING id;
    """
    # Execute the SQL query with the user information as parameters
    cursor.execute(sql_query, (first_name, last_name, email,
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


def get_free_spaces(parkinglot_id: int) -> List[Tuple[str]]:
    '''
    Given a parkinglot id, returns all free spaces, 
    each of which is represented by a tuple (floor, index)
    '''

    sql_query = """
    SELECT
        floor,
        index
    FROM "ParkingSlots"
    WHERE "parkingLotID" = %s AND "status" = 'free';
    """

    with psycopg.connect(DB_CONNECT) as conn:
        with conn.execute(sql_query, [parkinglot_id]) as cursor:
            res = cursor.fetchall()
    return res
