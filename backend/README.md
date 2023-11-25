## How to install dependency
1. In python venv (e.g.: minconda)
2. [Install poetry](https://python-poetry.org/docs/#installing-with-the-official-installer)
3. Install dependency (Need poetry)
    ```
    poetry install
    ```

After install the dependency, please install the precommit hook by running the following command: ```pre-commit install```

## How to run the server

### Normal Usage
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

Note that the database is not persistent currently (i.e. if container is shutdown, all data is lost)

### Backend Development
Run the following command under backend/
```bash
uvicorn src.main:app --reload
```