const cTable = require('console.table');
const { 
    menuPrompt, 
    addDepartmentPrompt, 
    addRolePrompt, 
    addEmployeePrompt,
    deleteDepartmentPrompt,
    confirmPrompt
} = require('./prompts.js');
const { departmentMessage, roleMessage, employeeMessage} = require('./headers.js');
const mysql = require('mysql2');


const PORT = process.env.PORT || 3001;

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'CE.~R?kl{7[C5y$9u&z@nd*|FOZ_n1T8-W]6vk%a1Xek2WmJ',
        database: 'employee_db'
    },
    console.log(`Connected to the database.`)
);

function mainMenu() {
    menuPrompt()
    .then((menu) => {
        if (menu.choice === 'View All Departments') {
            viewAllDepartments();
        } else if (menu.choice === 'View All Roles') {
            viewAllRoles();
        } else if (menu.choice === 'View All Employees') {
            viewAllEmployees();
        } else if (menu.choice === 'Add Department') {
            addDepartment();
        } else if (menu.choice === 'Add Role') {
            addRole();
        } else if (menu.choice === 'Add an Employee') {
            addEmployee();
        } else if (menu.choice === 'Update Employee Role') {
            updateEmployeeRole();
        } else if (menu.choice === 'Delete Department') {
            deleteDepartment();
        }else if (menu.choice === 'Quit') {
            console.clear();
            console.log('Shutting down ....');
            process.exit(0);
        } else {
            console.log('Invalid choice');
            mainMenu();
        }
    });
};
  
async function viewAllDepartments() {
    try {
      const [rows, fields] = await db.promise()
        .query(`
        SELECT 
        a.dept_id AS ID ,
        a.dept_name AS "DEPT NAME",
        sum(c.salary)	as "UTILIZED BUDGET"
        FROM department     a
        left join employee   b
        on b.dept_id        = a.dept_id
        left join role		c
        on c.role_id		= b.role_id
        group by a.dept_id, a.dept_name
        `);
        console.clear();
        departmentMessage();
        console.table(rows);
        mainMenu();
    } catch (err) {
      throw new Error(err);
    }
};

async function viewAllRoles() {
    try {
        const [rows, fields] = await db.promise()
        .query(`
            SELECT 
            a.role_id       as ID,
            a.title         as "JOB TITLE",
            b.dept_name     as "DEPT NAME",
            a.salary        as SALARY
            FROM role       a
            JOIN department b 
            ON b.dept_id    = a.dept_id
            order by a.salary desc
            `);
        console.clear();
        roleMessage();
        console.table(rows);
        mainMenu();
    } catch (err) {
      throw new Error(err);
    }
};

async function viewAllEmployees() {
    try {
        const [rows, fields] = await db.promise()
        .query(`
        SELECT 
        a.employee_id   as ID,
        a.first_name    as "FIRST NAME",
        a.last_name     as "LAST NAME",
        c.title         as "TITLE",
        b.dept_name     as "DEPARTMENT",
        concat(concat(d.first_name,' '),d.last_name) as "MANAGER",
        c.salary		as SALARY
        FROM employee   a   
        JOIN department b 
        ON b.dept_id    = a.dept_id
        JOIN role       c
        ON c.role_id    = a.role_id
        left JOIN employee   d
        ON  d.employee_id 	= a.manager_id 
        order by b.dept_name, concat(concat(d.first_name,' '),d.last_name)
        `);
        console.clear();
        employeeMessage();
        console.table(rows);
        mainMenu();
    } catch (err) {
      throw new Error(err);
    }
};

async function addDepartment() {
    try {
        console.clear();
        addDepartmentPrompt()
        .then((answers) => {
        db.query(`
        INSERT INTO 
        department (dept_name)
        VALUES 
        ('${answers.department}')`);
        viewAllDepartments();
        mainMenu();
        })
    } catch (err) {
      throw new Error(err);
    }
};

function addRole() {
    console.clear();
    addRolePrompt()
    .then((answers) => {
      console.log('\x1b[32m%s\x1b[0m', `${answers.name} role, successfully added to ${answers.department} with a salary of ${answers.salary}!`);
      return mainMenu();
    })
}
  
function addEmployee() {
    console.clear();
    addEmployeePrompt().then((answers) => {
        console.log('\x1b[32m%s\x1b[0m', `${answers.firstname} ${answers.lastname} was added to ${answers.role} role!`);
        return mainMenu();
    })
};

function updateEmployeeRole() {
    console.clear();
    console.log('updateEmployeeRole');
    return mainMenu();
};

// Delete Functions
async function deleteDepartment() {
    try {
      console.clear();
      deleteDepartmentPrompt().then(async (answers) => {
        const [rows] = await db.promise().query(`
          SELECT dept_id, dept_name
          FROM department
          WHERE dept_id = ${answers.dept_id}
        `);
        if (rows.length === 0) {
          console.log('\x1b[31m%s\x1b[0m', `Department with ID = ${answers.dept_id} does not exist!`);
          rows.d
          mainMenu();
        } else {
          db.query(`
            DELETE 
            FROM department 
            WHERE dept_id = ${answers.dept_id};
          `);
          confirmPrompt().then(() => {
            viewAllDepartments().then(() => {
              console.log('\x1b[31m%s\x1b[0m', `${rows[0].dept_name} Department was deleted!`);
            })
          })
        }
      });
    } catch (err) {
      throw new Error(err);
    }
  };
  



module.exports = {mainMenu};