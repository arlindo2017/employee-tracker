CREATE TABLE employee_db.role (
  role_id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL,
  dept_id INT,
  FOREIGN KEY (dept_id)
  REFERENCES department(dept_id)
);


INSERT INTO employee_db.role (title, salary, dept_id)
VALUES
  ('Project Manager', 150000, 4)
  ('Operations Manager', 150000, 1)
  ('Software Developer', 75000, 1),
  ('Database Administrator', 80000, 1),
  ('Network Engineer', 85000, 1),
  ('Web Developer', 70000, 2),
  ('UI/UX Designer', 65000, 2),
  ('Front-end Developer', 75000, 2),
  ('Data Analyst', 70000, 3),
  ('Business Intelligence Analyst', 80000, 3),
  ('Data Scientist', 90000, 3),
  ('IT Manager', 100000, 4);
  
select * from employee_db.role