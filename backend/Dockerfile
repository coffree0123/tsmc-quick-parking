# stage 1: install dependency
FROM python:3.12-slim as builder

COPY requirements.txt /requirements.txt
RUN pip install --user -r /requirements.txt

# stage 2: web app image
FROM python:3.12-slim as webapp

# switch to non-root user
RUN adduser quickparking
WORKDIR /home/quickparking
USER quickparking:quickparking

# copy dependecies and code
COPY --from=builder /root/.local ./.local
COPY src /home/quickparking/src

ENTRYPOINT ./.local/bin/uvicorn src.main:app --reload ${PROD_PORT} --host 0.0.0.0
