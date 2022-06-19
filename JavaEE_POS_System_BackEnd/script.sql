/**
  * @ author : Akila Dhambure Liyanage
  * @ since : 0.1.0
**/

/* create Database */
DROP DATABASE IF EXISTS JavaEEPOS;
CREATE DATABASE IF NOT EXISTS JavaEEPOS;
SHOW DATABASES;
USE JavaEEPOS;

/* create customer table */
DROP TABLE IF EXISTS customer;
CREATE TABLE IF NOT EXISTS customer(
    id VARCHAR(15) NOT NULL,
    name VARCHAR(50) NOT NULL DEFAULT 'Unknown',
    address VARCHAR(60),
    contact VARCHAR (18),
    CONSTRAINT PRIMARY KEY (id)
    );
SHOW TABLES ;
DESCRIBE customer;

/* create item table */
DROP TABLE IF EXISTS item;
CREATE TABLE IF NOT EXISTS item(
    itemCode VARCHAR(15) NOT NULL,
    name VARCHAR(20) NOT NULL DEFAULT 'Unknown',
    qtyOnHand INT (20) NOT NULL DEFAULT 0,
    price DOUBLE (15,2) NOT NULL DEFAULT 0,
    CONSTRAINT PRIMARY KEY (itemCode)
    );
SHOW TABLES ;
DESCRIBE item;

/* create orders table */
DROP TABLE IF EXISTS orders;
CREATE TABLE IF NOT EXISTS orders(
    orderId VARCHAR(15) NOT NULL,
    cid VARCHAR(15) NOT NULL,
    orderDate DATE NOT NULL,
    total DOUBLE (15,2) NOT NULL,
    discount DOUBLE (15,2) NOT NULL,
    subTotal DOUBLE (15,2) NOT NULL,
    CONSTRAINT PRIMARY KEY (orderId),
    CONSTRAINT FOREIGN KEY (cid) REFERENCES customer(id) ON DELETE CASCADE ON UPDATE CASCADE
    );
SHOW TABLES ;
DESCRIBE orders;

/* create order_detail table */
DROP TABLE IF EXISTS order_detail;
CREATE TABLE IF NOT EXISTS order_detail(
    oId VARCHAR(15) NOT NULL,
    iCode VARCHAR(15) NOT NULL,
    qty INT NOT NULL DEFAULT 0,
    price DOUBLE (12,2) NOT NULL,
    total DOUBLE (12,2) NOT NULL,
    CONSTRAINT PRIMARY KEY (iCode, oId),
    CONSTRAINT FOREIGN KEY (iCode) REFERENCES item(itemCode) ON DELETE CASCADE ON UPDATE CASCADE ,
    CONSTRAINT FOREIGN KEY (oId) REFERENCES orders(orderId) ON DELETE CASCADE ON UPDATE CASCADE
    );
SHOW TABLES ;
DESCRIBE order_detail;