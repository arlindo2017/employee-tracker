const cliBoxes = require('cli-boxes');
const box = (cliBoxes.classic);

function welcomeMessage() {
    console.log('\x1b[1m\x1b[34m' + box.topLeft + box.top.repeat(100) + box.topRight + '\x1b[0m');
    console.log('\x1b[1m\x1b[34m' + box.left + ''.padEnd(36) + '\x1b[1m\x1b[32mWelcome to Employee Manager\x1b[0m' + ''.padEnd(37) + '\x1b[1m\x1b[34m' + box.right + '\x1b[0m');
    console.log('\x1b[1m\x1b[34m' + box.bottomLeft + box.bottom.repeat(100) + box.bottomRight + '\x1b[0m');    
};

function departmentMessage() {
    console.log('\x1b[1m\x1b[34m' + box.topLeft + box.top.repeat(100) + box.topRight + '\x1b[0m');
    console.log('\x1b[1m\x1b[34m' + box.left + ''.padEnd(44) + '\x1b[1m\x1b[32mDepartments\x1b[0m' + ''.padEnd(45) + '\x1b[1m\x1b[34m' + box.right + '\x1b[0m');
    console.log('\x1b[1m\x1b[34m' + box.bottomLeft + box.bottom.repeat(100) + box.bottomRight + '\x1b[0m');   

};

function roleMessage() {
    console.log('\x1b[1m\x1b[34m' + box.topLeft + box.top.repeat(100) + box.topRight + '\x1b[0m');
    console.log('\x1b[1m\x1b[34m' + box.left + ''.padEnd(47) + '\x1b[1m\x1b[32mRoles\x1b[0m' + ''.padEnd(48) + '\x1b[1m\x1b[34m' + box.right + '\x1b[0m');
    console.log('\x1b[1m\x1b[34m' + box.bottomLeft + box.bottom.repeat(100) + box.bottomRight + '\x1b[0m');   

};

function employeeMessage() {
    console.log('\x1b[1m\x1b[34m' + box.topLeft + box.top.repeat(100) + box.topRight + '\x1b[0m');
    console.log('\x1b[1m\x1b[34m' + box.left + ''.padEnd(45) + '\x1b[1m\x1b[32mEmployees\x1b[0m' + ''.padEnd(46) + '\x1b[1m\x1b[34m' + box.right + '\x1b[0m');
    console.log('\x1b[1m\x1b[34m' + box.bottomLeft + box.bottom.repeat(100) + box.bottomRight + '\x1b[0m');   

}

module.exports = { welcomeMessage, departmentMessage, roleMessage, employeeMessage};