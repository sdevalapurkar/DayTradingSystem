crash -c "CREATE TABLE IF NOT EXISTS user_commands(
	    timestamp INT,
	    transaction_num INT,
	    server STRING,
	    command STRING,
	    stock STRING,
	    filename STRING,
	    funds FLOAT,
            user_id STRING
        );"
crash -c "CREATE TABLE IF NOT EXISTS system_events(
	    timestamp INT,
	    transaction_num INT,
            server STRING,
	    user_id STRING,
            command STRING,
            stock STRING,
	    filename STRING,
	    funds FLOAT
        );"
crash -c "CREATE TABLE IF NOT EXISTS quote_server_events(
            timestamp INT,
	    transaction_num INT,
	    server STRING,
	    user_id STRING,	  
            stock STRING,  
            crypto_key STRING,
	    quote_server_time INT,
	    price INT    
        );"
crash -c "CREATE TABLE IF NOT EXISTS account_transactions(
	    timestamp INT,
	    server STRING,
	    transaction_num INT, 
            action STRING,
	    user_id STRING,
            funds FLOAT  
        );"
crash -c "CREATE TABLE IF NOT EXISTS error_events(
	    timestamp INT,
	    server STRING,
	    transaction_num INT,
            user_id STRING,
            stock STRING,
	    filename STRING,
            error_message STRING,
	    funds FLOAT     
        );"
exec "$@"
