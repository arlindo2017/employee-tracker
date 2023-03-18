const inquirer = require('inquirer');

function menuPrompt() {
    return inquirer
    .prompt([
        {
          type: 'list',
          name: 'choice',
          message: 'Main Menu:',
          choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add Department',
            'Add Role',
            'Add an Employee',
            'Update Employee Role',
            'Quit'
          ]
        }
    ])
}

function addDepartmentPrompt() {
  return inquirer
  .prompt([
      {
        type: 'input',
        name: 'department',
        message: 'Enter name of department',

      }
  ])
}

function addEmployeePrompt() {
  return inquirer
  .prompt([
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
        message: "What is the employee's role",
        choices: [
          'Role 1',
          'Role 2'
        ]
      }
  ])
}

function addRolePrompt() {
  return inquirer
  .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter name of the role',

      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter role salary',

      },
      {
        type: 'list',
        name: 'department',
        message: 'Which department is this role being added to',
        choices: [
          'Dept 1',
          'Dept 2'
        ]
      }
  ])
}




module.exports = { menuPrompt,addDepartmentPrompt,addRolePrompt,addEmployeePrompt };