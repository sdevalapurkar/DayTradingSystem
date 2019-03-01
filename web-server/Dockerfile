FROM node:carbon

WORKDIR /
ENV http_proxy 'http://192.168.1.1:3128'
ENV https_proxy 'http://192.168.1.1:3128'


RUN mkdir /usr/local/share/ca-certificates/engineering
COPY ./Engineering.crt /usr/local/share/ca-certificates/engineering/Engineering.crt

COPY ./Engineering.crt /etc/ssh/certs/

RUN update-ca-certificates

COPY ./package.json ./

RUN npm config set strict-ssl false
RUN npm install
COPY . .
ENV http_proxy ''
ENV https_proxy ''
CMD ["node", "server.js"]
EXPOSE 8123

