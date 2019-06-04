# Stock Day Trading System

An end-to-end production stock day trading system built for the Software Scalability (SENG 468) course at the University of Victoria.

The basic functionality that the system had to provide included but was not limited to:
- Getting stock quotes
- Adding funds to account
- Buying/selling shares in a stock
- Setting an automated buy/sell point for a stock
- Reviewing complete list of transactions/getting account summary
- Cancelling/committing transactions

## System Architecture

![architecture](/architecture.png)

The web server, written in Golang, was later changed to use Nginx, and served as a load balancer and was able to hash the incoming user id of the request to a particular transaction server/database node to help distribute the workload. Along with this, a messaging queue was present which sat between the transaction server and the audit server. It accepted messages and delivered them to their respective consumers. It was a middleman which was used to reduce loads and delivery times. The database management system used was CrateDB, known to be a scalable effective solution for storing data in a relational format. This was later changed to Postgres for a variety of reasons.

## Application Reliability

![reliability](/reliability.png)

Every component of our system was shown to have a reliability of 99.997% allowing our overall system reliability to be 99.99%.

## Team Members

- Lee Zeitz
- Shreyas Devalapurkar
- Graeme Bates
- Caity Gossland
