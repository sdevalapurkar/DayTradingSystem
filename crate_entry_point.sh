#./wait_for_it.sh localhost:4200
crash --verbose -c "CREATE TABLE IF NOT EXISTS users(
    user_id STRING,
    balance FLOAT,
    PRIMARY KEY (user_id)
);"
crash -c "CREATE TABLE IF NOT EXISTS stocks(
    user_id STRING,
    symbol STRING,
    quantity INT,
    PRIMARY KEY (user_id, symbol)
);"
crash -c "CREATE TABLE IF NOT EXISTS buy_amounts(
    user_id STRING,
    symbol STRING,  
    quantity INT,
    PRIMARY KEY (user_id, symbol)    
);"
crash -c "CREATE TABLE IF NOT EXISTS sell_amounts(
    user_id STRING,
    symbol STRING,  
    quantity INT,
    PRIMARY KEY (user_id, symbol)
);"
exec "$@"