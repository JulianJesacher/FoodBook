FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY ./dist/backend/* ./
EXPOSE 3000
CMD [ "node", "main.js" ]

