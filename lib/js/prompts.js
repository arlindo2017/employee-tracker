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
function addRolePrompt() {
    return deptList()
    .then(choices => {
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
          choices: choices,
        },
      ]);
    });
}
  

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
function addEmployeePrompt() {
    return Promise.all([roleList(), deptList(), managerList()])
    .then(([roleChoices, deptChoices, managerChoices]) => {
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
            choices: roleChoices,
            },
            {
            type: 'list',
            name: 'department',
            message: 'Pick a department',
            choices: deptChoices,
            },
            {
            type: 'list',
            name: 'manager',
            message: 'Select a Manager',
            choices: managerChoices,
            }
        ]);
    });
}
  

// Update Prompts =========================================
// Update Employee
function updateEmployeePrompt() {
    return Promise.all([employeeList(), roleList()])
    .then(([employeeChoices, roleChoices]) => {
        return inquirer.prompt([
            {
            type: 'list',
            name: 'employee',
            message: 'Select an Employee',
            choices: employeeChoices,
            },
            {
            type: 'list',
            name: 'title',
            message: 'Select new role',
            choices: roleChoices,
            }
        ]);
    });
  }
  

// Delete Prompts =======================================
// Delete Departments
function deleteDepartmentPrompt() {
    return deptList()
    .then((choices) => {
        return inquirer.prompt([
            {
            type: 'list',
            name: 'department',
            message: 'Pick a department',
            choices: choices,
            }
        ]);
    });
}
  

// Delete Role
function deleteRolePrompt() {
    return roleList()
        .then((choices) => {
        return inquirer.prompt([
            {
            type: 'list',
            name: 'role',
            message: 'Pick which role to delete',
            choices: choices,
            }
        ]);
    });
  }

// Delete Employee
function deleteEmployeePrompt() {
    return employeeList()
        .then((choices) => {
        return inquirer.prompt([
            {
            type: 'list',
            name: 'employee',
            message: 'Select which employee to delete',
            choices: choices,
            }
        ]);
    });
  }

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