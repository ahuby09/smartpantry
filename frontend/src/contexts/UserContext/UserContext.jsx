// src/contexts/UserContext.jsx
import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:3001/api/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(async res => {
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    })
    .then(data => {
      if (data) setProfile(data);
    })
    .catch(err => {
      console.error('Profile fetch error:', err);
      navigate('/login');
    });
  }, [navigate]);

  return (
    <UserContext.Provider value={profile}>
      {children}
    </UserContext.Provider>
  );
};
