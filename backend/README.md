## How to install dependency
1. In python venv (e.g.: minconda)
2. [Install poetry](https://python-poetry.org/docs/#installing-with-the-official-installer)
3. Install dependency (Need poetry)
    ```
    poetry install
    ```

After install the dependency, please install the precommit hook by running the following command: ```pre-commit install```

## How to run the server

### Backend development
This part is for backend development only. For frontend development, please refer to the next section.
1. Start the database container by
    ```bash
    $ docker run --name park -p 8080:5432 -e PGUSER=postgres -e POSTGRES_PASSWORD='123' -d postgres
    ```
2. Run the following command under backend/ to initialize the database
    ```bash
    $ bash init_db.sh
    ```
3. If you want to remove the database, run
    ```bash
    $ docker rm -f park
    ```

### Frontend development
Start the service by
```bash
$ docker-compose up --build -d
```

You can see and test the APIs by typing in the browser
```
127.0.0.1:<PROD_PORT>/docs
```
where `PROD_PORT` is set to `8000` currently in `.env` file.

Shut down the service by
```bash
$ docker-compose down
```

The database data is stored in the docker volume `quick-parking-data`. To start with the application with new empty database, remove the volume before `docker-compose up`.
```bash
$ docker volume rm backend_quick-parking-data
```
Note the directory name `backend` is prepended before `quick-parking-data` because docker-compose use this kind of naming convention.

Also, we provide a sample data file `sample.sql` to test with our APIs.
By default, this file is NOT loaded into the database when booting the application.
To use it, run
```bash
$ docker cp docker/db/sample.sql quick-parking-db:/tmp/sample.sql && docker exec quick-parking-db bash -c "psql -U quickparking < /tmp/sample.sql"
```

### Backend Development
Run the following command under backend/
```bash
python -m src.main
```
If you want to skip the authentication, run the following command under backend/
```bash
python -m src.main --skip_auth
```