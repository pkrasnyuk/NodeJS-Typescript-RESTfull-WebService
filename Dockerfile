FROM node:boron

WORKDIR /dist

COPY package.json .

RUN npm i

COPY /dist /dist

EXPOSE 1200

CMD [ "node", "server.js" ]