FROM node:16-alpine as builder

WORKDIR /app
COPY . /app

RUN npm install
RUN npm run lint
RUN npm run test
RUN npm run coverage
RUN npm run build:action

FROM node:16-alpine as app

WORKDIR /app
COPY --from=builder /app/dist /app

ENTRYPOINT [ "/app/index.js" ]