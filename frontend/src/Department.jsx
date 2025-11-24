import React, { useState, useEffect } from 'react';
import api from './api';

function Department() {
  const initialForm = { departmentCode: '', departmentName: '', grossSalary: '' };

  const [formData, setFormData] = useState(initialForm);
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }
  const [loading, setLoading] = useState(false);

  const getError = (e) => e.response?.data?.message || e.message || 'Something went wrong';

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data || []);
    } catch (e) {
      console.error('Error fetching departments:', getError(e));
    }
  };

  const handleChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await api.post('/departments', formData);
      setMessage({ type: 'success', text: 'Department added successfully!' });
      setFormData(initialForm);
      fetchDepartments();
    } catch (e) {
      setMessage({ type: 'error', text: getError(e) });
    } finally {
      setLoading(false);
    }
  };

  const initializeDepartments = async () => {
    if (!window.confirm('This will replace all existing departments with default data. Continue?')) return;
    try {
      await api.post('/departments/init');
      setMessage({ type: 'success', text: 'Departments initialized successfully!' });
      fetchDepartments();
    } catch (e) {
      setMessage({ type: 'error', text: getError(e) });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Department Management</h1>
        <p className="text-gray-600 mt-2">Manage departments and their gross salaries</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Add Department</h2>

            {message && (
              <div
                className={`mb-4 p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Code *</label>
                <input
                  type="text"
                  name="departmentCode"
                  value={formData.departmentCode}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="CW"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Name *</label>
                <input
                  type="text"
                  name="departmentName"
                  value={formData.departmentName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Carwash"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gross Salary (RWF) *</label>
                <input
                  type="number"
                  name="grossSalary"
                  value={formData.grossSalary}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="300000"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Department'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={initializeDepartments}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
              >
                Initialize Default Departments
              </button>
              <p className="text-xs text-gray-500 mt-2">This will create CW, ST, MC, and ADMS departments</p>
            </div>
          </div>
        </div>

        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Department List</h2>

            {departments.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="text-gray-500 mt-4">No departments found</p>
                <p className="text-sm text-gray-400 mt-2">Add a department or initialize default ones</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departments.map((dept) => (
                  <div key={dept._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
                    <div className="flex items-center">
                      <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 font-semibold">
                        {dept.departmentCode}
                      </span>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-800">{dept.departmentName}</h3>
                        <p className="text-sm text-gray-500">Code: {dept.departmentCode}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Gross Salary:</span>
                        <span className="text-lg font-bold text-green-600">
                          {Number(dept.grossSalary).toLocaleString()} RWF
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Department;