const mysql = require("mysql2");
const inquirer = require("inquirer");
const { last } = require("rxjs");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mommasboy1",
    database: "employees_db",
});

function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "what would you like to do?",
            choices: ["view all departments", "View all roles", "view all employees", "add a department", "add a role", "add an employee", "update employee role", "Exit",],
        }).then(function (answer) {
            switch (answer.action) {
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'view all employees':
                    viewEmployees();
                    break;
                case 'add a department':
                    addDepartment();
                    break;
                case 'add a role':
                    addRole();
                    break;
                case 'add an employee':
                    addEmployee();
                    break;
                case 'update employee role':
                    updateEmployeeRole();
                    break;
                case 'Exit':
                    connection.end();
                    break;
                default:
                    break;

            }

        });
}

const viewDepartments = () => {
    let query = "SELECT * FROM department";

    connection.query(query, function (err, res) {
        if (err) throw (err);
        console.table(res);
        start();
    });
};
const viewRoles = () => {
    let query = "SELECT role.title, role.salary, role.id from role RIGHT JOIN department ON role.department_id =department.name";

    connection.query(query, function (err, res) {
        if (err) throw (err);
        console.table(res);
        start();
    });
};
const viewEmployees = () => {
    let query = "SELECT t1.first_name, t1.lastname, t2.first_name as manager FROM employee t1 INNER JOIN employee t2 ON t1.manager_id = t2.id";
    connection.query(query, function (err, res) {
        if (err) throw (err);
        console.table(res);
        start();
    });
};
const addEmployee = () => {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw (err);
        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "first name?",
            },
            {
                name: "lastName",
                type: "input",
                message: "last name?",
            },
            {
                name: "managerId",
                type: "input",
                message: "manager Id?",
            },
            {
                name: "addRole",
                type: "list",
                choices: function () {
                    return res.map((role) => ({ name: role.title, value: role.id }));
                },
                message: "role?",
            },
        ]).then(function (answer) {
            connection.query("INSERT INTO employee SET ?", {

                first_name: answer.firstname,
                last_name: answer.lastname,
                manager_id: answer.managerId,
                role_id: answer.addRole,

            }),
                start()
        })
    });
};

const updateEmployeeRole = () => {
    connection.query("SELECT * FROM role", function (err, res) {
        inquirer.prompt([
            {
                name: "employeeId",
                type: "input",
                message: "employee Id?",
            },
            {
                name: "updatedRole",
                type: "list",
                choices: function () {
                    return res.map((role) => ({ name: role.title, value: role.id }));
                },
                message: "role?",
            }
        ])
    });
};

start();