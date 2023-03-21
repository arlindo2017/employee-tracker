// Import Libraries
const cTable = require('console.table');
const inquirer = require('inquirer');

// Import Functions
const {departmentMessage, roleMessage, employeeMessage} = require('./headers.js');
const {db} = require('./connection.js');
const { 
    menuPrompt, 
    addDepartmentPrompt, 
    addRolePrompt, 
    addEmployeePrompt,
    deleteDepartmentPrompt,
    confirmPrompt,
    updateEmployeePrompt,
    deleteEmployeePrompt,
    deleteRolePrompt
} = require('./prompts.js');

// Render Main menu that calls all Functions
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
        } else if (menu.choice === 'Delete Employee') { 
            deleteEmployee();  
        } else if (menu.choice === 'Delete Role') { 
            deleteRole();  
        }
        else if (menu.choice === 'Quit') {
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

//Display all Departments
function viewAllDepartments() {
    db.promise().query(`
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
    `,)
    .then(([rows]) =>{
        console.clear();
         departmentMessage();
         console.table(rows);
         mainMenu();
    }) 
    .catch((err) => {
        console.log(err);
    })
};

// Display All Roles
function viewAllRoles() {
    db.promise().query(`
        SELECT 
        a.role_id       as ID,
        a.title         as "JOB TITLE",
        b.dept_name     as "DEPT NAME",
        a.salary        as SALARY
        FROM role       a
        JOIN department b 
        ON b.dept_id    = a.dept_id
        order by a.salary desc
    `)
    .then(([rows]) =>{
        console.clear();
        roleMessage();
        console.table(rows);
        mainMenu();
    })
    .catch((err) => {
        console.log(err);
    })
};

// Display all Employees
function viewAllEmployees() {
    db.promise().query(`
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
    `)
    .then(([rows]) =>{
        console.clear();
        employeeMessage();
        console.table(rows);
        mainMenu();
    })
    .catch((err) => {
        console.log(err);
    })
};

//Add new Department
function addDepartment() {
    console.clear();
    return addDepartmentPrompt()
    .then((answers) => {
        db.promise().query(`
            INSERT INTO 
            department (dept_name)
            VALUES 
            ('${answers.department}')
        `); 
            console.log('\x1b[32m%s\x1b[0m',`${answers.department} was successfully added!`);
            setTimeout(() => {
                viewAllDepartments();
            }, 1500);
        })
    .catch((err) => {
        console.log(err);
    })
};

function addRole() {
    return addRolePrompt()
    .then((answers) => {
    db.promise().query(`
        INSERT INTO 
        role (title, salary, dept_id)
        VALUES (?, ?, (SELECT dept_id FROM department WHERE dept_name = ?))
        `,[answers.title, answers.salary, answers.department]) 
        console.log('\x1b[32m%s\x1b[0m',`${answers.title} role, successfully added to ${answers.department}!`);
        setTimeout(() => {
            viewAllRoles();
        }, 1500);
    }) 
    .catch((err) => {
        console.log(err);
    })   
};  
// add New Employee
function addEmployee() {
    console.clear();
    return addEmployeePrompt()
    .then ((answers) => {
        db.promise().query(`
        INSERT INTO 
        employee (first_name, last_name, dept_id, role_id, manager_id)
        VALUES (?, ?, 
        (SELECT dept_id FROM department WHERE dept_name = ?),
        (SELECT role_id FROM role WHERE title = ?),
        (SELECT b.employee_id 
        FROM employee 		a
        JOIN employee 		b 
        ON a.employee_id 	= b.employee_id
        WHERE CONCAT(b.first_name,' ', b.last_name) = ?))
        `,[answers.firstname,answers.lastname,answers.department,answers.role,answers.manager]
        )
        console.log('\x1b[31m%s\x1b[0m', `Employee ${answers.firstname} ${answers.lastname} was added Manaher:${answers.manager}!`);
        setTimeout(() => {
            viewAllEmployees();
        }, 1500); 
    })
    .catch((error) => {
        console.error(error);
    });
};

//Update Employee Role
function updateEmployeeRole() {
    return updateEmployeePrompt()
    .then((answers) => {
        return db.promise().query(`
        UPDATE employee 
        SET role_id = (SELECT role_id FROM role where title = ?)
        WHERE CONCAT(employee.first_name, ' ', employee.last_name) = ?`,
        [ answers.title, answers.employee]
        );
    })
    .then(() => {
        console.clear();
        console.log('\x1b[31m%s\x1b[0m',"Employee's role updated successfully!");
        setTimeout(() => {
            viewAllEmployees();
        }, 1500);
        
    })
    .catch((error) => {
        console.error(error);
    });
};

// Delete Functions =======================================================================================
// Delete Department
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

// Delete Role
function deleteRole() {
    console.clear();
    deleteRolePrompt()
    .then((answers) => {
        return db.promise().query(`DELETE FROM role WHERE title = ?`, [answers.role])
    })
    .then(() => {
        return confirmPrompt();
    })
    .then(() => {
        console.log('\x1b[31m%s\x1b[0m', `Role was deleted!`);
        setTimeout(() => {
            viewAllRoles();
        }, 1500);
    })
    .catch((err) => {
        console.log('\x1b[31m%s\x1b[0m', `Error: ${err}`);
    });
};

// Delete Employee
function deleteEmployee() {
    console.clear();
    deleteEmployeePrompt()
    .then((answers) => {
        return db.promise()
        .query(`
            DELETE FROM employee 
            WHERE employee_id IN (
            SELECT * FROM (
            SELECT employee_id 
            FROM employee 
            WHERE concat(first_name,' ',last_name) = ?
            ) AS temp)`, 
            [answers.employee]
        )
    })
    .then(() => {
        return confirmPrompt();
    })
    .then(() => {
        console.log('\x1b[31m%s\x1b[0m', `Employee was deleted!`);
        setTimeout(() => {
            viewAllEmployees();
        }, 1500);
    })
    .catch((err) => {
        console.log('\x1b[31m%s\x1b[0m', `Error: ${err}`);
    });
};

module.exports = {mainMenu};