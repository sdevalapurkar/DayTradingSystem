crash -c "DELETE FROM account_transactions;"
crash -c "DELETE FROM error_events;"
crash -c "DELETE FROM system_events;"
crash -c "DELETE FROM quote_server_events;"
crash -c "DELETE FROM user_commands;"
exec "$@"
               
