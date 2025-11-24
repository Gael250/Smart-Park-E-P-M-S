import React, { useState, useEffect } from 'react';
import api from './api';

function Dashboard({ onLogout }) {
  // Get page from URL or default to 'home'
  const getPageFromUrl = () => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  };

  const [page, setPage] = useState(getPageFromUrl());
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [salaryMonth, setSalaryMonth] = useState('');
  const [payrollMonth, setPayrollMonth] = useState('');
  const [payrollData, setPayrollData] = useState([]);

  const departmentSalaries = {
    'CW': { name: 'Carwash', grossSalary: 300000, totalDeduction: 20000, netSalary: 280000 },
    'ST': { name: 'Stock', grossSalary: 200000, totalDeduction: 5000, netSalary: 195000 },
    'MC': { name: 'Mechanic', grossSalary: 450000, totalDeduction: 40000, netSalary: 410000 },
    'ADMS': { name: 'Administration', grossSalary: 600000, totalDeduction: 70000, netSalary: 530000 }
  };

  // Handle URL changes
  useEffect(() => {
    const handleHashChange = () => {
      setPage(getPageFromUrl());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Load data when page changes
  useEffect(() => {
    if (page === 'departments') loadData('/departments');
    if (page === 'employees') loadData('/employees');
    if (page === 'salaries') {
      loadSalaries();
      loadEmployees();
    }
    if (page === 'reports') loadData('/reports/payroll');
  }, [page]);

  // Change page and update URL
  const changePage = (newPage) => {
    window.location.hash = newPage;
    setPage(newPage);
  };

  const loadData = async (url) => {
    try {
      const res = await api.get(url);
      setData(res.data);
    } catch (err) {
      console.log('Error loading data');
    }
  };

  const loadSalaries = async () => {
    try {
      const res = await api.get('/salaries');
      setSalaries(res.data);
    } catch (err) {
      console.log('Error loading salaries');
    }
  };

  const loadEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (err) {
      console.log('Error loading employees');
    }
  };

  const handleSubmit = async (e, url) => {
    e.preventDefault();
    try {
      await api.post(url, formData);
      alert('Added successfully!');
      setFormData({});
      loadData(url);
    } catch (err) {
      alert('Error adding data');
    }
  };

  const handleEmployeeSelect = (e) => {
    const empNumber = e.target.value;
    const employee = employees.find(emp => emp.employeeNumber === empNumber);
    setSelectedEmployee(employee);
  };

  const getNetSalary = () => {
    if (!selectedEmployee) return 0;
    const deptCode = selectedEmployee.departmentCode;
    return departmentSalaries[deptCode]?.netSalary || 0;
  };

  const handleSalarySubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee || !salaryMonth) {
      alert('Please select employee and month');
      return;
    }

    const netSalary = getNetSalary();
    const deptInfo = departmentSalaries[selectedEmployee.departmentCode];

    try {
      await api.post('/salaries', {
        employeeNumber: selectedEmployee.employeeNumber,
        firstName: selectedEmployee.firstName,
        lastName: selectedEmployee.lastName,
        position: selectedEmployee.position,
        department: selectedEmployee.departmentCode,
        grossSalary: deptInfo?.grossSalary || 0,
        totalDeduction: deptInfo?.totalDeduction || 0,
        netSalary: netSalary,
        month: salaryMonth
      });
      alert('Salary added successfully!');
      setSelectedEmployee(null);
      setSalaryMonth('');
      loadSalaries();
    } catch (err) {
      alert('Error adding salary');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      try {
        await api.delete(`/salaries/${id}`);
        loadSalaries();
      } catch (err) {
        alert('Error deleting');
      }
    }
  };

  const generatePayroll = () => {
    if (!payrollMonth) {
      alert('Please select a month');
      return;
    }

    const monthSalaries = salaries.filter(s => s.month === payrollMonth);
    const payroll = monthSalaries.map(salary => {
      const employee = employees.find(emp => emp.employeeNumber === salary.employeeNumber);
      return {
        firstName: salary.firstName || employee?.firstName || 'N/A',
        lastName: salary.lastName || employee?.lastName || 'N/A',
        position: salary.position || employee?.position || 'N/A',
        department: salary.department || employee?.departmentCode || 'N/A',
        netSalary: salary.netSalary
      };
    });

    setPayrollData(payroll);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <div className="bg-black bg-opacity-80 text-white p-6 shadow-2xl border-b border-gray-700">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">SmartPark EPMS - Rubavu District</h1>
          <button 
            onClick={() => api.post('/auth/logout').then(onLogout)} 
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition duration-300 shadow-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Menu */}
      <div className="bg-black bg-opacity-60 backdrop-blur-sm p-4 border-b border-gray-700">
        <div className="flex gap-3">
          {['home', 'employees', 'departments', 'salaries', 'reports'].map(item => (
            <button
              key={item}
              onClick={() => changePage(item)}
              className={`px-6 py-2 rounded-lg font-semibold transition duration-300 ${
                page === item 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
              }`}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Home */}
        {page === 'home' && (
          <div className="bg-black bg-opacity-80 p-8 rounded-xl shadow-2xl border border-gray-700">
            <h2 className="text-3xl font-bold mb-4 text-white">Welcome to Employee Payroll Management System</h2>
            <p className="text-gray-300 text-lg">Manage employees, departments, salaries and generate reports.</p>
          </div>
        )}

        {/* Employees */}
        {page === 'employees' && (
          <div className="bg-black bg-opacity-80 p-6 rounded-xl shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-white">Employee Management</h2>
            
            {/* Employee Form */}
            <form onSubmit={(e) => handleSubmit(e, '/employees')} className="bg-gray-800 bg-opacity-50 p-6 rounded-lg mb-6 border border-gray-600">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2 font-semibold text-gray-300">First Name</label>
                  <input className="w-full border border-gray-600 p-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-300">Last Name</label>
                  <input className="w-full border border-gray-600 p-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, lastName: e.target.value})} required />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-300">Position</label>
                  <input className="w-full border border-gray-600 p-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, position: e.target.value})} required />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-300">Address</label>
                  <input className="w-full border border-gray-600 p-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, address: e.target.value})} required />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-300">Telephone</label>
                  <input className="w-full border border-gray-600 p-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, telephone: e.target.value})} required />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-300">Gender</label>
                  <select className="w-full border border-gray-600 p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, gender: e.target.value})} required>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-300">Hired Date</label>
                  <input type="date" className="w-full border border-gray-600 p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, hiredDate: e.target.value})} required />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-300">Department</label>
                  <select className="w-full border border-gray-600 p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, departmentCode: e.target.value})} required>
                    <option value="">Select</option>
                    <option value="CW">Carwash</option>
                    <option value="ST">Stock</option>
                    <option value="MC">Mechanic</option>
                    <option value="ADMS">Administration</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-300 shadow-lg">
                Add Employee
              </button>
            </form>
            
            {/* Employee Table */}
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-800 text-white border-b border-gray-600">
                  <tr>
                    <th className="p-3 text-left">Employee #</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Position</th>
                    <th className="p-3 text-left">Department</th>
                    <th className="p-3 text-left">Gender</th>
                    <th className="p-3 text-left">Telephone</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 bg-opacity-50">
                  {data.map(emp => (
                    <tr key={emp._id} className="border-b border-gray-700 hover:bg-gray-800 hover:bg-opacity-50 transition duration-200">
                      <td className="p-3 text-gray-300">{emp.employeeNumber}</td>
                      <td className="p-3 text-gray-300">{emp.firstName} {emp.lastName}</td>
                      <td className="p-3 text-gray-300">{emp.position}</td>
                      <td className="p-3 text-gray-300">{emp.departmentCode}</td>
                      <td className="p-3 text-gray-300">{emp.gender}</td>
                      <td className="p-3 text-gray-300">{emp.telephone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Departments */}
        {page === 'departments' && (
          <div className="bg-black bg-opacity-80 p-6 rounded-xl shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-white">Department Management</h2>
            <button 
              onClick={() => api.post('/departments/init').then(() => loadData('/departments'))} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg mb-6 font-semibold transition duration-300 shadow-lg"
            >
              Initialize Departments
            </button>
            
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-800 text-white border-b border-gray-600">
                  <tr>
                    <th className="p-3 text-left">Code</th>
                    <th className="p-3 text-left">Department Name</th>
                    <th className="p-3 text-left">Gross Salary</th>
                    <th className="p-3 text-left">Total Deduction</th>
                    <th className="p-3 text-left">Net Salary</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 bg-opacity-50">
                  <tr className="border-b border-gray-700 hover:bg-gray-800 hover:bg-opacity-50 transition duration-200">
                    <td className="p-3 font-semibold text-blue-400">CW</td>
                    <td className="p-3 text-gray-300">Carwash</td>
                    <td className="p-3 text-right text-gray-300">300,000 RWF</td>
                    <td className="p-3 text-right text-red-400">20,000 RWF</td>
                    <td className="p-3 text-right font-bold text-green-400">280,000 RWF</td>
                  </tr>
                  <tr className="border-b border-gray-700 hover:bg-gray-800 hover:bg-opacity-50 transition duration-200">
                    <td className="p-3 font-semibold text-blue-400">ST</td>
                    <td className="p-3 text-gray-300">Stock</td>
                    <td className="p-3 text-right text-gray-300">200,000 RWF</td>
                    <td className="p-3 text-right text-red-400">5,000 RWF</td>
                    <td className="p-3 text-right font-bold text-green-400">195,000 RWF</td>
                  </tr>
                  <tr className="border-b border-gray-700 hover:bg-gray-800 hover:bg-opacity-50 transition duration-200">
                    <td className="p-3 font-semibold text-blue-400">MC</td>
                    <td className="p-3 text-gray-300">Mechanic</td>
                    <td className="p-3 text-right text-gray-300">450,000 RWF</td>
                    <td className="p-3 text-right text-red-400">40,000 RWF</td>
                    <td className="p-3 text-right font-bold text-green-400">410,000 RWF</td>
                  </tr>
                  <tr className="border-b border-gray-700 hover:bg-gray-800 hover:bg-opacity-50 transition duration-200">
                    <td className="p-3 font-semibold text-blue-400">ADMS</td>
                    <td className="p-3 text-gray-300">Administration Staff</td>
                    <td className="p-3 text-right text-gray-300">600,000 RWF</td>
                    <td className="p-3 text-right text-red-400">70,000 RWF</td>
                    <td className="p-3 text-right font-bold text-green-400">530,000 RWF</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Salaries */}
        {page === 'salaries' && (
          <div className="bg-black bg-opacity-80 p-6 rounded-xl shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-white">Salary Management</h2>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Add Salary Form */}
              <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg border border-gray-600">
                <h3 className="text-xl font-bold mb-4 text-white">Add Salary</h3>
                <form onSubmit={handleSalarySubmit}>
                  <div className="mb-4">
                    <label className="block mb-2 font-semibold text-gray-300">Select Employee</label>
                    <select
                      className="w-full border border-gray-600 p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      onChange={handleEmployeeSelect}
                      value={selectedEmployee?.employeeNumber || ''}
                      required
                    >
                      <option value="">Choose Employee</option>
                      {employees.map(emp => (
                        <option key={emp._id} value={emp.employeeNumber}>
                          {emp.employeeNumber} - {emp.firstName} {emp.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedEmployee && (
                    <>
                      <div className="mb-4 p-4 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-500">
                        <p className="mb-2 text-gray-300"><strong>First Name:</strong> {selectedEmployee.firstName}</p>
                        <p className="mb-2 text-gray-300"><strong>Last Name:</strong> {selectedEmployee.lastName}</p>
                        <p className="mb-2 text-gray-300"><strong>Position:</strong> {selectedEmployee.position}</p>
                        <p className="mb-2 text-gray-300"><strong>Department:</strong> {selectedEmployee.departmentCode}</p>
                        <p className="mb-2 text-gray-300"><strong>Net Salary:</strong> <span className="text-green-400 font-bold text-lg">{getNetSalary().toLocaleString()} RWF</span></p>
                      </div>

                      <div className="mb-4">
                        <label className="block mb-2 font-semibold text-gray-300">Month</label>
                        <input
                          type="month"
                          className="w-full border border-gray-600 p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                          value={salaryMonth}
                          onChange={(e) => setSalaryMonth(e.target.value)}
                          required
                        />
                      </div>

                      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg w-full font-semibold transition duration-300 shadow-lg">
                        Add Salary
                      </button>
                    </>
                  )}
                </form>
              </div>

              {/* Generate Monthly Payroll */}
              <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg border border-gray-600">
                <h3 className="text-xl font-bold mb-4 text-white">Generate Monthly Payroll</h3>
                
                <div className="mb-4">
                  <label className="block mb-2 font-semibold text-gray-300">Select Month</label>
                  <input
                    type="month"
                    value={payrollMonth}
                    onChange={(e) => setPayrollMonth(e.target.value)}
                    className="w-full border border-gray-600 p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={generatePayroll}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full mb-4 font-semibold transition duration-300 shadow-lg"
                >
                  Generate Payroll
                </button>

                {/* Payroll Table */}
                {payrollData.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-bold mb-3 text-white">Payroll for {payrollMonth}</h4>
                    <div className="max-h-96 overflow-y-auto rounded-lg">
                      <table className="w-full">
                        <thead className="bg-gray-800 text-white border-b border-gray-600">
                          <tr>
                            <th className="p-2 text-left text-sm">First Name</th>
                            <th className="p-2 text-left text-sm">Last Name</th>
                            <th className="p-2 text-left text-sm">Position</th>
                            <th className="p-2 text-left text-sm">Department</th>
                            <th className="p-2 text-right text-sm">Net Salary</th>
                          </tr>
                        </thead>
                        <tbody className="bg-gray-900 bg-opacity-50">
                          {payrollData.map((item, index) => (
                            <tr key={index} className="border-b border-gray-700 hover:bg-gray-800 hover:bg-opacity-50 transition duration-200">
                              <td className="p-2 text-sm text-gray-300">{item.firstName}</td>
                              <td className="p-2 text-sm text-gray-300">{item.lastName}</td>
                              <td className="p-2 text-sm text-gray-300">{item.position}</td>
                              <td className="p-2 text-sm text-gray-300">{item.department}</td>
                              <td className="p-2 text-right text-sm font-bold text-green-400">{item.netSalary} RWF</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {payrollData.length === 0 && payrollMonth && (
                  <p className="text-gray-400 text-sm text-center mt-4">No payroll data found for the selected month.</p>
                )}
              </div>
            </div>

            {/* Salary Records List */}
            <div className="mt-6 bg-gray-800 bg-opacity-50 p-6 rounded-lg border border-gray-600">
              <h3 className="text-xl font-bold mb-4 text-white">All Salary Records</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {salaries.map(salary => (
                  <div key={salary._id} className="border border-gray-600 p-4 rounded-lg bg-gray-900 bg-opacity-50 hover:bg-opacity-70 transition duration-300">
                    <p className="mb-1 text-gray-300"><strong>Name:</strong> {salary.firstName} {salary.lastName}</p>
                    <p className="mb-1 text-gray-300"><strong>Position:</strong> {salary.position}</p>
                    <p className="mb-1 text-gray-300"><strong>Department:</strong> {salary.department}</p>
                    <p className="mb-1 text-gray-300"><strong>Net Salary:</strong> <span className="text-green-400 font-bold">{salary.netSalary} RWF</span></p>
                    <p className="mb-3 text-gray-300"><strong>Month:</strong> {salary.month}</p>
                    <button
                      onClick={() => handleDelete(salary._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full font-semibold transition duration-300 shadow-lg"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reports */}
        {page === 'reports' && (
          <div className="bg-black bg-opacity-80 p-6 rounded-xl shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-white">Monthly Payroll Report</h2>
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-800 text-white border-b border-gray-600">
                  <tr>
                    <th className="p-3 text-left">First Name</th>
                    <th className="p-3 text-left">Last Name</th>
                    <th className="p-3 text-left">Position</th>
                    <th className="p-3 text-left">Department</th>
                    <th className="p-3 text-right">Net Salary</th>
                    <th className="p-3 text-left">Month</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 bg-opacity-50">
                  {data.map((item, i) => (
                    <tr key={i} className="border-b border-gray-700 hover:bg-gray-800 hover:bg-opacity-50 transition duration-200">
                      <td className="p-3 text-gray-300">{item.firstName}</td>
                      <td className="p-3 text-gray-300">{item.lastName}</td>
                      <td className="p-3 text-gray-300">{item.position}</td>
                      <td className="p-3 text-gray-300">{item.department}</td>
                      <td className="p-3 text-right font-bold text-green-400">{item.netSalary} RWF</td>
                      <td className="p-3 text-gray-300">{item.month}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;