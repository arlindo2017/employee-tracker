const cTable = require('console.table');
const inquirer = require('inquirer');
const { 
    menuPrompt, 
    addDepartmentPrompt, 
    addRolePrompt, 
    addEmployeePrompt,
    deleteDepartmentPrompt,
    confirmPrompt
} = require('./prompts.js');
const {departmentMessage, roleMessage, employeeMessage} = require('./headers.js');
const {db} = require('./connection.js');


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
            console.log('\x1b[31m%s\x1b[0m','Shutting down ...');
            setTimeout(() => {
                console.clear();
                process.exit(0);
            }, 1000);
            
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
        count(employee_id) as "ASSOCIATE COUNT",
        sum(c.salary)	as "UTILIZED BUDGET"
        FROM department     a
        left join employee   b
        on b.dept_id        = a.dept_id
        left join role		c
        on c.role_id		= b.role_id
        group by a.dept_id, a.dept_name;
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
        case when d.first_name is null then ''
        else 
        concat(concat(d.first_name,' '),d.last_name) end as "MANAGER",
        c.salary		as SALARY
        FROM employee   a   
        JOIN role       c
        ON c.role_id    = a.role_id
        JOIN department b 
        ON b.dept_id    = c.dept_id
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
        addDepartmentPrompt().then((answers) => {
        db.query(`
        INSERT INTO 
        department (dept_name)
        VALUES 
        ('${answers.department}')`);
        viewAllDepartments();
        })
    } catch (err) {
      throw new Error(err);
    }
};

async function addRole() {
    try {
        const answers = await addRolePrompt();
        db.promise().query(`
            INSERT INTO 
            role (title, salary, dept_id)
            VALUES (?, ?, (SELECT dept_id FROM department WHERE dept_name = ?))
            `,
            [answers.name, answers.salary, answers.department],
        );
        console.log('\x1b[32m%s\x1b[0m',`${answers.name} role, successfully added to ${answers.department}!`);
        setTimeout(() => {
            viewAllRoles();
        }, 1500);
    } catch (err) {
      throw new Error(err);
    }
};  
  
async function addEmployee() {
    try {
        console.clear();
        const answers = await addEmployeePrompt();
        await db.promise().query(`
        INSERT INTO 
        employee (first_name, last_name, dept_id, role_id, manager_id)
        VALUES (?, ?, 
        (SELECT dept_id FROM department WHERE dept_name = ?),
        (SELECT role_id FROM role WHERE title = ?),
        (SELECT b.employee_id 
         FROM employee 		a
         JOIN employee 		b 
         ON a.employee_id 	= b.employee_id
         WHERE CONCAT(b.first_name,b.last_name) = ?))
        `,[answers.firstname,answers.lastname,answers.department,answers.role,answers.manager]
        );
        console.log('\x1b[31m%s\x1b[0m', `Employee ${answers.firstname} ${answers.lastname} was added Manaher:${answers.manager}!`);
        setTimeout(() => {
            viewAllEmployees();
        }, 1500);
    } catch (err) {
        console.log('\x1b[31m%s\x1b[0m', `Error: ${err}`);
    }
};

function updateEmployeeRole() {
    console.clear();
    console.log('updateEmployeeRole');
    return mainMenu();
};

// Delete Functions
function deleteDepartment() {
    console.clear();
    deleteDepartmentPrompt()
    .then((answers) => {
        return db.promise().query(`DELETE FROM department WHERE dept_name = ?`, [answers.department])
    })
    .then(() => {
        return confirmPrompt();
    })
    .then(() => {
        console.log('\x1b[31m%s\x1b[0m', `Department was deleted!`);
        setTimeout(() => {
            viewAllDepartments();
        }, 1500);
    })
    .catch((err) => {
        console.log('\x1b[31m%s\x1b[0m', `Error: ${err}`);
    });
};

module.exports = {mainMenu};