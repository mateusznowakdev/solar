FROM python:3.13.3-alpine3.21 AS intermediate
WORKDIR /app

RUN pip install "poetry==2.1.2" "poetry-plugin-export==1.9.0"

COPY poetry.lock .
COPY pyproject.toml .

RUN poetry export > requirements.txt

# ---

FROM python:3.13.3-alpine3.21 AS target
WORKDIR /app

RUN apk add curl tzdata

COPY --from=intermediate /app/requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt && rm /tmp/requirements.txt

WORKDIR /app
COPY solar solar
COPY manage.py .

CMD ["gunicorn", "--access-logfile", "-", "-w", "4", "-b", ":80", "solar.wsgi"]
