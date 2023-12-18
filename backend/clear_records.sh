# This script clears all rows of ParkingRecords in the database with the clear_record.sql file.

docker cp docker/db/clear_records.sql park:/tmp/clear_records.sql &&
docker exec park bash -c "psql < /tmp/clear_records.sql"

