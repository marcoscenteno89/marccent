FROM node:14-slim

RUN mkdir /app
WORKDIR /app

ADD package.json /app

# RUN apk add --update python make g++\
#    && rm -rf /var/cache/apk/*

RUN npm install

ADD . /app

# CMD ["npm", "start"]