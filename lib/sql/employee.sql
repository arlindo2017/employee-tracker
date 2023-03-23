CREATE TABLE employee_db.employee (
  employee_id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  dept_id INT NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  FOREIGN KEY (role_id)
  REFERENCES role(role_id)
);


INSERT INTO employee_db.employee (first_name, last_name, dept_id, role_id, manager_id) VALUES 
('Liam', 'Jones', 1, 1, NULL), 
('Olivia', 'Brown', 1, 2, 1), 
('Noah', 'Garcia', 2, 3, 1), 
('Amelia', 'Miller', 2, 4, 2), 
('Ethan', 'Davis', 3, 5, 2), 
('Ava', 'Wilson', 3, 6, 3), 
('William', 'Taylor', 4, 7, 3), 
('Sophia', 'Anderson', 4, 8, 4), 
('James', 'Jackson', 5, 9, 4), 


  
select * from employee_db.employee