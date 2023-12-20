# This script clears all rows of ParkingRecords in the database with the clear_record.sql file.

docker cp docker/db/clear_records.sql quick-parking-db:/tmp/clear_records.sql &&
docker exec quick-parking-db bash -c "psql -U quickparking < /tmp/clear_records.sql"

