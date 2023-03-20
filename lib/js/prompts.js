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
        
        'Quit'
          ]
        }
    ])
};

// Menu list of options
async function deptList() {
    const [rows] = await db.promise().query(`SELECT dept_name FROM department`);
    return rows.map(row => row.dept_name);
};

async function managerList() {
    const [rows] = await db.promise().query(` 
    select concat(first_name, last_name) as manager
    from employee		a
    join role			b 
    on b.role_id 		= a.role_id 
    where title         like '%manager%'
    and title           not like '%Assistant%'
    `);
    return rows.map(row => row.manager);
};

async function roleList() {
    const [rows] = await db.promise().query(`SELECT title FROM role`);
    return rows.map(row => row.title);
};

// Add Prompts
async function addRolePrompt() {
    return inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter new role name',
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

// Delete Prompts
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
    confirmPrompt 
};