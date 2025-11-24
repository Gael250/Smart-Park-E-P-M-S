const mongoose = require('mongoose');

const connectDB = () => {
  // Replace <db_password> with your ACTUAL password
  mongoose.connect('mongodb+srv://gaeluwizera_db_user:root@cluster0.lqewrgq.mongodb.net/payroll?retryWrites=true&w=majority')
    .then(() => console.log('✅ MongoDB Atlas Connected'))
    .catch(err => console.log('❌ Error:', err.message));
};

module.exports = connectDB;