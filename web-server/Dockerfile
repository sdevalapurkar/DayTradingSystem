FROM node:carbon

WORKDIR /

COPY ./package.json ./
RUN npm install
COPY . .

CMD ["node", "server.js"]
EXPOSE 8123
