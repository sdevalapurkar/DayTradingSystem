FROM golang:alpine

ENV http_proxy 'http://192.168.1.1:3128'
ENV https_proxy 'http://192.168.1.1:3128'

RUN apk update && apk add --no-cache bash git
RUN mkdir /usr/local/share/ca-certificates/engineering
COPY ./Engineering.crt /usr/local/share/ca-certificates/engineering/Engineering.crt

COPY ./Engineering.crt /etc/ssh/certs/

RUN update-ca-certificates
RUN git config --global http.proxy http://192.168.1.1:3128
RUN git config --global https.proxy http://192.168.1.1:3128
RUN git config --global http.sslVerify false

COPY . /go/src/web-server

ENV http_proxy ''
ENV https_proxy ''

RUN go get /go/src/web-server
RUN go install /go/src/web-server

ENTRYPOINT /go/bin/web-server
