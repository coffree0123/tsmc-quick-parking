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
Start
```
$ docker-compose up --build -d
```
Turn down
```
$ docker-compose down
```

### Backend Development
Run the following command under backend/
```bash
uvicorn src.main:app --reload
```