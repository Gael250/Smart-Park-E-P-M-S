import React, { useState } from 'react';
import api from './api';
import { styles } from './styles';

function Login({ onLogin, onRegisterClick }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/login', { username, password });
      onLogin();
    } catch (err) {
      alert('Wrong username or password');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.box}>
        <h2 className={styles.title}>SmartPark EPMS</h2>
        <p className={styles.subtitle}>Employee Payroll Management System</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>
        
        <p className={styles.link} onClick={onRegisterClick}>
          Create new account
        </p>
        
        <p className={styles.footer}>
          SmartPark - Rubavu District, Rwanda
        </p>
      </div>
    </div>
  );
}

export default Login;