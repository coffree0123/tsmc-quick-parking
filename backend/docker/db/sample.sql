INSERT INTO "ParkingLots"("name", "numRow", "numCol", "numFloor") 
VALUES
    ('Building A', 5, 6, 2),
    ('Factory B', 10, 20, 4);

INSERT INTO "ParkingSlots"("parkingLotID", "index", "floor") 
VALUES
    (1, 0, 1),
    (1, 0, 2),
    (2, 1, 1);

INSERT INTO "Users" ("id", "name", "email", "phoneNo", "gender", "age", "jobTitle", "specialRole")
VALUES
    ('21EC2020-3AEA-1069-A2DD-08002B30309D', 'Emil Wang', 'emily.wang@tsmc.com', '', 'Female', 29, 'PM', 'None'),
    ('21EC2020-3AEA-1069-A2DD-08002B30309A', 'Johnson Lee', 'jlee@tsmc.com', '', 'Male', 32, 'Process Engineer', 'None'),
    ('21EC2020-3AEA-1069-A2DD-08002B30309B', 'John Doe', 'johndoe@tsmc.com', '123-456-7891', 'Male', 25, 'Software Engineer', 'None'),
    ('21EC2020-3AEA-1069-A2DD-08002B30309C', 'Jane Doe', 'janedoe@tsmc.com', '123-456-7892', 'Female', 23, 'Data Analyst', 'None'),
    ('21EC2020-3AEA-1069-A2DD-08002B30309E', 'Bob Smith', 'bobsmith@tsmc.com', '123-456-7893', 'Male', 30, 'Product Manager', 'None'),
    ('21EC2020-3AEA-1069-A2DD-08002B30309F', 'Alice Johnson', 'alicejohnson@tsmc.com', '123-456-7894', 'Female', 27, 'Software Engineer', 'None');

INSERT INTO "Cars" ("userID", "licensePlateNo", "size", "model")
VALUES
    ('21EC2020-3AEA-1069-A2DD-08002B30309D', 'ABC-5678', 'small', 'Tesla T1'),
    ('21EC2020-3AEA-1069-A2DD-08002B30309A', 'EFG-9871', 'medium', 'Porshche P'),
    ('21EC2020-3AEA-1069-A2DD-08002B30309D', 'UVW-9811', 'large', 'Benz B'),
    ('21EC2020-3AEA-1069-A2DD-08002B30309A', 'ABC-123', 'small', 'Toyota Corolla'),
    ('21EC2020-3AEA-1069-A2DD-08002B30309D', 'DEF-456', 'medium', 'Honda Civic'),
    ('21EC2020-3AEA-1069-A2DD-08002B30309D', 'GHI-789', 'large', 'Ford Mustang'),
    ('21EC2020-3AEA-1069-A2DD-08002B30309C', 'JKL-012', 'huge', 'Chevrolet Suburban');

INSERT INTO "ParkingRecords" ("licensePlateNo", "slotID", "startTime", "endTime") 
VALUES
    ('ABC-5678', 1, '2023-11-10 14:22:56', '2023-11-10 15:22:56'),
    ('EFG-9871', 2, '2023-11-10 14:22:56', '2023-11-10 15:22:56'),
    ('UVW-9811', 3, '2023-11-10 14:22:56', '2023-11-10 15:22:56');