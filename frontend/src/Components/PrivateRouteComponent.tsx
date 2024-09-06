import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

export const PrivateRoute: React.FC = () => {
    const isAuthenticated: boolean = true; // turn this to false so we can hide private routes
    return isAuthenticated ? <Outlet /> : <Navigate to="/form"/>;
};
