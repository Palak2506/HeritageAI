// src/ThemeContext.jsx

import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // 1. Initialize state by checking local storage for previous preference, default to 'dark'
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('appTheme') || 'dark';
    });

    // 2. Effect to apply the theme class to the document body and save preference
    useEffect(() => {
        // Apply the CSS class needed for the styles to switch
        document.body.className = theme === 'dark' ? 'theme-dark' : 'theme-light';
        
        // Save the current theme preference
        localStorage.setItem('appTheme', theme);
    }, [theme]); // Reruns whenever 'theme' changes

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const isDark = theme === 'dark';

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};