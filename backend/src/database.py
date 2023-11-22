'''Manage database connection and actions'''
from psycopg.rows import dict_row
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

    def update_user(self, user_id: int, first_name: str, last_name: str, email: str, phone_num: str,
                    gender: Gender, age: int, job_title: Role, special_role: str) -> None:
        '''Update a user's information in the database'''
        sql_query = """
        UPDATE "Users" SET "firstName" = %s, "lastName" = %s, "email" = %s, 
        "phoneNo" = %s, "gender" = %s, "age" = %s, "jobTitle" = %s, "specialRole" = %s 
        WHERE id = %s;
        """

        with self._connection_pools.connection() as conn:
            with conn.cursor() as cursor:
                # Execute the SQL query with the user information as parameters
                cursor.execute(sql_query, (first_name, last_name, email, phone_num,
                                           gender, age, job_title, special_role, user_id))
                conn.commit()

    def delete_user(self, user_id: int) -> None:
        '''Delete a user's information in the database'''
        sql_query = """
        DELETE FROM "Users" WHERE "id" = %s;
        """

        with self._connection_pools.connection() as conn:
            with conn.cursor() as cursor:
                # Execute the SQL query with the user information as parameters
                cursor.execute(sql_query, (user_id,))
                conn.commit()

    def add_vehicle(self, user_id: int, license_id: str, nick_name: str,
                    car_size: VehicleSize = "small") -> None:
        '''Add a new vehicle to the database'''
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

    def delete_vehicle(self, license_id: str) -> None:
        '''Delete a vehicle's information in the database'''
        # Delete parking records first
        sql_query = """
        DELETE FROM "ParkingRecords" WHERE "licensePlateNo" = %s;
        """
        with self._connection_pools.connection() as conn:
            with conn.cursor() as cursor:
                # Execute the SQL query with the user information as parameters
                cursor.execute(sql_query, (license_id,))
                conn.commit()
        # Delete car information
        sql_query = """
        DELETE FROM "Cars" WHERE "licensePlateNo" = %s;
        """
        with self._connection_pools.connection() as conn:
            with conn.cursor() as cursor:
                # Execute the SQL query with the user information as parameters
                cursor.execute(sql_query, (license_id,))
                conn.commit()

    def get_user_vehicles(self, user_id: int) -> tuple[list[str], list[str]]:
        '''Get vehicle information given user_id'''
        sql = """
        SELECT "licensePlateNo", "model" FROM "Cars" WHERE "userID" = %s;
        """
        with self._connection_pools.connection() as conn:
            with conn.cursor() as cursor:
                # Execute the query with the user_id value
                cursor.execute(sql, (user_id,))
                # Fetch all the rows from the query result
                rows = cursor.fetchall()

        # Initialize two empty lists to store the licensePlateNo and model values
        license_list, model_list = [], []

        for row in rows:
            license_list.append(row[0])
            model_list.append(row[1])

        return license_list, model_list

    def get_parkinglot(self, license_id: str) -> str:
        '''Get parkinglot information given licensePlateNo'''
        # Writing a SQL query to join the relevant tables and select the parking lot names
        sql_query = """
        SELECT "ParkingLots"."name"
        FROM "Cars"
        JOIN "ParkingRecords" ON "Cars"."licensePlateNo" = "ParkingRecords"."licensePlateNo"
        JOIN "ParkingSlots" ON "ParkingRecords"."slotID" = "ParkingSlots"."id"
        JOIN "ParkingLots" ON "ParkingSlots"."parkingLotID" = "ParkingLots"."id"
        WHERE "Cars"."licensePlateNo" = %s;
        """
        with self._connection_pools.connection() as conn:
            with conn.cursor() as cursor:
                # Executing the query and fetching the results
                cursor.execute(sql_query, (license_id,))
                results = cursor.fetchall()
                # Converting the results to a list of strings
                parking_lot_name = results[0][0] if len(
                    results) > 0 and len(results[0]) > 0 else ""

        return parking_lot_name

    def get_location(self, license_id: str) -> tuple[str, str]:
        '''Get parking location information given licensePlateNo'''
        # Writing a SQL query to join the relevant tables and select the parking lot names
        sql_query = """
        SELECT "ParkingSlots"."index", "ParkingSlots"."floor"
        FROM "ParkingSlots"
        JOIN "ParkingRecords" ON "ParkingSlots".id = "ParkingRecords"."slotID"
        JOIN "Cars" ON "ParkingRecords"."licensePlateNo" = "Cars"."licensePlateNo"
        WHERE "Cars"."licensePlateNo" = %s;
        """
        with self._connection_pools.connection() as conn:
            with conn.cursor() as cursor:
                # Executing the query and fetching the results
                cursor.execute(sql_query, (license_id,))
                results = cursor.fetchall()
                index = results[0][0] if len(
                    results) > 0 and len(results[0]) > 0 else ""
                floor = results[0][1] if len(
                    results) > 0 and len(results[0]) > 0 else ""

        return index, floor

    def get_free_spaces(self, parkinglot_id: int) -> list[tuple[str]]:
        '''
        Given a parkinglot id, returns all free spaces, 
        each of which is represented by a tuple (floor, index)
        '''

        sql_query = """
            SELECT
                slots.floor,
                slots.index
            FROM (
                SELECT
                    id,
                    floor,
                    index
                FROM "ParkingSlots"
                WHERE "ParkingSlots"."parkingLotID" = %s
            ) AS slots
            LEFT JOIN (
                SELECT
                    "slotID"
                FROM "ParkingRecords"
                WHERE "endTime" IS NULL
            ) AS records
            ON slots.id = records."slotID"
            WHERE records."slotID"  IS NULL;
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

    def get_latest_records(self, vehicle_id: str, user_id: int) -> list:
        '''Retrieve the lastest 10 parking records'''
        num_records = 10

        cond1 = f''' "licensePlateNo" = '{vehicle_id}' ''' if vehicle_id is not None else "1 = 1"
        cond2 = f''' "userID" = '{user_id}' ''' if user_id is not None else "1 = 1"
        sql_query = f"""
        SELECT
            vehicles."licensePlateNo" AS license_plate_no,
            parkinglots.name AS parkinglot_name,
            slots.floor AS slot_floor,
            slots.index AS slot_index,
            records."startTime" AS start_time,
            records."endTime" AS end_time
        FROM (
            SELECT
                "licensePlateNo",
                "userID"
            FROM "Cars"
            WHERE {cond1} AND {cond2}
        ) AS vehicles
        INNER JOIN "ParkingRecords" AS records
            ON vehicles."licensePlateNo" = records."licensePlateNo"
        INNER JOIN "ParkingSlots" AS slots
            ON slots.id = records."slotID"
        INNER JOIN "ParkingLots" AS parkinglots
            ON parkinglots.id = slots."parkingLotID"
        ORDER BY start_time DESC
        LIMIT {num_records};
        """

        with self._connection_pools.connection() as conn:
            with conn.cursor(row_factory=dict_row) as cursor:
                res = cursor.execute(sql_query).fetchall()
        return res

    def get_long_term_occupants(self, parkinglot_id):
        '''Retrieve top 10 vehicles that occupies longest til now in the given parking lot'''
        num_records = 10

        sql_query = """
        SELECT
            CONCAT("floor", '#', "index") AS postion,
            records."licensePlateNo" AS license_plate_no,
            records."startTime" AS start_time
        FROM (
            SELECT
                "id",
                "index",
                "floor"
            FROM "ParkingSlots" 
            WHERE "parkingLotID" = %s
        ) AS slots
        INNER JOIN (
            SELECT
                "slotID",
                "licensePlateNo",
                "startTime"
            FROM "ParkingRecords"
            WHERE "endTime" is NULL
        ) AS records
            ON slots."id" = records."slotID"
        ORDER BY "startTime"
        LIMIT %s;
        """

        with self._connection_pools.connection() as conn:
            with conn.cursor(row_factory=dict_row) as cursor:
                res = cursor.execute(sql_query, params=(
                    parkinglot_id, num_records)).fetchall()
        return res

    def get_parkinglot_info(self, parkinglot_id: int):
        '''Get all info of a parking lot'''
        sql_query = """
        SELECT
            *
        FROM "ParkingLots"
        WHERE "id" = %s
        """
        with self._connection_pools.connection() as conn:
            with conn.cursor(row_factory=dict_row) as cursor:
                res = cursor.execute(sql_query, (parkinglot_id,)).fetchall()
        return res
