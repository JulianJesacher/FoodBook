FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
COPY node_modules ./node_modules
COPY ./dist/apps/server/* ./
EXPOSE 3000
CMD [ "node", "main.js" ]

