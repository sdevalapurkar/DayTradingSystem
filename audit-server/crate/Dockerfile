FROM crate:latest
ENV http_proxy 'http://192.168.1.1:3128'
ENV https_proxy 'http://192.168.1.1:3128'

COPY . /


#ENTRYPOINT ["sh", "/crate_entry_point.sh"]
RUN ln -sf /usr/bin/python3.6 /usr/bin/python3
ENV CRATE_HEAP_SIZE=4000M
EXPOSE 4201
CMD ["crate"]

#CMD ["/crate_entry_point.sh"]

#CMD ["sh", "-c", "crate; /crate_entry_point.sh"]

