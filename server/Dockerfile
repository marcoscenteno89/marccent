FROM python:3.12

ENV PYTHONUNBUFFERED 1

RUN mkdir /app
WORKDIR /app
ADD . /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt