FROM node:15-alpine as build
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
RUN yarn migration:up
RUN yarn build
RUN ls -al

FROM node:15-alpine as deploy
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./
COPY yarn.lock ./
RUN yarn --production
COPY --from=build /app/dist ./
RUN ls -al
RUN pwd
CMD [ "node", "server.js" ]
