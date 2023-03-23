DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

CREATE TABLE employee_db.department(
  dept_id INT PRIMARY KEY AUTO_INCREMENT,
  dept_name VARCHAR(30) NOT NULL
 
);


INSERT INTO employee_db.department (dept_name)
VALUES 
  ('Operations'),
  ('Infrastructure'),
  ('Security'),
  ('Software Development'),
  ('Business Intelligence');




