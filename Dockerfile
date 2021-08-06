FROM node:16-alpine as builder

WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build:action

FROM node:16-alpine as app

WORKDIR /app
COPY --from=builder /app/dist /app/dist
RUN chmod +x /app/main.js
COPY ./package.json /app
COPY ./categories.yml /app
RUN npm install --only=prod --ignore-scripts
RUN rm /app/package.json


ENTRYPOINT [ "/app/dist/main.js" ]