INSERT INTO "ParkingLots"("name", "numRow", "numCol", "numFloor") 
VALUES
    ('Building A', 5, 6, 2),
    ('Factory B', 10, 20, 4);

INSERT INTO "ParkingSlots"("parkingLotID", "index", "floor") 
VALUES
    (1, 0, 1),
    (2, 1, 1),
    (1, 0, 2);

INSERT INTO "Users" ("firstName", "lastName", "email", "phoneNo", "gender", "age", "jobTitle", "specialRole")
VALUES
    ('Emily', 'Wang', 'emily.wang@tsmc.com', '', 'Female', 29, 'PM', 'None'),
    ('Johnson', 'Lee', 'jlee@tsmc.com', '', 'Male', 32, 'Process Engineer', 'None'),
    ('John', 'Doe', 'johndoe@tsmc.com', '123-456-7891', 'Male', 25, 'Software Engineer', 'None'),
    ('Jane', 'Doe', 'janedoe@tsmc.com', '123-456-7892', 'Female', 23, 'Data Analyst', 'None'),
    ('Bob', 'Smith', 'bobsmith@tsmc.com', '123-456-7893', 'Male', 30, 'Product Manager', 'None'),
    ('Alice', 'Johnson', 'alicejohnson@tsmc.com', '123-456-7894', 'Female', 27, 'Software Engineer', 'None');

INSERT INTO "Cars" ("userID", "licensePlateNo", "size", "model")
VALUES
    (6, 'ABC-5678', 'small', 'Tesla T1'),
    (1, 'EFG-9871', 'medium', 'Porshche P'),
    (2, 'UVW-9811', 'large', 'Benz B'),
    (3, 'ABC-123', 'small', 'Toyota Corolla'),
    (4, 'DEF-456', 'medium', 'Honda Civic'),
    (5, 'GHI-789', 'large', 'Ford Mustang'),
    (6, 'JKL-012', 'huge', 'Chevrolet Suburban');

INSERT INTO "ParkingRecords" ("licensePlateNo", "slotID", "startTime", "endTime") 
VALUES
    ('ABC-5678', 1, '2023-11-10 14:22:56', '2023-11-10 15:22:56'),
    ('EFG-9871', 2, '2023-11-10 14:22:56', '2023-11-10 15:22:56'),
    ('UVW-9811', 3, '2023-11-10 14:22:56', '2023-11-10 15:22:56');