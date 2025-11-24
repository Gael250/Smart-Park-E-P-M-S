import React, { useState, useEffect } from 'react';
import api from './api';

function Employee() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    position: '',
    address: '',
    telephone: '',
    gender: '',
    hiredDate: '',
    departmentCode: ''
    
  });

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const empData = await api.get('/employees');
    const deptData = await api.get('/departments');
    setEmployees(empData.data);
    setDepartments(deptData.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/employees', form);
    alert('Employee added!');
    
    setForm({
      firstName: '',
      lastName: '',
      position: '',
      address: '',
      telephone: '',
      gender: '',
      hiredDate: '',
      departmentCode: ''
    });
    
    loadData();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Employee Management</h1>

      <div style={{ backgroundColor: 'white', padding: '20px', marginBottom: '20px' }}>
        <h2>Add Employee</h2>
        <p style={{ color: 'blue' }}>✨ Employee number is automatic</p>

        <form onSubmit={handleSubmit}>
         

          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', margin: '5px 0' }}
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', margin: '5px 0' }}
          />

          <input
            type="text"
            name="position"
            placeholder="Position"
            value={form.position}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', margin: '5px 0' }}
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', margin: '5px 0' }}
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <input
            type="tel"
            name="telephone"
            placeholder="Phone Number"
            value={form.telephone}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', margin: '5px 0' }}
          />

          <input
            type="date"
            name="hiredDate"
            value={form.hiredDate}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', margin: '5px 0' }}
          />

          <select
            name="departmentCode"
            value={form.departmentCode}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', margin: '5px 0' }}
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.departmentCode} value={d.departmentCode}>
                {d.departmentName}
              </option>
            ))}
          </select>

          <textarea
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
            rows="3"
            style={{ width: '100%', padding: '10px', margin: '5px 0' }}
          />

          <button type="submit" style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer'
          }}>
            Add Employee
          </button>
        </form>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px' }}>
        <h2>All Employees</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Number</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Position</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Department</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Phone</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e._id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{e.employeeNumber}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{e.firstName} {e.lastName}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{e.position}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{e.departmentCode}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{e.telephone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Employee;