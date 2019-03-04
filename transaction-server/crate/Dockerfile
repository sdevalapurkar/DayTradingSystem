FROM crate:latest

COPY . /

ENV http_proxy 'http://192.168.1.1:3128'
ENV https_proxy 'https://192.168.1.1:3128'


#ENTRYPOINT ["sh", "/crate_entry_point.sh"]
RUN ln -sf /usr/bin/python3.6 /usr/bin/python3
ENV CRATE_HEAP_SIZE=2000M
CMD ["crate"]

#CMD ["/crate_entry_point.sh"]

#CMD ["sh", "-c", "crate; /crate_entry_point.sh"]

