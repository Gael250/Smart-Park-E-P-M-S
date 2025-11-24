const { Salary } = require('./salary');
const { Employee } = require('./employee');
const { Department } = require('./department');


const getPayrollReport = async (req, res) => {
  const salaries = await Salary.find();
  const report = [];
  
  for (let salary of salaries) {
    const employee = await Employee.findOne({ 
      employeeNumber: salary.employeeNumber 
    });
    
    if (employee) {
      const department = await Department.findOne({ 
        departmentCode: employee.departmentCode 
      });
      
      report.push({
        firstName: employee.firstName,
        lastName: employee.lastName,
        position: employee.position,
        department: department ? department.departmentName : 'Unknown',
        netSalary: salary.netSalary,
        month: salary.month
      });
    }
  }
  
  res.json(report);
};


const getPayrollByMonth = async (req, res) => {
  const salaries = await Salary.find({ month: req.params.month });
  const report = [];
  
  for (let salary of salaries) {
    const employee = await Employee.findOne({ 
      employeeNumber: salary.employeeNumber 
    });
    
    if (employee) {
      const department = await Department.findOne({ 
        departmentCode: employee.departmentCode 
      });
      
      report.push({
        firstName: employee.firstName,
        lastName: employee.lastName,
        position: employee.position,
        department: department ? department.departmentName : 'Unknown',
        netSalary: salary.netSalary,
        month: salary.month
      });
    }
  }
  
  res.json(report);
};

module.exports = { getPayrollReport, getPayrollByMonth };