# This script initializes the database with the init.sql and sample.sql files.

# Copy the init.sql and sample.sql files to the container.
docker cp docker/db/init.sql park:/tmp/init.sql &&
docker cp docker/db/sample.sql park:/tmp/sample.sql &&

# Run the init.sql and sample.sql files in the container.
docker exec park bash -c "psql < /tmp/init.sql" &&
docker exec park bash -c "psql < /tmp/sample.sql"

