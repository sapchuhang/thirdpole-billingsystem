import React, { useState, useEffect } from 'react';

const Settings = ({ onSave }) => {
    const [settings, setSettings] = useState({
        restaurantName: 'Third Pole Restaurant',
        address: '123 Everest Base Camp Road, Kathmandu',
        taxRate: 13,
        serviceCharge: 10,
    });

    const [pinData, setPinData] = useState({
        currentPin: '',
        newPin: '',
        confirmPin: ''
    });

    useEffect(() => {
        const savedSettings = localStorage.getItem('restaurantSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: name === 'taxRate' || name === 'serviceCharge' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('restaurantSettings', JSON.stringify(settings));
        if (onSave) onSave(settings);
        alert('Settings saved successfully!');
    };

    const handlePinChange = (e) => {
        const { name, value } = e.target;
        setPinData(prev => ({ ...prev, [name]: value }));
    };

    const handlePinSubmit = (e) => {
        e.preventDefault();
        const storedPin = localStorage.getItem('staffPin') || '1234';

        if (pinData.currentPin !== storedPin) {
            alert('Current PIN is incorrect!');
            return;
        }

        if (pinData.newPin.length < 4) {
            alert('New PIN must be at least 4 digits!');
            return;
        }

        if (pinData.newPin !== pinData.confirmPin) {
            alert('New PIN and Confirm PIN do not match!');
            return;
        }

        localStorage.setItem('staffPin', pinData.newPin);
        setPinData({ currentPin: '', newPin: '', confirmPin: '' });
        alert('PIN changed successfully!');
    };

    const handleExport = () => {
        const data = {
            restaurantSettings: localStorage.getItem('restaurantSettings'),
            menuItems: localStorage.getItem('menuItems'),
            categories: localStorage.getItem('categories'),
            orderHistory: localStorage.getItem('orderHistory'),
            restaurantTables: localStorage.getItem('restaurantTables')
        };
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.restaurantSettings) localStorage.setItem('restaurantSettings', data.restaurantSettings);
                if (data.menuItems) localStorage.setItem('menuItems', data.menuItems);
                if (data.categories) localStorage.setItem('categories', data.categories);
                if (data.orderHistory) localStorage.setItem('orderHistory', data.orderHistory);
                if (data.restaurantTables) localStorage.setItem('restaurantTables', data.restaurantTables);

                alert('Data imported successfully! Reloading...');
                window.location.reload();
            } catch (err) {
                alert('Error importing data: ' + err.message);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="settings-container glass-panel" style={{
            padding: '2rem',
            maxWidth: '700px',
            margin: '0 auto',
            width: '100%',
            height: '100%',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <h2 style={{ marginBottom: '2rem' }}>Restaurant Settings</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Restaurant Name</label>
                    <input
                        type="text"
                        name="restaurantName"
                        value={settings.restaurantName}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Address</label>
                    <input
                        type="text"
                        name="address"
                        value={settings.address}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Tax Rate (%)</label>
                        <input
                            type="number"
                            name="taxRate"
                            value={settings.taxRate}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                        />
                    </div>

                    <div className="form-group" style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Service Charge (%)</label>
                        <input
                            type="number"
                            name="serviceCharge"
                            value={settings.serviceCharge}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Save Settings
                </button>
            </form>

            {/* PIN Management Section */}
            <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Security Settings</h3>
                <form onSubmit={handlePinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Current PIN</label>
                        <input
                            type="password"
                            name="currentPin"
                            value={pinData.currentPin}
                            onChange={handlePinChange}
                            placeholder="Enter current PIN"
                            style={{ width: '100%', padding: '0.75rem' }}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>New PIN</label>
                        <input
                            type="password"
                            name="newPin"
                            value={pinData.newPin}
                            onChange={handlePinChange}
                            placeholder="Enter new PIN (min 4 digits)"
                            style={{ width: '100%', padding: '0.75rem' }}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Confirm New PIN</label>
                        <input
                            type="password"
                            name="confirmPin"
                            value={pinData.confirmPin}
                            onChange={handlePinChange}
                            placeholder="Re-enter new PIN"
                            style={{ width: '100%', padding: '0.75rem' }}
                        />
                    </div>

                    <button type="submit" className="btn" style={{ background: 'var(--gradient-accent)', color: 'white', marginTop: '0.5rem' }}>
                        Change PIN
                    </button>
                </form>
            </div>

            <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Data Management</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        className="btn"
                        onClick={handleExport}
                        style={{ background: 'var(--color-accent)', color: 'white' }}
                    >
                        Export Data Backup
                    </button>

                    <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
                        <button
                            type="button"
                            className="btn"
                            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--color-border)' }}
                        >
                            Import Data
                        </button>
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                opacity: 0,
                                width: '100%',
                                height: '100%',
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                </div>
                <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Export your data to keep a backup. Import a backup file to restore your menu, orders, and settings.
                </p>
            </div>
        </div>
    );
};

export default Settings;
