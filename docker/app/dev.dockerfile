FROM node:15-alpine
WORKDIR /app
COPY . .
ENV NODE_ENV=development
RUN yarn
RUN yarn build
CMD [ "yarn", "start:local:dev" ]