import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateAdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to='/' />;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role !== 'admin') return <Navigate to='/' />;
    return children;
  } catch (err) {
    return <Navigate to='/' />;
  }
};

export default PrivateAdminRoute;