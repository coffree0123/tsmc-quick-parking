'''Manage database connection and actions'''
from typing import List, Tuple
from psycopg_pool import ConnectionPool
from src.users.constants import Role, Gender
from src.vehicles.constants import VehicleSize

# Define the database connection parameters
DB_CONNECT = 'postgres://postgres:123@127.0.0.1:8080/postgres'


class QuickParkingDB():
    '''
    The interface object of Database
    '''

    def __init__(self, conninfo) -> None:
        self._connection_pools = ConnectionPool(conninfo)
        self._connection_pools.wait()

    def add_user(self, first_name: str, last_name: str, email: str, phone_num: str,
                 gender: Gender, age: int, job_title: Role, special_role: str) -> int:
        '''Add a new user to the database and return the user_id'''
        # Define the SQL query to insert the user information into the Users table
        sql_query = """
        INSERT INTO "Users" ("firstName", "lastName", "email", "phoneNo", "gender", "age", "jobTitle", "specialRole")
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id;
        """

        with self._connection_pools.connection() as conn:
            with conn.cursor() as cursor:
                # Execute the SQL query with the user information as parameters
                cursor.execute(sql_query, (first_name, last_name, email,
                                           phone_num, gender, age, job_title, special_role))
                # Fetch the result and get the id of the inserted row
                result = cursor.fetchone()
                user_id = result[0]
                # Commit the changes to the database
                conn.commit()

        return user_id

    def add_vehicle(self, user_id: int, license_id: str, nick_name: str,
                    car_size: VehicleSize = "small") -> None:
        '''Add a new vehicle to the database'''
        # Define the SQL query to insert the vehicle information into the Cars table
        sql_query = """
        INSERT INTO "Cars" ("userID", "licensePlateNo", "size", "model")
        VALUES (%s, %s, %s, %s);
        """

        with self._connection_pools.connection() as conn:
            with conn.cursor() as cursor:
                # Execute the SQL query with the vehicle information as parameters
                cursor.execute(
                    sql_query, (user_id, license_id, car_size, nick_name))
                # Commit the changes to the database
                conn.commit()

    def get_free_spaces(self, parkinglot_id: int) -> List[Tuple[str]]:
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

        with self._connection_pools.connection() as conn:
            with conn.execute(sql_query, [parkinglot_id]) as cursor:
                res = cursor.fetchall()
        return res

    def park_car(self, plate_num: str, slot_id: id, start_time: str) -> str:
        '''Add a parking record to the database and return the record_id'''
        # Define the SQL query to insert the user information into the Users table
        sql_query = """
        INSERT INTO "ParkingRecords" ("licensePlateNo", "slotID", "startTime")
        VALUES (%s, %s, %s)
        RETURNING "id";
        """
        with self._connection_pools.connection() as conn:
            with conn.cursor() as cursor:
                # Execute the SQL query with the user information as parameters
                cursor.execute(sql_query, (plate_num, slot_id, start_time))
                # Fetch the result and get the id of the inserted row
                result = cursor.fetchone()
                record_id = result[0]
                # Commit the changes to the database
                conn.commit()
                # Close the cursor and the connection
                cursor.close()
                conn.close()

        return record_id

    def pick_car(self, slot_id: int, end_time: str) -> None:
        '''Add end_time to a record'''
        # Define the SQL query to insert the user information into the Users table
        sql_query = """
        UPDATE "ParkingRecords" 
        SET "endTime" = %s
        WHERE "slotID" = %s AND "endTime" IS NULL;
        """
        with self._connection_pools.connection() as conn:
            with conn.cursor() as cursor:
                # Execute the SQL query with the user information as parameters
                cursor.execute(sql_query, (end_time, slot_id))
                # Commit the changes to the database
                conn.commit()
                # Close the cursor and the connection
                cursor.close()
                conn.close()

    def get_vehicle_latest_records(self, vehicle_id: str) -> list:
        num_records = 10
        
        '''Retrieve the lastest 10 parking records of the given vehicle'''
        sql_query = """
        SELECT
            parkinglots.name,
            slots.floor,
            slots.index,
            records."startTime",
            records."endTime"
        FROM (
            SELECT
                * 
            FROM "ParkingRecords" 
            WHERE "licensePlateNo" = %s
            ORDER BY "startTime" DESC
            LIMIT %s
        ) AS records
        LEFT JOIN "ParkingSlots" AS slots
            ON slots.id = records."slotID"
        LEFT JOIN "ParkingLots" AS parkinglots
            ON parkinglots.id = slots."parkingLotID";
        """

        with self._connection_pools.connection() as conn:
            with conn.execute(sql_query, [vehicle_id, num_records]) as cursor:
                res = cursor.fetchall()
        return res