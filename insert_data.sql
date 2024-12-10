# Insert data into the tables

USE uni_helper;

INSERT INTO users (name, email, password)VALUES("John Doe", "johndoe@mail.com", "password"), ("Jain Doe", "jaindoe@mail.com", "password");
INSERT INTO products (name, description, price, user_id, cat_id)VALUES('Economics 101', 'This is the textbook required from introduction to economics',5, 1, 8) ,('Introduction to Art', "This textbook is required for Beginners Art module",3, 2, 2);
INSERT INTO categories (name)VALUES ("Anthropology"), ("Art"), ("Business"), ("Computing"), ("Curating"), ("Design"), ("Drama"), ("Economics"), ("Education"), ("History"), ("Internation Relations"), ("Marketing"), ("Mathematics"), ("Media & Communications"), ("Politics"), ("Psychology"), ("Sociology"), ("Social Work");