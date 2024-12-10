# Create database script for Berties books

# Create the database
CREATE DATABASE IF NOT EXISTS uni_helper;
USE uni_helper;

# Create the tables
CREATE TABLE IF NOT EXISTS users (user_id INT AUTO_INCREMENT,name VARCHAR(50), email VARCHAR(50), password VARCHAR(50), PRIMARY KEY(user_id));
CREATE TABLE IF NOT EXISTS products (product_id INT AUTO_INCREMENT,name VARCHAR(50), description VARCHAR(500), price DECIMAL(6, 2) unsigned, user_id INT, cat_id INT, PRIMARY KEY(product_id));
CREATE TABLE IF NOT EXISTS categories (cat_id INT AUTO_INCREMENT,name VARCHAR(50), PRIMARY KEY(cat_id));


CREATE USER IF NOT EXISTS 'uni_helper_app'@'localhost' IDENTIFIED BY 'qwertyuiop'; 
GRANT ALL PRIVILEGES ON uni_helper.* TO ' uni_helper_app'@'localhost'; 