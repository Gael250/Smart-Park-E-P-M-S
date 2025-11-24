import React, { useState } from 'react';
import api from './api';
import { styles } from './styles';

function Register({ onRegisterSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { username, password });
      alert('Account created! Please login.');
      onRegisterSuccess();
    } catch (err) {
      alert('Username already exists');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.box}>
        <h2 className={styles.title}>SmartPark EPMS</h2>
        <p className={styles.subtitle}>Create New Account</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Choose username"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Choose password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className={styles.button}>
            Create Account
          </button>
        </form>
        
        <p className={styles.link} onClick={onRegisterSuccess}>
          Back to Login
        </p>
        
        <p className={styles.footer}>
          SmartPark - Rubavu District, Rwanda
        </p>
      </div>
    </div>
  );
}

export default Register;