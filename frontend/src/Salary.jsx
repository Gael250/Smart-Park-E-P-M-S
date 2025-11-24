import React, { useState, useEffect } from 'react';
import api from './api';

function Salary() {
  const [formData, setFormData] = useState({
    employeeNumber: '',
    grossSalary: '',
    totalDeduction: '',
    month: '',
  });
  
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showPayroll, setShowPayroll] = useState(false);
  const [payrollMonth, setPayrollMonth] = useState('');
  const [payrollData, setPayrollData] = useState([]);

  // Load data when component starts
  useEffect(() => {
    loadData();
  }, []);

  // Function to load salaries and employees
  const loadData = async () => {
    try {
      const salaryResponse = await api.get('/salaries');
      const employeeResponse = await api.get('/employees');
      setSalaries(salaryResponse.data || []);
      setEmployees(employeeResponse.data || []);
    } catch (error) {
      console.log('Error loading data');
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Add new salary
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/salaries', {
        employeeNumber: formData.employeeNumber,
        grossSalary: Number(formData.grossSalary),
        totalDeduction: Number(formData.totalDeduction),
        month: formData.month
      });
      alert('Salary added successfully!');
      setFormData({ employeeNumber: '', grossSalary: '', totalDeduction: '', month: '' });
      loadData();
    } catch (error) {
      alert('Error adding salary');
    }
  };

  // Delete salary
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      try {
        await api.delete(`/salaries/${id}`);
        loadData();
      } catch (error) {
        alert('Error deleting');
      }
    }
  };

  // Generate monthly payroll
  const generatePayroll = () => {
    if (!payrollMonth) {
      alert('Please select a month');
      return;
    }

    // Filter salaries for selected month
    const monthSalaries = salaries.filter(s => s.month === payrollMonth);
    
    // Create payroll with employee details
    const payroll = monthSalaries.map(salary => {
      const employee = employees.find(emp => emp.employeeNumber === salary.employeeNumber);
      return {
        firstName: employee?.firstName || 'N/A',
        lastName: employee?.lastName || 'N/A',
        position: employee?.position || 'N/A',
        department: employee?.departmentCode || 'N/A',
        netSalary: salary.netSalary
      };
    });

    setPayrollData(payroll);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Salary Management</h1>

      {/* Navigation Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setShowPayroll(false)}
          className={`px-4 py-2 rounded ${!showPayroll ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Manage Salaries
        </button>
        <button
          onClick={() => setShowPayroll(true)}
          className={`px-4 py-2 rounded ${showPayroll ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Monthly Payroll
        </button>
      </div>

      {!showPayroll ? (
        <div className="grid grid-cols-2 gap-6">
          {/* Add Salary Form */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Add Salary</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Employee</label>
                <select
                  name="employeeNumber"
                  value={formData.employeeNumber}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp.employeeNumber}>
                      {emp.employeeNumber} - {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Gross Salary (RWF)</label>
                <input
                  type="number"
                  name="grossSalary"
                  value={formData.grossSalary}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Total Deduction (RWF)</label>
                <input
                  type="number"
                  name="totalDeduction"
                  value={formData.totalDeduction}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Month</label>
                <input
                  type="month"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Add Salary
              </button>
            </form>
          </div>

          {/* Salary List */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Salary Records</h2>
            <div className="space-y-2">
              {salaries.map(salary => (
                <div key={salary._id} className="border p-3 rounded">
                  <p><strong>Employee:</strong> {salary.employeeNumber}</p>
                  <p><strong>Month:</strong> {salary.month}</p>
                  <p><strong>Gross:</strong> {salary.grossSalary} RWF</p>
                  <p><strong>Deduction:</strong> {salary.totalDeduction} RWF</p>
                  <p><strong>Net:</strong> {salary.netSalary} RWF</p>
                  <button
                    onClick={() => handleDelete(salary._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded mt-2"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Monthly Payroll Section */
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Generate Monthly Payroll</h2>
          
          <div className="flex gap-4 mb-6">
            <input
              type="month"
              value={payrollMonth}
              onChange={(e) => setPayrollMonth(e.target.value)}
              className="border p-2 rounded"
            />
            <button
              onClick={generatePayroll}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Generate
            </button>
          </div>

          {/* Payroll Table */}
          {payrollData.length > 0 && (
            <div>
              <h3 className="font-bold mb-2">Payroll for {payrollMonth}</h3>
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2 text-left">First Name</th>
                    <th className="border p-2 text-left">Last Name</th>
                    <th className="border p-2 text-left">Position</th>
                    <th className="border p-2 text-left">Department</th>
                    <th className="border p-2 text-right">Net Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollData.map((item, index) => (
                    <tr key={index}>
                      <td className="border p-2">{item.firstName}</td>
                      <td className="border p-2">{item.lastName}</td>
                      <td className="border p-2">{item.position}</td>
                      <td className="border p-2">{item.department}</td>
                      <td className="border p-2 text-right">{item.netSalary} RWF</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Salary;