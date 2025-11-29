import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: '2rem',
                    textAlign: 'center',
                    background: 'var(--color-bg-dark)',
                    color: 'var(--color-text-main)'
                }}>
                    <div className="glass-panel" style={{
                        padding: '3rem',
                        maxWidth: '500px',
                        width: '100%'
                    }}>
                        <AlertTriangle size={64} color="var(--color-danger)" style={{ marginBottom: '1.5rem' }} />
                        <h1 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Oops! Something went wrong</h1>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                            We encountered an unexpected error. Don't worry, your data is safe.
                        </p>
                        <button
                            onClick={this.handleReset}
                            className="btn btn-primary"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                margin: '0 auto'
                            }}
                        >
                            <RefreshCw size={16} />
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
