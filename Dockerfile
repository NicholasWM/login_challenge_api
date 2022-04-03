
FROM node:14.17.0-alpine

WORKDIR /var/www/backend

COPY package.json ./ 

RUN npm install
RUN npm ci

COPY .eslintrc.js nest-cli.json tsconfig.json tsconfig.build.json ./

RUN npm run build


CMD [ "npm", "run", "start:dev", "--preserveWatchOutput" ]