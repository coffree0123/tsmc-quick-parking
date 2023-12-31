'''Manage database connection and actions'''
import os
import psycopg
from psycopg.rows import dict_row, class_row
from psycopg_pool import ConnectionPool
from src.constants import Role, Gender, VehicleSize, OwnerInfo, ParkingRecord, \
    UserData, VehicleData, BuildingInfo

DB_CONNECT = os.environ["DB_CONNECT"] \
    if "DB_CONNECT" in os.environ else "postgres://postgres:123@127.0.0.1:8080/postgres"


class QuickParkingDB():
    '''
    The interface object of Database
    '''

    def __init__(self, conninfo) -> None:
        self._connection_pools = ConnectionPool(conninfo)
        self._connection_pools.wait()

    def add_user(self, user_id: str, name: str, email: str, phone_num: str,
                 gender: Gender, age: int, job_title: Role, priority: str) -> str:
        '''Add a new user to the database and return the user_id'''
        sql_query = """
        INSERT INTO "Users" ("id", "name", "email", "phoneNo", "gender", "age", "jobTitle", "priority")
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id;
        """

        with self._connection_pools.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(sql_query, (user_id, name, email,
                                           phone_num, gender, age, job_title, priority))
                result = cursor.fetchone()
                user_id = result[0]
                conn.commit()

        return user_id

    def update_user(self, user_id: str, name: str, email: str, phone_num: str,
                    gender: Gender, age: int, job_title: Role, priority: str) -> None:
        '''Update a user's information in the database'''
        sql_query = """
        UPDATE "Users" SET "name" = %s, "email" = %s, 
        "phoneNo" = %s, "gender" = %s, "age" = %s, "jobTitle" = %s, "priority" = %s
        WHERE id = %s;
        """

        with self._connection_pools.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(sql_query, (name, email, phone_num,
                                           gender, age, job_title, priority, user_id))
                conn.commit()

    def get_user(self, user_id: str) -> UserData:
        '''Retrieves a user's information from the database'''
        sql_qeury = """
        SELECT 
            "Users"."id" AS user_id,
            "Users".name,
            "Users".email,
            "Users"."phoneNo" AS phone_num,
            "Users".gender,
            "Users".age,
            "Users"."jobTitle" AS job_title,
            "Users"."priority" AS priority
        FROM
            "Users"
        WHERE 
            "id" = %s;
        """

        with self._connection_pools.connection() as conn:
            with conn.cursor(row_factory=class_row(UserData)) as cursor:
                cursor.execute(sql_qeury, params=(user_id,))
                res = cursor.fetchall()

        if len(res) == 0:
            raise ValueError("The user does not exist")

        return res[0]

    def delete_user(self, user_id: str) -> None:
        '''Delete a user's information in the database'''
        sql_query = """
        DELETE FROM "Users" WHERE "id" = %s;
        """
        with self._connection_pools.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(sql_query, (user_id,))
                conn.commit()

    def get_user_favorite_parkinglots(self, user_id: str) -> list[BuildingInfo]:
        '''Get user's favorite parking lots'''
        sql_query = """
        SELECT
            favs."parkingLotID",
            lots."name"
        FROM "UserFavorites" AS favs
        JOIN "ParkingLots" AS lots
        ON favs."parkingLotID" = lots.id
        WHERE favs."userID" = %s;
        """

        with self._connection_pools.connection() as conn:
            with conn.execute(sql_query, (user_id,)) as cursor:
                favorite_lots = cursor.fetchall()

        result = []
        for (fav_id, fav_name) in favorite_lots:
            free_spaces = self.get_free_spaces(fav_id)
            result.append(BuildingInfo(build_id=fav_id,
                          building_name=fav_name, free_num=len(free_spaces)))

        return result

    def add_favorite_lot(self, user_id: str, parking_lot_id: int) -> None:
        '''Add a new favorite parking lot to the database'''
        sql_query = """
        INSERT INTO "UserFavorites" ("userID", "parkingLotID") 
        VALUES (%s, %s);
        """

        with self._connection_pools.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    sql_query, (user_id, parking_lot_id))
                conn.commit()

    def delete_favorite_lot(self, user_id: str, parking_lot_id: int) -> None:
        '''Delete a favorite parking lot from the database'''
        sql_query = """
        DELETE FROM "UserFavorites" WHERE ("userID", "parkingLotID") = (%s, %s);
        """

        with self._connection_pools.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    sql_query, (user_id, parking_lot_id))
                conn.commit()

    def add_vehicle(self, user_id: str, license_plate_no: str, nick_name: str,
                    car_size: VehicleSize = "small") -> None:
        '''Add a new vehicle to the database'''
        with self._connection_pools.connection() as conn:
            with conn.cursor() as cursor:
                # Check if a record with the given license_plate_no exists
                cursor.execute("""
                    SELECT "userID" FROM "Cars" WHERE "licensePlateNo" = %s;
                """, (license_plate_no,))

                existing_record = cursor.fetchone()

                if existing_record:
                    existing_user_id = existing_record[0]

                    if existing_user_id is None:
                        # If user_id is NULL, update it
                        cursor.execute("""
                            UPDATE "Cars" SET "userID" = %s, "size" = %s, "model" = %s
                            WHERE "licensePlateNo" = %s;
                        """, (user_id, car_size, nick_name, license_plate_no))
                    else:
                        # If user_id exists, throw an error
                        raise psycopg.errors.UniqueViolation(
                            "License plate number already exists with a user_id.")
                else:
                    # If license_plate_no does not exist, insert the new record
                    cursor.execute("""
                        INSERT INTO "Cars" ("userID", "licensePlateNo", "size", "model")
                        VALUES (%s, %s, %s, %s);
                    """, (user_id, license_plate_no, car_size, nick_name))

                conn.commit()

    def update_vehicle(self, license_plate_no: str, nick_name: str,
                       car_size: VehicleSize = "small") -> None:
        '''Update a vehicle's information in the database'''
        sql_query = """
        WITH updated AS (
            UPDATE "Cars" SET "size" = %s, "model" = %s
            WHERE "licensePlateNo" = %s
            RETURNING *
        )
        SELECT * FROM updated;
        """

        with self._connection_pools.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    sql_query, (car_size, nick_name, license_plate_no))
                result = cursor.fetchall()
                if len(result) == 0:
                    raise ValueError("The vehicle does not exist")
                conn.commit()

    def get_vehicle(self, license_plate_no: str) -> VehicleData:
        '''Retrieves a vehicle's information from the database'''
        sql_qeury = """
        SELECT
            "Cars"."userID" AS user_id,
            "Cars"."licensePlateNo" AS license_plate_no,
            "Cars"."model" AS nick_name,
            "Cars"."size" AS car_size
        FROM
            "Cars"
        WHERE
            "licensePlateNo" = %s
        """

        with self._connection_pools.connection() as conn:
            with conn.cursor(row_factory=class_row(VehicleData)) as cursor:
                cursor.execute(sql_qeury, params=(license_plate_no,))
                res = cursor.fetchall()

        if len(res) == 0:
            raise ValueError("The vehicle does not exist")

        return res[0]

    def delete_vehicle(self, license_plate_no: str) -> None:
        '''Delete a vehicle's information in the database'''
        # Set the vehicle's owner to NULL
        sql_query = """
        UPDATE "Cars"
        SET "userID" = NULL
        WHERE "licensePlateNo" = %s
        """
        with self._connection_pools.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(sql_query, (license_plate_no,))
                conn.commit()

    def get_vehicle_owner_info(self, license_plate_no: str) -> OwnerInfo:
        '''Retrieves the owner info of a vehicle'''
        sql_qeury = """
        SELECT 
            users.id,
            users.name,
            users."jobTitle" AS job_title,
            users.email,
            users."phoneNo" AS phone,
            users."priority" AS priority
        FROM (
            SELECT
                "userID"
            FROM "Cars"
            WHERE "licensePlateNo" = %s
        ) AS cars
        LEFT JOIN "Users" AS users
            ON cars."userID" = users.id;
        """

        with self._connection_pools.connection() as conn:
            with conn.cursor(row_factory=class_row(OwnerInfo)) as cursor:
                cursor.execute(sql_qeury, params=(license_plate_no,))
                res = cursor.fetchall()

        if len(res) > 1:
            raise ValueError("The vehicle has two or more users")
        if len(res) == 0:
            return OwnerInfo()
        return res[0]

    def get_user_vehicles(self, user_id: str) -> list[VehicleData]:
        '''Retrieves all vehicles of a user'''
        sql_query = """
        SELECT
            "Cars"."userID" AS user_id,
            "Cars"."licensePlateNo" AS license_plate_no,
            "Cars"."model" AS nick_name,
            "Cars"."size" AS car_size
        FROM
            "Cars"
        WHERE
            "userID" = %s
        """

        with self._connection_pools.connection() as conn:
            with conn.cursor(row_factory=class_row(VehicleData)) as cursor:
                cursor.execute(sql_query, params=(user_id,))
                res = cursor.fetchall()
        return res

    def get_user_vehicle_states(self, user_id: str) -> list[dict]:
        '''Retrive the user vehicles info and their current states in the parking lot'''
        sql_query = """
        SELECT
            cars."licensePlateNo" AS license_plate_no,
            cars."model" AS model,
            records."startTime" AS start_time,
            parkinglots."name" AS parkinglot_name,
            parkinglots."numRow" AS num_row,
            parkinglots."numCol" AS num_col,
            slots."floor" AS floor,
            slots."index" AS index
        FROM (
            SELECT
                "licensePlateNo",
                "model"
            FROM "Cars"
            WHERE "userID" = %s
        ) AS cars
        LEFT JOIN "ParkingRecords" AS records
            ON
                cars."licensePlateNo" = records."licensePlateNo" AND 
                records."endTime" IS NULL
        LEFT JOIN "ParkingSlots" AS slots
            ON slots.id = records."slotID"
        LEFT JOIN "ParkingLots" AS parkinglots
            ON parkinglots."id" = slots."parkingLotID";
        """

        with self._connection_pools.connection() as conn:
            with conn.cursor(row_factory=dict_row) as cursor:
                cursor.execute(sql_query, (user_id,))
                res = cursor.fetchall()
        return res

    def get_free_spaces(self, parkinglot_id: int) -> list[dict]:
        '''
        Given a parkinglot id, returns all free spaces, 
        each of which is represented by a tuple (floor, index)
        '''

        sql_query = """
            SELECT
                floor,
                index
            FROM "ParkingSlots" AS slots
            WHERE
                "parkingLotID" = %s AND
                NOT EXISTS (
                    SELECT 1 FROM "ParkingRecords" AS records
                    WHERE records."endTime" IS NULL AND slots.id = records."slotID"
                )
            ORDER BY floor ASC, index ASC;
        """
        with self._connection_pools.connection() as conn:
            with conn.cursor(row_factory=dict_row) as cursor:
                res = cursor.execute(sql_query, (parkinglot_id,)).fetchall()
        return res

    def get_parked_spaces(self, parkinglot_id: int):
        '''
        Given a parking lot id, returns all parked slots
        '''
        sql_query = """
            SELECT
                slots.floor,
                slots.index,
                records."licensePlateNo" AS license_plate_no,
                (CASE WHEN (
                    slots.priority != 'normal' AND
                    slots.priority != users.priority
                ) THEN true ELSE false END) AS illegally_parked,
                users."id" IS NOT NULL AS car_owner_enrolled
            FROM "ParkingSlots" AS slots
            INNER JOIN "ParkingRecords" AS records
                ON
                    slots."parkingLotID" = %s AND
                    records."endTime" IS NULL AND
                    slots.id = records."slotID"
            LEFT JOIN "Cars" AS cars
                ON
                    records."licensePlateNo" = cars."licensePlateNo"
            LEFT JOIN "Users" AS users
                ON
                    cars."userID" = users."id"
            ORDER BY floor ASC, index ASC;
        """
        with self._connection_pools.connection() as conn:
            with conn.cursor(row_factory=dict_row) as cursor:
                res = cursor.execute(sql_query, (parkinglot_id,)).fetchall()
        return res

    def get_priority_spaces(self, parkinglot_id: int) -> list[dict]:
        '''Given a parking lot id, returns all priority slots'''
        sql_query = """
        SELECT 
            floor,
            index,
            priority
        FROM "ParkingSlots"
        WHERE
            "parkingLotID" = %s AND
            "priority" != 'normal'
        ORDER BY floor ASC, index ASC;
        """
        with self._connection_pools.connection() as conn:
            with conn.cursor(row_factory=dict_row) as cursor:
                res = cursor.execute(sql_query, (parkinglot_id,)).fetchall()
        return res

    def check_valid_parking(self, slot_id: int, license_plate_no: str,
                            start_time: str = None, end_time: str = None) -> bool:
        '''Check if the parking is valid'''
        res = False
        if start_time:
            check_query = """
            SELECT *
            FROM "ParkingRecords" AS records
            WHERE (records."endTime" IS NULL
            OR (records."endTime" >= %s AND records."startTime" <= %s))
            AND (records."slotID" = %s OR records."licensePlateNo" = %s);
            """
            with self._connection_pools.connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        check_query, (start_time, start_time, slot_id, license_plate_no))
                    result = cursor.fetchone()
                    if result is None:
                        res = True
        if end_time:
            check_query = """
            SELECT 1
            FROM "ParkingRecords" AS records
            WHERE (records."endTime" >= %s AND records."startTime" <= %s)
            AND (records."slotID" = %s OR records."licensePlateNo" = %s);
            """
            with self._connection_pools.connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        check_query, (end_time, end_time, slot_id, license_plate_no))
                    result = cursor.fetchone()
                    if result is None:
                        res = True
        return res

    def park_car(self, slot_id: int, license_plate_no: str, start_time: str) -> int:
        '''Add a parking record to the database and return the record_id'''
        check_query = """
        SELECT 1
        from "Cars"
        where "licensePlateNo" = %s;
        """
        sql_query = """
        INSERT INTO "ParkingRecords" ("licensePlateNo", "slotID", "startTime")
        VALUES (%s, %s, %s)
        RETURNING "id";
        """
        with self._connection_pools.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(check_query, (license_plate_no, ))
                result = cursor.fetchone()
                if result is None:
                    self.add_vehicle(None, license_plate_no, "")
                cursor.execute(
                    sql_query, (license_plate_no, slot_id, start_time))

                # Fetch the result and get the id of the inserted row
                result = cursor.fetchone()
                record_id = result[0]
                # Commit the changes to the database
                conn.commit()

        return record_id

    def pick_car(self, slot_id: int, license_plate_no: str, end_time: str) -> bool:
        '''Add end_time to a record'''
        sql_query = """
        UPDATE "ParkingRecords" 
        SET "endTime" = %s
        WHERE "slotID" = %s
        AND "licensePlateNo" = %s
        AND "endTime" IS NULL
        RETURNING *;
        """
        with self._connection_pools.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    sql_query, (end_time, slot_id, license_plate_no))
                result = cursor.fetchone()
                if result is None:
                    return False
                # Commit the changes to the database
                conn.commit()
        return True

    def get_latest_records(self, license_plate_no: str, user_id: str) -> list[dict]:
        '''Retrieve the lastest 10 parking records'''
        num_records = 10

        params = []
        cond1 = "1 = 1"
        cond2 = "1 = 1"
        if license_plate_no is not None:
            cond1 = ''' "licensePlateNo" = %s '''
            params.append(license_plate_no)
        if user_id is not None:
            cond2 = ''' "userID" = %s '''
            params.append(user_id)
        params.append(num_records)

        sql_query = f"""
        SELECT
            vehicles."licensePlateNo" AS license_plate_no,
            parkinglots.name AS parkinglot_name,
            parkinglots."numRow" AS num_row,
            parkinglots."numCol" AS num_col,
            slots.floor AS floor,
            slots.index as index,
            records."startTime" AS start_time,
            records."endTime" AS end_time
        FROM (
            SELECT
                *
            FROM "Cars"
            WHERE {cond1} AND {cond2}
        ) AS vehicles
        LEFT JOIN "ParkingRecords" AS records
            ON vehicles."licensePlateNo" = records."licensePlateNo"
        LEFT JOIN "ParkingSlots" AS slots
            ON slots.id = records."slotID"
        LEFT JOIN "ParkingLots" AS parkinglots
            ON parkinglots.id = slots."parkingLotID"
        ORDER BY start_time DESC
        LIMIT %s;
        """

        with self._connection_pools.connection() as conn:
            with conn.cursor(row_factory=dict_row) as cursor:
                res = cursor.execute(sql_query, params=params).fetchall()
        return res

    def get_long_term_occupants(self, parkinglot_id) -> list[dict]:
        '''Retrieve top 10 vehicles that occupies longest til now in the given parking lot'''
        num_records = 10

        sql_query = """
        SELECT
            slots.floor AS floor,
            slots.index AS index,
            records."licensePlateNo" AS license_plate_no,
            records."startTime" AS start_time
        FROM "ParkingSlots" AS slots
        INNER JOIN "ParkingRecords" AS records
            ON 
                slots."parkingLotID" = %s AND 
                slots."id" = records."slotID" AND 
                records."endTime" IS NULL
        ORDER BY "startTime"
        LIMIT %s;
        """

        with self._connection_pools.connection() as conn:
            with conn.cursor(row_factory=dict_row) as cursor:
                res = cursor.execute(sql_query, params=(
                    parkinglot_id, num_records)).fetchall()
        return res

    def get_parkinglot_list(self) -> list[dict]:
        '''Get all parking lot names and id'''
        sql_query = """
        SELECT
            id,
            name
        FROM "ParkingLots"
        """
        with self._connection_pools.connection() as conn:
            with conn.cursor(row_factory=dict_row) as cursor:
                res = cursor.execute(sql_query).fetchall()
        return res

    def get_parkinglot_info(self, parkinglot_id: int) -> list[dict]:
        '''Get all info of a parking lot'''
        sql_query = """
        SELECT
            "numRow",
            "numCol",
            "numFloor"
        FROM "ParkingLots"
        WHERE "id" = %s
        """
        with self._connection_pools.connection() as conn:
            with conn.cursor(row_factory=dict_row) as cursor:
                res = cursor.execute(sql_query, (parkinglot_id,)).fetchall()
        return res

    def get_records_from_parkinglot_id_and_time(
        self, parkinglot_id: int, start_time: str, end_time: str
    ) -> list[ParkingRecord]:
        '''Retrieves records of a parkinglot and given timestamps'''
        sql_qeury = """
        SELECT pr.*, ps.floor
        FROM "ParkingRecords" pr
        JOIN "ParkingSlots" ps ON pr."slotID" = ps.id
        WHERE ps."parkingLotID" = %s
        AND (pr."endTime" >= %s or pr."endTime" IS NULL)
        AND pr."startTime" < %s;
        """

        with self._connection_pools.connection() as conn:
            with conn.cursor(row_factory=dict_row) as cursor:
                cursor.execute(sql_qeury, params=(
                    parkinglot_id, start_time, end_time,))
                res = cursor.fetchall()

        return res
