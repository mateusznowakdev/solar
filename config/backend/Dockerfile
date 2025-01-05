FROM python:3.13.1-alpine3.21 AS intermediate
WORKDIR /app

RUN apk add poetry

COPY poetry.lock .
COPY pyproject.toml .

RUN poetry export > requirements.txt

# ---

FROM python:3.13.1-alpine3.21 AS target
WORKDIR /app

RUN apk add tzdata

COPY --from=intermediate /app/requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt && rm /tmp/requirements.txt

WORKDIR /app
COPY solar solar
COPY manage.py .
