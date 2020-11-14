FROM node:12 as build

WORKDIR /www/app/build

RUN apt-get -q update && apt-get -qy install netcat

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN yarn install

COPY . .

RUN yarn build


FROM node:12.19.0-alpine3.12

COPY --from=build /www/app/build /www/app

WORKDIR /www/app

RUN yarn install --production

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

EXPOSE 3500

CMD [ "yarn", "start:prod" ]
