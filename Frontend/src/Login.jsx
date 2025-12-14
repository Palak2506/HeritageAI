// src/Login.jsx (Full Implementation)

import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext'; // To get the login function
import { useNavigate } from 'react-router-dom'; // To redirect after login

function Login() {
    // 1. State for form inputs and status
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 2. Context and Router hooks
    const { login } = useContext(AuthContext); // Get the global login function
    const navigate = useNavigate();

    // Ensure this URL matches your backend setup (e.g., http://localhost:8080)
    const LOGIN_URL = 'http://localhost:8080/api/auth/login'; 

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setError('');
        setLoading(true);

        try {
            // 3. API Call to your Node.js backend
            const response = await fetch(LOGIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // 4. Success: Use the global login function
                login(data.token, data.user); 
                
                // 5. Redirect to the protected chat page (which is the root path "/")
                navigate('/'); 
            } else {
                // 6. Failure: Display error message from backend
                setError(data.msg || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error('Login API error:', err);
            setError('Could not connect to the server. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container app" style={loginStyles.container}>
            <h1 style={loginStyles.pageTitle}>HeritageAI</h1>
            
            <form onSubmit={handleSubmit} style={loginStyles.form}>
                <h2 style={loginStyles.heading}>Sign In</h2>
                
                {error && <p style={loginStyles.error}>{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={loginStyles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={loginStyles.input}
                />
                
                <button type="submit" disabled={loading} style={loginStyles.button}>
                    {loading ? 'Logging In...' : 'Login'}
                </button>

                {/* Optional: Add a link to the registration page */}
                <p style={loginStyles.registerText}>
                    Don't have an account? <a href="/register" style={loginStyles.link}>Register here</a>
                </p>
            </form>
        </div>
    );
}

export default Login;

// --- Minimal inline styles (use your own CSS file for proper styling) ---
const loginStyles = {
    container: {        
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        // backgroundColor: '#1e1e1e', 
    },

    pageTitle: { 
        color: '#ffffff',
        marginBottom: '20px', 
        textAlign: 'center',
        fontSize: '48px', 
        fontWeight: '900', 
        textShadow: '0 0 10px rgba(0, 0, 0, 0.8)', 
    },

    form: {
        display: 'flex',
        flexDirection: 'column',
        padding: '40px',
        borderRadius: '8px',
        backgroundColor: 'rgba(40, 40, 40, 0.9)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        width: '350px',
    },
    heading: {
        color: '#ffffff',
        marginBottom: '20px',
        textAlign: 'center',
    },
    input: {
        padding: '12px',
        margin: '10px 0',
        borderRadius: '4px',
        border: '1px solid #444',
        backgroundColor: '#383838',
        color: '#ffffff',
        fontSize: '16px',
        textAlign:"center"
    },
    button: {
        padding: '12px',
        marginTop: '20px',
        backgroundColor: '#1a73e8',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s',
         display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    error: {
        color: '#ff4d4d',
        textAlign: 'center',
        marginBottom: '10px',
        fontSize: '14px',
    },
    registerText: {
        color: '#aaaaaa',
        marginTop: '15px',
        textAlign: 'center',
        fontSize: '14px',
    },
    link: {
        color: '#1a73e8',
        textDecoration: 'none',
    }
};