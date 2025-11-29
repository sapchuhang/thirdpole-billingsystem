import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Get stored PIN or use default
        const storedPin = localStorage.getItem('staffPin') || '1234';

        if (pin === storedPin) {
            onLogin();
            setError('');
        } else {
            setError('Invalid PIN. Please try again.');
            setPin('');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box glass-panel">
                <div className="login-header">
                    <h2>Third Pole Restaurant</h2>
                    <p>Staff Login</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
                            Enter PIN
                        </label>
                        <input
                            type="password"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            placeholder="Default: 1234"
                            autoFocus
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                background: 'rgba(0,0,0,0.2)',
                                color: 'white',
                                fontSize: '1.5rem',
                                textAlign: 'center',
                                letterSpacing: '0.5rem'
                            }}
                        />
                        {error && (
                            <p style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-sm)', marginTop: '0.5rem' }}>
                                {error}
                            </p>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ padding: '1rem' }}>
                        Login
                    </button>
                </form>

                <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                    <p><strong>Default PIN:</strong> 1234</p>
                    <p style={{ marginTop: '0.5rem' }}>Change PIN in Settings after logging in.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
