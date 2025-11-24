import React, { useState, useEffect, useMemo } from 'react';
import api from './api';

function Reports() {
  const [reports, setReports] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getError = (e) => e.response?.data?.message || e.message || 'Something went wrong';

  useEffect(() => {
    const fetchAllReports = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/reports/payroll');
        setReports(res.data || []);
      } catch (e) {
        setError('Error fetching reports. Please try again.');
        console.error('Error fetching reports:', getError(e));
      } finally {
        setLoading(false);
      }
    };
    fetchAllReports();
  }, []);

  const filteredReports = useMemo(() => {
    if (!selectedMonth) return reports;
    return reports.filter((r) => r.month === selectedMonth);
  }, [reports, selectedMonth]);

  const totalNetSalary = useMemo(
    () => filteredReports.reduce((sum, r) => sum + (Number(r.netSalary) || 0), 0),
    [filteredReports]
  );

  const handleMonthChange = (e) => setSelectedMonth(e.target.value);

  const exportToCSV = () => {
    if (filteredReports.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['First Name', 'Last Name', 'Position', 'Department', 'Net Salary', 'Month'];
    const rows = filteredReports.map((r) => [
      r.firstName,
      r.lastName,
      r.position,
      r.department,
      r.netSalary,
      r.month,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll_report_${selectedMonth || 'all'}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const printReport = () => window.print();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Monthly Payroll Reports</h1>
        <p className="text-gray-600 mt-2">View and export employee payroll information</p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Month</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSelectedMonth('')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition duration-200"
            >
              Clear Filter
            </button>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition duration-200 flex items-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
            <button
              onClick={printReport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200 flex items-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
          </div>
        </div>
      </div>

     
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded print:hidden">
          <p className="text-red-700">{error}</p>
        </div>
      )}

     
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      
      {!loading && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-blue-100 text-sm">Total Employees</p>
                <p className="text-3xl font-bold">{filteredReports.length}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Period</p>
                <p className="text-3xl font-bold">{selectedMonth || 'All Months'}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Total Net Salary</p>
                <p className="text-3xl font-bold">{totalNetSalary.toLocaleString()} RWF</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredReports.length === 0 ? (
              <div className="text-center py-12 print:hidden">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 mt-4">No payroll data available</p>
                <p className="text-sm text-gray-400 mt-2">Add salary records to generate reports</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Salary
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((r, i) => (
                    <tr key={`${r.employeeNumber || i}-${r.month}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{i + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {r.firstName} {r.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.position}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {r.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-green-600">
                        {Number(r.netSalary).toLocaleString()} RWF
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                      Total Net Salary:
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-green-600">
                      {totalNetSalary.toLocaleString()} RWF
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;