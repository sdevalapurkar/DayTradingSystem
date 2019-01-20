FROM crate

RUN mkdir /entry
COPY ./crate_entry_point.sh /entry

ENTRYPOINT["sh", "/entry/crate_entry_point.sh"]