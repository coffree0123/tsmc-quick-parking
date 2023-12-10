INSERT INTO "ParkingLots"("name", "numRow", "numCol", "numFloor") 
VALUES
    ('Building A', 5, 6, 2),
    ('Factory B', 10, 20, 4);

INSERT INTO "ParkingSlots"("parkingLotID", "index", "floor", "priority") 
VALUES
    (1, 1, 1, 'pregnancy'),
    (1, 1, 2, 'disability'),
    (2, 1, 1, 'normal');

INSERT INTO "Users" ("id", "name", "email", "phoneNo", "gender", "age", "jobTitle", "priority")
VALUES
    ('21EC2020-3AEA-1069-A2DD-08002B30309D', 'Emil Wang', 'emily.wang@tsmc.com', '', 'female', 29, 'pm', 'pregnancy'),
    ('21EC2020-3AEA-1069-A2DD-08002B30309A', 'Johnson Lee', 'jlee@tsmc.com', '', 'male', 32, 'engineer', 'disability'),
    ('21EC2020-3AEA-1069-A2DD-08002B30309B', 'John Doe', 'johndoe@tsmc.com', '123-456-7891', 'male', 25, 'engineer', 'normal'),
    ('21EC2020-3AEA-1069-A2DD-08002B30309C', 'Jane Doe', 'janedoe@tsmc.com', '123-456-7892', 'female', 23, 'engineer', 'normal'),
    ('21EC2020-3AEA-1069-A2DD-08002B30309E', 'Bob Smith', 'bobsmith@tsmc.com', '123-456-7893', 'male', 30, 'pm', 'normal'),
    ('21EC2020-3AEA-1069-A2DD-08002B30309F', 'Alice Johnson', 'alicejohnson@tsmc.com', '123-456-7894', 'female', 27, 'engineer', 'normal');

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

INSERT INTO "UserFavorites" ("userID", "parkingLotID") 
VALUES
    ('21EC2020-3AEA-1069-A2DD-08002B30309D', 1),
    ('21EC2020-3AEA-1069-A2DD-08002B30309D', 2);
