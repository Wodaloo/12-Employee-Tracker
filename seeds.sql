USE employees_db;

INSERT INTO department (name) VALUES
("Information Systems and Tech"),
("Finance"),
("Legal"),
("Human Resources"),
("Security"),
("Sales");

INSERT INTO role (title, salary, department_id) VALUES
("Web Developer", 90000, 1),
("Accountant", 70000, 2),
("Paralegal", 50000, 3),
("Manager", 70000, 4),
("Engineer", 90000, 5),
("Sales Rep", 40000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES
("John", "Smith", 1, 6),
("Bob", "Builder", 2, 5),
("David", "Pilcher", 2, 4),
("Dillan", "Jarvis", 4, 3),
("Sarah", "Pope", 5, 2),
("Chris", "Davis", 6, 1);