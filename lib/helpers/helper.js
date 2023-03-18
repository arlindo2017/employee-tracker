const cTable = require('console.table');
const { menuPrompt, addDepartmentPrompt, addRolePrompt, addEmployeePrompt } = require('../js/prompts.js');
//const {mainMenu} = require('../../server.js')

function mainMenu() {
  menuPrompt()
  .then((menu) => {
      if (menu.choice === 'View All Departments') {
          viewAllDepartments();
          mainMenu();
      } else if (menu.choice === 'View All Roles') {
          viewAllRoles();
          mainMenu();
      } else if (menu.choice === 'View All Employees') {
          viewAllEmployees();
          mainMenu();
      } else if (menu.choice === 'Add Department') {
          addDepartment()
      } else if (menu.choice === 'Add Role') {
          addRole()
      } else if (menu.choice === 'Add an Employee') {
          addEmployee();
      } else if (menu.choice === 'Update Employee Role') {
          updateEmployeeRole();
      } else if (menu.choice === 'Quit') {
          console.log('Goodbye!');
      } else {
          console.log('Invalid choice');
          mainMenu();
      }
  });
}

function viewAllDepartments() {
    console.log('viewAllDepartments');
    console.table([
        {
          name: 'foo',
          age: 10
        }, {
          name: 'bar',
          age: 20
        }
      ]);
    
};

function viewAllRoles() {
    console.log('viewAllRoles');
    console.table([
        {
          name: 'foo',
          age: 10
        }, {
          name: 'bar',
          age: 20
        }
      ]);
    
};

function viewAllEmployees() {
    console.log('viewAllEmployees');
    const employees = [
        { name: 'John Doe', title: 'Manager', department: 'Sales', salary: 50000 },
        { name: 'Jane Smith', title: 'Assistant Manager', department: 'Sales', salary: 40000 },
        { name: 'Bob Johnson', title: 'Sales Representative', department: 'Sales', salary: 30000 },
        { name: 'Sue Wilson', title: 'Manager', department: 'Marketing', salary: 55000 },
        { name: 'Tom Williams', title: 'Assistant Manager', department: 'Marketing', salary: 45000 },
        { name: 'Karen Lee', title: 'Marketing Representative', department: 'Marketing', salary: 35000 },
        { name: 'Mike Brown', title: 'Manager', department: 'IT', salary: 60000 },
        { name: 'Emily Davis', title: 'Assistant Manager', department: 'IT', salary: 50000 },
        { name: 'David Martinez', title: 'IT Specialist', department: 'IT', salary: 40000 },
        { name: 'Lisa Rodriguez', title: 'IT Specialist', department: 'IT', salary: 40000 }
      ];
      
      console.table(employees);
      
    
};

function addDepartment() {
    addDepartmentPrompt()
    .then((answers) => {
        // Use the user input to add the department to the database
        // connection.query(
        //     'INSERT INTO departments SET ?',
        //     { department_name: answers.department },
        //     (err, res) => {
        //         if (err) throw err;
        //         console.log('Department added successfully!');
        //         // Call the main menu prompt again to return to the menu options
        //         menuPrompt();
        //     }
        // );
        console.log(`${answers.department} department added successfully!`);
        return mainMenu();
    })
}

function addRole() {
    addRolePrompt().then((answers) => {
      console.log(`${answers.name} role, successfully added to ${answers.department} with a salary of ${answers.salary}!`);
      return mainMenu();
    })
}
  

function addEmployee() {
    addEmployeePrompt().then((answers) => {
        console.log(`${answers.firstname} ${answers.lastname} was added to ${answers.role} role!`);
        return mainMenu();
    })
};

function updateEmployeeRole() {
    console.log('updateEmployeeRole');
    
};

module.exports = { mainMenu, viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole};