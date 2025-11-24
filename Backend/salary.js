const mongoose = require('mongoose');


const salarySchema = new mongoose.Schema({
  employeeNumber: String,
  grossSalary: Number,
  totalDeduction: Number,
  netSalary: Number,
  month: String
});

const Salary = mongoose.model('Salary', salarySchema);


const getAllSalaries = async (req, res) => {
  const salaries = await Salary.find();
  res.json(salaries);
};


const addSalary = async (req, res) => {
  const data = req.body;
  data.netSalary = data.grossSalary - data.totalDeduction;
  
  const salary = new Salary(data);
  await salary.save();
  res.json(salary);
};


const updateSalary = async (req, res) => {
  const data = req.body;
  data.netSalary = data.grossSalary - data.totalDeduction;
  
  const salary = await Salary.findByIdAndUpdate(
    req.params.id, 
    data, 
    { new: true }
  );
  res.json(salary);
};


const deleteSalary = async (req, res) => {
  await Salary.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};

module.exports = { 
  Salary, 
  getAllSalaries, 
  addSalary, 
  updateSalary, 
  deleteSalary 
};