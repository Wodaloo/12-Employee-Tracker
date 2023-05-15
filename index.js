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
        })
        .then(function (answer) {
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
        if (err) throw err;
        console.table(res);
        start();
    });
};


start();