const mysql = require("mysql2");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mommasboy1",
    database: "employees_db",
});

function start() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "what would you like to do?",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update employee role",
            "Exit",
        ],
    }).then(function (answer) {
        switch (answer.action) {
            case "View all departments":
                viewDepartments();
                break;
            case "View all roles":
                viewRoles();
                break;
            case "View all employees":
                viewEmployees();
                break;
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Update employee role":
                updateEmployeeRole();
                break;
            case "Exit":
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
const viewRoles = () => {
    let query = "SELECT role.title, role.salary, role.id, department.name FROM role RIGHT JOIN department ON role.department_id = department.id";

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
};
const viewEmployees = () => {
    let query = "SELECT t1.first_name, t1.last_name, t2.first_name AS manager FROM employee t1 INNER JOIN employee t2 ON t1.manager_id = t2.id";

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
};



const addDepartment = () => {
    inquirer.prompt([
        {
            name: "department",
            type: "input",
            message: "Enter the name of the new department:",
        },
    ]).then(function (answer) {
        let query = "INSERT INTO department (name) VALUES (?)";
        connection.query(query, answer.department, function (err, res) {
            if (err) throw err;
            console.log("New department added!");
            start();
        });
    });
};

const addRole = () => {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "title",
                    type: "input",
                    message: "What is the role title?",
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the role salary?",
                },
                {
                    name: "department",
                    type: "list",
                    choices: function () {
                        return res.map((department) => ({
                            name: department.name,
                            value: department.id,
                        }));
                    },
                    message: "Which department does the role belong to?",
                },
            ])
            .then(function (answer) {
                connection.query(
                    "INSERT INTO role SET ?",
                    {
                        title: answer.title,
                        salary: answer.salary,
                        department_id: answer.department,
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("The role was added successfully!");
                        start();
                    }
                );
            });
    });
};

const addEmployee = () => {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw (err);
        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "First name?",
            },
            {
                name: "lastName",
                type: "input",
                message: "Last name?",
            },
            {
                name: "managerId",
                type: "input",
                message: "Manager ID?",
            },
            {
                name: "addRole",
                type: "list",
                choices: function () {
                    return res.map((role) => ({ name: role.title, value: role.id }));
                },
                message: "Role?",
            },
        ]).then(function (answer) {
            connection.query("INSERT INTO employee SET ?", {
                first_name: answer.firstName,
                last_name: answer.lastName,
                manager_id: answer.managerId,
                role_id: answer.addRole,
            }, function (err) {
                if (err) throw err;
                console.log("New employee added!");
                start();
            });
        })
    });
};


const updateEmployeeRole = () => {
    connection.query("SELECT * FROM role", function (err, res) {
        inquirer.prompt([
            {
                name: "employeeId",
                type: "input",
                message: "Enter the employee ID:"
            },
            {
                name: "updatedRole",
                type: "list",
                choices: function () {
                    return res.map((role) => ({ name: role.title, value: role.id }));
                },
                message: "Select the new role:",
            }
        ]).then(function (answer) {
            connection.query(
                "UPDATE employee SET role_id = ? WHERE id = ?",
                [answer.updatedRole, answer.employeeId],
                function (err, res) {
                    if (err) throw err;
                    console.log(`Updated employee with ID ${answer.employeeId} to role with ID ${answer.updatedRole}.`);
                    start();
                }
            );
        });
    });
};



start();