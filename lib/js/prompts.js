const inquirer = require('inquirer');
const { db } = require('./connection.js');

// Main Menu Options
function menuPrompt() {
    return inquirer
    .prompt([
        {
        type: 'list',
        name: 'choice',
        message: 'Main Menu:',
        prefix: '',
        choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        
        'Add Department',
        'Add Role',
        'Add an Employee',
        
        'Update Employee Role',
        
        'Delete Department',
        'Delete Employee',
        'Delete Role',
        
        'Quit'
          ]
        }
    ])
};

// Menu list of options =======================================
// Department List
function deptList() {
    return db.promise().query(`SELECT dept_name FROM department`)
    .then(([rows]) => {
        return rows.map(row => row.dept_name);
    });
};
// Manager list
function managerList() {
    return db.promise().query(` 
    select concat(first_name,' ',last_name) as manager
    from employee		a
    join role			b 
    on b.role_id 		= a.role_id 
    where title         like '%manager%'
    and title           not like '%Assistant%'`)
    .then(([rows]) => {
        return rows.map(row => row.manager);
    });
};

// List of Employees
function employeeList() {
    return db.promise().query(` 
    select concat(first_name,' ',last_name) as employee
    from employee		a
    join role			b 
    on b.role_id 		= a.role_id 
    `)
    .then(([rows]) => {
        return rows.map(row => row.employee);
    });
};

// List of roles
function roleList() {
    return db.promise().query(`SELECT title FROM role`)
    .then(([rows]) => {
        return rows.map(row => row.title);
    });
};

// Add Prompts =======================================
// Add new role
async function addRolePrompt() {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter title name',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter role salary',
        },
        {
            type: 'list',
            name: 'department',
            message: 'Pick a department',
            choices: await deptList(),
        },
    ]);
};

//Add department
function addDepartmentPrompt() {
  return inquirer
  .prompt([
        {
            type: 'input',
            name: 'department',
            message: 'Enter name of department',
        }
    ])
};

// Add Employee
async function addEmployeePrompt() {
  return inquirer.prompt([
        {
        type: 'input',
        name: 'firstname',
        message: 'First Name',
        },
        {
        type: 'input',
        name: 'lastname',
        message: 'Last Name',
        },
        {
            type: 'list',
            name: 'role',
            message: 'Select a role',
            choices: await roleList()
        },
        {
            type: 'list',
            name: 'department',
            message: 'Pick a department',
            choices: await deptList()
        } ,
        {
            type: 'list',
            name: 'manager',
            message: 'Select a Manager',
            choices: await managerList()
        } 
        
  ])
};

// Update Prompts =========================================
// Update Employee
async function updateEmployeePrompt() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Select an Employee',
            choices: await employeeList()
        },
        {
            type: 'list',
            name: 'title',
            message: 'Select new role',
            choices: await roleList()
        }
    ]);
};

// Delete Prompts =======================================
// Delete Departments
async function deleteDepartmentPrompt() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'department',
            message: 'Pick a department',
            choices: await deptList()
        } 
    ]);
};

// Delete Role
async function deleteRolePrompt() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'role',
            message: 'Pick which role to delete',
            choices: await roleList()
        } 
    ]);
};

// Delete Employee
async function deleteEmployeePrompt() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Select which employee to delete',
            choices: await employeeList()
        } 
    ]);
};

// Asks user to confirm deleting before proceeding
function confirmPrompt() {
    return inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: 'Are you sure you want to continue?'
        }
    ]); 
};

module.exports = { 
    menuPrompt,
    addDepartmentPrompt,
    addRolePrompt,
    addEmployeePrompt,
    deleteDepartmentPrompt,
    confirmPrompt,
    updateEmployeePrompt,
    deleteEmployeePrompt,
    deleteRolePrompt
};