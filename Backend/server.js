const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

// Import files
const connectDB = require('./database');
const user = require('./user');
const department = require('./department');
const employee = require('./employee');
const salary = require('./salary');
const report = require('./reports');

const app = express();


connectDB();

// Middleware
app.use(cors({ 
  origin: 'http://localhost:3000', 
  credentials: true 
}));
app.use(express.json());
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Auth check middleware
const auth = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: 'Please login' });
  }
};

// ============ USER ROUTES ============
app.post('/api/auth/register', user.register);
app.post('/api/auth/login', user.login);
app.post('/api/auth/logout', user.logout);

// ============ DEPARTMENT ROUTES ============
app.post('/api/departments/init', department.initDepartments);
app.get('/api/departments', auth, department.getAllDepartments);
app.post('/api/departments', auth, department.addDepartment);

// ============ EMPLOYEE ROUTES ============
app.get('/api/employees', auth, employee.getAllEmployees);
app.post('/api/employees', auth, employee.addEmployee);
app.get('/api/employees/:number', auth, employee.getEmployee);

// ============ SALARY ROUTES ============
app.get('/api/salaries', auth, salary.getAllSalaries);
app.post('/api/salaries', auth, salary.addSalary);
app.put('/api/salaries/:id', auth, salary.updateSalary);
app.delete('/api/salaries/:id', auth, salary.deleteSalary);

// ============ REPORT ROUTES ============
app.get('/api/reports/payroll', auth, report.getPayrollReport);
app.get('/api/reports/payroll/:month', auth, report.getPayrollByMonth);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});