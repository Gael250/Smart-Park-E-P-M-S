const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

const register = async (req, res) => {
  const { username, password } = req.body;
  
 
  const existingUser = await User.findOne({ username: username });
  
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Save new user
  const newUser = new User({
    username: username,
    password: hashedPassword
  });
  
  await newUser.save();
  res.json({ message: 'User created' });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  
  // Find user by username
  const user = await User.findOne({ username: username });
  
  // If user not found
  if (!user) {
    return res.status(401).json({ message: 'Wrong username or password' });
  }
  
  // Check if password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  
  
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: 'Wrong username or password' });
  }
  
  // If everything correct, login success
  req.session.userId = user._id;
  res.json({ message: 'Login successful' });
};


const logout = (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
};

module.exports = { register, login, logout };