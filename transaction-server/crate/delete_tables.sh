crash -c "DELETE FROM stocks;"
crash -c "DELETE FROM triggers;"
crash -c "DELETE FROM sell_amounts;"
crash -c "DELETE FROM buy_amounts;"
crash -c "DELETE FROM users;"
exec "$@"


