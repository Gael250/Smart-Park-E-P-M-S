# SmartPark Employee Payroll Management System (EPMS)

## Project Overview
**SmartPark** is a company located in Rubavu District, Western Province of Rwanda. It provides multiple car-related services and has been facing inefficiencies due to its manual, paper-based system for managing parking space sales and employee payroll.  

The Human Resource department keeps records of employee details, including:  

- Employee Number  
- First Name  
- Last Name  
- Address  
- Position  
- Telephone  
- Gender  
- Hired Date  
- Department Details (Department Code and Department Name)  

Payroll is manually calculated with the following information:

- Gross Salary  
- Total Deduction  
- Net Salary  
- Month of Payment  

The manual system is slow, prone to errors, and makes it difficult to track employee payments and generate monthly reports efficiently.  

To address these challenges, this project implements a **web-based application** that handles the payroll process, allowing HR to record employee details digitally and generate reports automatically.

---

## Features

1. **Employee Management**
   - Add new employees with personal and department details.
   - Edit and delete employee records.
   - Store employee information securely in the database.

2. **Department Management**
   - Maintain department records with codes, names, and gross salary details.
   - Use department data to calculate payroll automatically.

3. **Salary Management**
   - Automatically generate payroll records including Gross Salary, Total Deduction, Net Salary, and Month of Payment.
   - Perform CRUD operations (Create, Read, Update, Delete) on salary data.

4. **Reports**
   - Generate monthly payroll reports with employee details, department, and net salary.
   - Export or view reports for auditing and HR purposes.

5. **Authentication**
   - Session-based login system with username and password to secure access.

6. **Responsive UI**
   - Built with React.js and Tailwind CSS for a modern, responsive design.

7. **Backend**
   - Node.js and Express.js runtime environment.
   - Communicates with MySQL/MongoDB for CRUD operations.
   - Axios integration for frontend-backend communication.

---

