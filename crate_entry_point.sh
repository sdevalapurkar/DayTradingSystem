CREATE TABLE IF NOT EXISTS users(
    user_id STRING,
    balance FLOAT,
    PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS stocks(
    user_id STRING,
    symbol STRING,
    quantity INT
);