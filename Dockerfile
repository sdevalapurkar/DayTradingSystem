FROM crate:latest

COPY . /


#ENTRYPOINT ["sh", "/crate_entry_point.sh"]

CMD ["crate"]

#CMD ["/crate_entry_point.sh"]

#CMD ["sh", "-c", "crate; /crate_entry_point.sh"]