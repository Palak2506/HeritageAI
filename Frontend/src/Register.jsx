// src/Register.jsx (Full Implementation)

import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext'; // To handle automatic login after registration
import { useNavigate } from 'react-router-dom';

function Register() {
    // 1. State for form inputs and status
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // 2. Context and Router hooks
    const { login } = useContext(AuthContext); // Use login to instantly log in the new user
    const navigate = useNavigate();

    // Ensure this URL matches your backend setup
    const REGISTER_URL = 'http://localhost:8080/api/auth/register'; 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            // 3. API Call to your Node.js backend
            const response = await fetch(REGISTER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // 4. Success: Automatically log in the user
                login(data.token, data.user); 
                setSuccess(true);
                
                // 5. Redirect to the protected chat page after a small delay
                setTimeout(() => {
                    navigate('/'); 
                }, 1000); 
            } else {
                // 6. Failure: Display error message (e.g., User already exists)
                setError(data.msg || 'Registration failed. Please try a different email.');
            }
        } catch (err) {
            console.error('Registration API error:', err);
            setError('Could not connect to the server. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
       <div className="register-container app" style={registerStyles.container}>
        <h1 style={registerStyles.pageTitle}>HeritageAI</h1>
            <form onSubmit={handleSubmit} style={registerStyles.form}>
                <h2 style={registerStyles.heading}>Register</h2>
                
                {error && <p style={registerStyles.error}>{error}</p>}
                {success && <p style={registerStyles.success}>Registration successful! Redirecting...</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={registerStyles.input}
                />
                <input
                    type="password"
                    placeholder="Password (Min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength="6"
                    required
                    style={registerStyles.input}
                />
                
                <button type="submit" disabled={loading} style={registerStyles.button}>
                    {loading ? 'Registering...' : 'Register'}
                </button>

                <p style={registerStyles.loginText}>
                    Already have an account? <a href="/login" style={registerStyles.link}>Login here</a>
                </p>
            </form>
        </div>
    );
}

export default Register;

// --- Minimal inline styles (same style as login) ---
const registerStyles = {
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
    success: {
        color: '#4caf50',
        textAlign: 'center',
        marginBottom: '10px',
        fontSize: '14px',
    },
    loginText: {
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