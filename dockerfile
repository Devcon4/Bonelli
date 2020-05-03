FROM node:latest as Build

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN cd /app; npm ci

COPY . /app

RUN cd /app; npm run build

FROM nginx:alpine as Runtime

COPY --from=Build /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=Build /app/dist /usr/share/nginx/html

EXPOSE 80
