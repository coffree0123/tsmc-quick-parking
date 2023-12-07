CREATE TYPE "carSize" AS ENUM (
  'small',
  'medium',
  'large',
  'huge'
);

CREATE TYPE "priorityType" AS ENUM (
  'pregnancy',
  'disability'
);

CREATE TABLE "Cars" (
  "userID" varchar,
  "licensePlateNo" varchar PRIMARY KEY,
  "size" "carSize",
  "model" varchar
);

CREATE TABLE "Users" (
  "id" varchar PRIMARY KEY,
  "name" varchar,
  "email" varchar,
  "phoneNo" varchar,
  "gender" varchar,
  "age" integer,
  "jobTitle" varchar,
  "priority" "priorityType"
);

CREATE TABLE "ParkingSlots" (
  "id" serial PRIMARY KEY,
  "parkingLotID" integer,
  "index" integer,
  "floor" integer,
  "priority" "priorityType"
);

CREATE TABLE "ParkingLots" (
  "id" serial PRIMARY KEY,
  "name" varchar,
  "latitude" float,
  "longtitude" float,
  "address" varchar,
  "numRow" integer,
  "numCol" integer,
  "numFloor" integer
);

CREATE TABLE "ParkingRecords" (
  "id" serial PRIMARY KEY,
  "licensePlateNo" varchar,
  "slotID" integer,
  "startTime" timestamp,
  "endTime" timestamp
);

CREATE TABLE "UserFavorites" (
  "userID" varchar,
  "parkingLotID" integer,
  PRIMARY KEY ("userID", "parkingLotID")
);

CREATE UNIQUE INDEX ON "ParkingSlots" ("parkingLotID", "index", "floor");

ALTER TABLE "Cars" ADD FOREIGN KEY ("userID") REFERENCES "Users" ("id");

ALTER TABLE "ParkingSlots" ADD FOREIGN KEY ("parkingLotID") REFERENCES "ParkingLots" ("id");

ALTER TABLE "ParkingRecords" ADD FOREIGN KEY ("licensePlateNo") REFERENCES "Cars" ("licensePlateNo");

ALTER TABLE "ParkingRecords" ADD FOREIGN KEY ("slotID") REFERENCES "ParkingSlots" ("id");

ALTER TABLE "UserFavorites" ADD FOREIGN KEY ("userID") REFERENCES "Users" ("id");

ALTER TABLE "UserFavorites" ADD FOREIGN KEY ("parkingLotID") REFERENCES "ParkingLots" ("id");
