const mongoose = require('mongoose');

// Step 1: Create employee template
const employeeSchema = new mongoose.Schema({
  employeeNumber: String,
  firstName: String,
  lastName: String,
  position: String,
  address: String,
  telephone: String,
  gender: String,
  hiredDate: Date,
  departmentCode: String
});

const Employee = mongoose.model('Employee', employeeSchema);

// Step 2: Make employee number automatically
const makeEmployeeNumber = async () => {
  const lastEmployee = await Employee.findOne().sort({ employeeNumber: -1 });
  
  if (!lastEmployee) {
    return 'EMP001';  // First employee
  }
  
  const oldNumber = lastEmployee.employeeNumber.replace('EMP', '');
  const newNumber = parseInt(oldNumber) + 1;
  
  return 'EMP' + String(newNumber).padStart(3, '0');
};

// Step 3: Get all employees
const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
};

// Step 4: Add new employee
const addEmployee = async (req, res) => {
  const employeeNumber = await makeEmployeeNumber();  // Make number
  
  const employee = new Employee({
    employeeNumber: employeeNumber,  // Auto number
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    position: req.body.position,
    address: req.body.address,
    telephone: req.body.telephone,
    gender: req.body.gender,
    hiredDate: req.body.hiredDate,
    departmentCode: req.body.departmentCode
  });
  
  await employee.save();
  res.json(employee);
};

// Step 5: Get one employee
const getEmployee = async (req, res) => {
  const employee = await Employee.findOne({ 
    employeeNumber: req.params.number 
  });
  res.json(employee);
};

module.exports = { 
  Employee, 
  getAllEmployees, 
  addEmployee, 
  getEmployee 
};