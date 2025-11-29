import React, { useState, useEffect } from 'react';

const Orders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const savedOrders = localStorage.getItem('orderHistory');
        if (savedOrders) {
            setOrders(JSON.parse(savedOrders).reverse()); // Show newest first
        }
    }, []);

    return (
        <div className="orders-container glass-panel" style={{ padding: '2rem', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ marginBottom: '2rem' }}>Order History</h2>

            <div className="orders-list" style={{ overflowY: 'auto', flex: 1 }}>
                {orders.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No past orders found.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                <th style={{ padding: '1rem' }}>Order ID</th>
                                <th style={{ padding: '1rem' }}>Date</th>
                                <th style={{ padding: '1rem' }}>Items</th>
                                <th style={{ padding: '1rem' }}>Total</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>#{order.id.slice(-6)}</td>
                                    <td style={{ padding: '1rem' }}>{new Date(order.date).toLocaleString()}</td>
                                    <td style={{ padding: '1rem' }}>
                                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                                        Rs. {order.total.toFixed(2)}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            background: 'rgba(16, 185, 129, 0.2)',
                                            color: '#10b981',
                                            fontSize: '0.875rem'
                                        }}>
                                            Completed
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Orders;
