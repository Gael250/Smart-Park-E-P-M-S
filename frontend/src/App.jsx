import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  if (isLoggedIn) {
    return <Dashboard onLogout={() => setIsLoggedIn(false)} />;
  }

  if (showRegister) {
    return <Register onRegisterSuccess={() => setShowRegister(false)} />;
  }

  return (
    <Login 
      onLogin={() => setIsLoggedIn(true)} 
      onRegisterClick={() => setShowRegister(true)}
    />
  );
}

export default App;