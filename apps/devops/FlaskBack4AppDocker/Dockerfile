FROM python:3.11

WORKDIR /app

COPY .dockerignore .
COPY . /app

ENV FLASK_BACKEND_ENV=DEV
ENV NEWS_API_KEY=1773e03
ENV EVENTBRITE_OAUTH_TOKEN=OH7

ENV SQLALCHEMY_MYSQL_0_CONN_STRING=N-A
ENV RESTDBIO_SERVER_API_KEY_0=NONE

RUN pip3 install --no-cache-dir -r requirements.txt
RUN apt-get install openssl


EXPOSE 8080

CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
