FROM node:12 as build

WORKDIR /www/app/build

RUN apt-get -q update && apt-get -qy install netcat

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN yarn install

COPY . .

RUN yarn build


FROM gcr.io/distroless/nodejs

COPY --from=build /www/app/build /www/app

WORKDIR /www/app

EXPOSE 3500

CMD [ "dist/main.js" ]
