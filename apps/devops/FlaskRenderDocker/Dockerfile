FROM python:3.11.3

WORKDIR /root/FlaskApp

COPY apps/zero/backend/FlaskApp /root/FlaskApp
RUN  cd root/FlaskApp; ls; cat requirements.txt; pip install -r requirements.txt




RUN apt-get -y update && DEBIAN_FRONTEND=noninteractive \
    apt-get -y install  mlocate vim dos2unix tmux;


CMD ["gunicorn","app:app"]



