INSERT INTO "ParkingLots"("name", "numRow", "numCol", "numFloor") 
VALUES
    ('Building A', 5, 6, 2),
    ('Factory B', 6, 7, 4),
    ('Building C', 8, 10, 2),
    ('Factory D', 7, 10, 4);

-- pregnancy parking slots
INSERT INTO "ParkingSlots" ("parkingLotID", "index", "floor", "priority")
SELECT
    pl.id AS "parkingLotID",
    row_num * pl."numCol" + col_num AS "index",
    fl.floor_num AS "floor",
    'pregnancy' AS "priority"
FROM "ParkingLots" pl
CROSS JOIN LATERAL generate_series(1, pl."numFloor") fl(floor_num)
CROSS JOIN LATERAL generate_series(0, 0) rows(row_num)
CROSS JOIN LATERAL generate_series(0, pl."numCol"-1) cols(col_num);

-- disability parking slots
INSERT INTO "ParkingSlots" ("parkingLotID", "index", "floor", "priority")
SELECT
    pl.id AS "parkingLotID",
    row_num * pl."numCol" + col_num AS "index",
    fl.floor_num AS "floor",
    'disability' AS "priority"
FROM "ParkingLots" pl
CROSS JOIN LATERAL generate_series(1, pl."numFloor") fl(floor_num)
CROSS JOIN LATERAL generate_series(1, 1) rows(row_num)
CROSS JOIN LATERAL generate_series(0, pl."numCol"-1) cols(col_num);

-- normal parking slots
INSERT INTO "ParkingSlots" ("parkingLotID", "index", "floor", "priority")
SELECT
    pl.id AS "parkingLotID",
    row_num * pl."numCol" + col_num AS "index",
    fl.floor_num AS "floor",
    'normal' AS "priority"
FROM "ParkingLots" pl
CROSS JOIN LATERAL generate_series(1, pl."numFloor") fl(floor_num)
CROSS JOIN LATERAL generate_series(2, pl."numRow"-1) rows(row_num)
CROSS JOIN LATERAL generate_series(0, pl."numCol"-1) cols(col_num);

INSERT INTO "Users" ("id", "name", "email", "phoneNo", "gender", "age", "jobTitle", "priority")
VALUES
    ('a3825583-493d-4141-9435-c57873cf8df0', 'Johnson Lee', 'jlee@tsmc.com', '0912345678', 'male', 32, 'engineer', 'disability'),
    ('c7d7de14-9e90-499e-8e9a-f43c305a9b9d', 'Emily Lin', 'elin@tsmc.com', '0987654321', 'female', 28, 'engineer', 'pregnancy'),
    ('e4c36f2d-3fc9-4e3c-81d3-1e376a6a4baa', 'Michael Chen', 'mchen@tsmc.com', '0932123456', 'male', 40, 'engineer', 'normal'),
    ('f0593d57-35d5-4b3e-a415-0bdc17c20b8a', 'Alice Huang', 'ahuang@tsmc.com', '0921346798', 'female', 35, 'engineer', 'normal'),
    ('b9a0b9e5-b3f6-4f62-98c8-d6aa0b299fb7', 'David Kuo', 'dkuo@tsmc.com', '0978234561', 'male', 45, 'engineer', 'normal'),
    ('98e315ff-20df-4798-a54a-2994bc26f2b9', 'Sophia Wang', 'swang@tsmc.com', '0987123456', 'female', 30, 'engineer', 'normal'),
    ('5344df6b-5762-4c0c-9b46-001fcf4643b1', 'James Chang', 'jchang@tsmc.com', '0923456789', 'male', 27, 'engineer', 'normal'),
    ('fd3fcf71-d803-4a21-9f94-6edeb2d88715', 'Olivia Wu', 'owu@tsmc.com', '0912876543', 'female', 38, 'pm', 'disability'),
    ('a98dbfe4-0d15-4418-b153-68f2f868b45d', 'William Liu', 'wliu@tsmc.com', '0987654321', 'male', 33, 'pm', 'normal'),
    ('297e3f5b-083b-4648-9095-f5869ff55cc3', 'Charlotte Yang', 'cyang@tsmc.com', '0912345678', 'female', 29, 'pm', 'pregnancy'),
    ('ce9b032c-f0f1-4e3e-a90e-34b44e0c8b57', 'Daniel Huang', 'dhuang@tsmc.com', '0978234561', 'male', 42, 'pm', 'normal'),
    ('a7929c92-c8ff-4b2f-b735-f480dbb51358', 'Ava Lin', 'alin@tsmc.com', '0923456789', 'female', 31, 'pm', 'normal'),
    ('ecdd96b4-1b9b-4897-b547-fb0e22c0d50d', 'Liam Tsai', 'ltsai@tsmc.com', '0912876543', 'male', 36, 'pm', 'normal'),
    ('7b5ab84c-dfd6-4cc5-a6ff-bd6b9dc50a13', 'Mia Chen', 'mchen@tsmc.com', '0987123456', 'female', 34, 'pm', 'normal');

INSERT INTO "Cars" ("userID", "licensePlateNo", "size", "model")
VALUES
    ('a3825583-493d-4141-9435-c57873cf8df0', 'ABC-5678', 'small', 'Tesla T1'),
    ('c7d7de14-9e90-499e-8e9a-f43c305a9b9d', 'DEF-1234', 'medium', 'Toyota Corolla'),
    ('e4c36f2d-3fc9-4e3c-81d3-1e376a6a4baa', 'GHI-7890', 'large', 'Ford Mustang'),
    ('f0593d57-35d5-4b3e-a415-0bdc17c20b8a', 'JKL-4567', 'small', 'Honda Civic'),
    ('b9a0b9e5-b3f6-4f62-98c8-d6aa0b299fb7', 'MNO-8901', 'medium', 'BMW X3'),
    ('98e315ff-20df-4798-a54a-2994bc26f2b9', 'PQR-2345', 'large', 'Chevrolet Camaro'),
    ('a3825583-493d-4141-9435-c57873cf8df0', 'STU-6789', 'small', 'Hyundai Elantra'),
    ('fd3fcf71-d803-4a21-9f94-6edeb2d88715', 'VWX-3456', 'medium', 'Audi A4'),
    ('a98dbfe4-0d15-4418-b153-68f2f868b45d', 'YZA-9012', 'large', 'Tesla Model S'),
    ('297e3f5b-083b-4648-9095-f5869ff55cc3', 'BCD-7890', 'small', 'Nissan Sentra'),
    ('ce9b032c-f0f1-4e3e-a90e-34b44e0c8b57', 'EFG-1234', 'medium', 'Volkswagen Golf'),
    ('a7929c92-c8ff-4b2f-b735-f480dbb51358', 'HIJ-5678', 'large', 'Mercedes-Benz C-Class'),
    ('ecdd96b4-1b9b-4897-b547-fb0e22c0d50d', 'KLM-2345', 'small', 'Toyota Camry'),
    ('7b5ab84c-dfd6-4cc5-a6ff-bd6b9dc50a13', 'NOP-6789', 'medium', 'Subaru Outback'),
    ('a3825583-493d-4141-9435-c57873cf8df0', 'QRS-3456', 'large', 'Ford F-150'),
    ('c7d7de14-9e90-499e-8e9a-f43c305a9b9d', 'TUV-9012', 'small', 'Chevrolet Spark'),
    ('e4c36f2d-3fc9-4e3c-81d3-1e376a6a4baa', 'WXY-4567', 'medium', 'Kia Forte'),
    ('f0593d57-35d5-4b3e-a415-0bdc17c20b8a', 'ZAB-8901', 'large', 'Jeep Wrangler'),
    ('b9a0b9e5-b3f6-4f62-98c8-d6aa0b299fb7', 'CDE-1234', 'small', 'Honda Accord'),
    ('98e315ff-20df-4798-a54a-2994bc26f2b9', 'FGH-5678', 'medium', 'Mazda CX-5');

INSERT INTO "ParkingRecords" ("licensePlateNo", "slotID", "startTime", "endTime") 
VALUES
    ('ABC-5678', 1, '2023-11-10 14:22:56', '2023-11-10 15:22:56'),
    ('DEF-1234', 2, '2023-11-10 14:22:56', '2023-11-10 15:22:56'),
    ('GHI-7890', 3, '2023-11-10 14:22:56', '2023-11-10 15:22:56');

INSERT INTO "UserFavorites" ("userID", "parkingLotID") 
VALUES
    ('a3825583-493d-4141-9435-c57873cf8df0', 1),
    ('a3825583-493d-4141-9435-c57873cf8df0', 2);
