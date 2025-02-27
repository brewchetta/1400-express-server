FROM node:20-alpine

COPY /server/ /app/server/
COPY /client/ /app/client/

WORKDIR /app/client

RUN npm install
RUN npm run build

WORKDIR /app/server

RUN npm install

CMD ["node", "./bin/www"]