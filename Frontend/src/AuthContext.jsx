// src/AuthContext.jsx (Verify this structure)

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // --- CRITICAL: Ensure you are reading from sessionStorage here ---
        const storedToken = sessionStorage.getItem('userToken'); 
        
        // If you had a token saved previously in localStorage, this check might 
        // find it. Let's explicitly clear any old localStorage token just in case.
        localStorage.removeItem('userToken');

        if (storedToken) {
            // Token found in sessionStorage, keep user logged in for this session
            setUser({ id: '123', email: 'user@example.com' }); 
        }
        setIsLoading(false);
    }, []); // Empty dependency array ensures this runs once on mount

    const login = (token, userData) => {
        // Write to sessionStorage
        sessionStorage.setItem('userToken', token);
        setUser(userData);
    };

    const logout = () => {
        // Remove from sessionStorage
        sessionStorage.removeItem('userToken');
        setUser(null);
    };

    const contextValue = {
        user,
        isLoading,
        login,
        logout,
        isLoggedIn: !!user,
    };

    if (isLoading) {
        return <div>Loading user session...</div>;
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};