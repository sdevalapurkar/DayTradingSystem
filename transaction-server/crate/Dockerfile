FROM crate:latest

COPY . /
COPY ./crate.yml /crate/config/
#ENV http_proxy 'http://192.168.1.1:3128'
#ENV https_proxy 'https://192.168.1.1:3128'

RUN ln -sf /usr/bin/python3.6 /usr/bin/python3
ENV CRATE_HEAP_SIZE=2000M

CMD ["crate"]

