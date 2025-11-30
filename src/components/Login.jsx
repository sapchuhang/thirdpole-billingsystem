import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Delete, Circle, CircleDot } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = ({ onLogin }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const submitPin = useCallback((inputPin) => {
        setIsLoading(true);

        // Simulate network delay for better UX
        setTimeout(() => {
            const storedPin = localStorage.getItem('staffPin') || '1234';

            if (inputPin === storedPin) {
                toast.success('Welcome back!');
                onLogin();
            } else {
                setError(true);
                toast.error('Invalid PIN');
                setPin('');
                setIsLoading(false);
            }
        }, 500);
    }, [onLogin]);

    const handleNumberClick = useCallback((num) => {
        if (isLoading) return;

        if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);
            setError(false);

            if (newPin.length === 4) {
                submitPin(newPin);
            }
        }
    }, [pin, isLoading, submitPin]);

    const handleDelete = useCallback(() => {
        if (!isLoading) {
            setPin(prev => prev.slice(0, -1));
            setError(false);
        }
    }, [isLoading]);

    const handleClear = useCallback(() => {
        if (!isLoading) {
            setPin('');
            setError(false);
        }
    }, [isLoading]);

    // Handle physical keyboard input
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isLoading) return;

            if (/^[0-9]$/.test(e.key)) {
                handleNumberClick(parseInt(e.key));
            } else if (e.key === 'Backspace') {
                handleDelete();
            } else if (e.key === 'Enter') {
                if (pin.length === 4) submitPin(pin);
            } else if (e.key === 'Escape') {
                handleClear();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLoading, pin, handleNumberClick, handleDelete, handleClear, submitPin]);

    return (
        <div className="login-container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'var(--color-bg-dark)',
            padding: '1rem'
        }}>
            <div className="glass-panel" style={{
                width: '100%',
                maxWidth: '400px',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'var(--gradient-primary)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)'
                    }}>
                        <Lock size={40} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Enter your PIN to access POS</p>
                </div>

                {/* PIN Display */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                }}>
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} style={{
                            transition: 'all 0.2s',
                            transform: error ? 'translateX(5px)' : 'none',
                            color: error ? 'var(--color-danger)' : 'var(--color-primary)'
                        }}>
                            {i < pin.length ? (
                                <CircleDot size={20} fill="currentColor" />
                            ) : (
                                <Circle size={20} color="var(--color-text-muted)" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Keypad */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1rem',
                    width: '100%',
                    opacity: isLoading ? 0.5 : 1,
                    pointerEvents: isLoading ? 'none' : 'auto'
                }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleNumberClick(num)}
                            className="btn"
                            disabled={isLoading}
                            style={{
                                height: '60px',
                                fontSize: '1.5rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                color: 'white',
                                borderRadius: '15px'
                            }}
                        >
                            {num}
                        </button>
                    ))}

                    <button
                        onClick={handleClear}
                        className="btn"
                        disabled={isLoading}
                        style={{
                            height: '60px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: 'var(--color-danger)',
                            border: 'none',
                            borderRadius: '15px',
                            fontSize: '0.9rem'
                        }}
                    >
                        CLEAR
                    </button>

                    <button
                        onClick={() => handleNumberClick(0)}
                        className="btn"
                        disabled={isLoading}
                        style={{
                            height: '60px',
                            fontSize: '1.5rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            color: 'white',
                            borderRadius: '15px'
                        }}
                    >
                        0
                    </button>

                    <button
                        onClick={handleDelete}
                        className="btn"
                        disabled={isLoading}
                        style={{
                            height: '60px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--color-text-muted)',
                            border: 'none',
                            borderRadius: '15px'
                        }}
                    >
                        <Delete size={24} />
                    </button>
                </div>

                <div style={{
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    color: 'var(--color-text-muted)',
                    marginTop: '1rem'
                }}>
                    <p>Default PIN: <strong>1234</strong></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
