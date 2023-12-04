# stage 1: install dependency
FROM python:3.9-slim as builder

RUN python -m pip install --no-cache-dir --upgrade poetry
COPY pyproject.toml poetry.lock ./ 
RUN poetry export -f requirements.txt --without-hashes -o requirements.txt

# stage 2: web app image
FROM python:3.9-slim as webapp

# switch to non-root user
ARG APP_USER
RUN adduser ${APP_USER}
USER ${APP_USER}
WORKDIR /home/${APP_USER}

# copy dependecies and code
COPY --from=builder /requirements.txt /tmp/requirements.txt
RUN python -m pip install --user --upgrade --no-cache-dir -r /tmp/requirements.txt
COPY src /home/${APP_USER}/src

ENTRYPOINT python -m src.main --host=0.0.0.0
