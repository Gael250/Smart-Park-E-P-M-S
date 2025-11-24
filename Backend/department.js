const mongoose = require('mongoose');


const departmentSchema = new mongoose.Schema({
  departmentCode: String,
  departmentName: String,
  grossSalary: Number
});

const Department = mongoose.model('Department', departmentSchema);


const initDepartments = async (req, res) => {
  await Department.deleteMany({});
  await Department.insertMany([
    { departmentCode: 'CW', departmentName: 'Carwash', grossSalary: 300000 },
    { departmentCode: 'ST', departmentName: 'Stock', grossSalary: 200000 },
    { departmentCode: 'MC', departmentName: 'Mechanic', grossSalary: 450000 },
    { departmentCode: 'ADMS', departmentName: 'Administration Staff', grossSalary: 600000 }
  ]);
  res.json({ message: 'Departments initialized' });
};


const getAllDepartments = async (req, res) => {
  const departments = await Department.find();
  res.json(departments);
};


const addDepartment = async (req, res) => {
  const department = new Department(req.body);
  await department.save();
  res.json(department);
};

module.exports = { 
  Department, 
  initDepartments, 
  getAllDepartments, 
  addDepartment 
};