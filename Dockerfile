FROM node:lts-alpine AS build

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install --silent && mv node_modules ../
COPY . .
RUN chown -R node /usr/src/app

FROM node:lts-alpine

WORKDIR /app
EXPOSE 3000
USER node

CMD ["yarn", "start"]

COPY --from=build /usr/src/app/node_modules .

RUN chown -R node /app

