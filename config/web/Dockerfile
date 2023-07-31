FROM python:3.11-alpine AS intermediate

RUN apk add poetry

COPY poetry.lock .
COPY pyproject.toml .

RUN poetry export > requirements.txt

# ---

FROM python:3.11-alpine AS target

RUN apk add bash curl

COPY --from=intermediate requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt && rm /tmp/requirements.txt

WORKDIR /app
COPY solar /app/solar
COPY manage.py /app/manage.py
