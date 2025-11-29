import React, { useState, useEffect } from 'react';
import { getTables, saveTables } from '../data/tables';

const TableManager = ({ onSelectTable, selectedTableId }) => {
    const [tables, setTables] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [newTable, setNewTable] = useState({ name: '', seats: 4 });

    useEffect(() => {
        setTables(getTables());
    }, []);

    const handleAddTable = () => {
        if (!newTable.name) return;
        const updatedTables = [...tables, {
            id: Date.now().toString(),
            ...newTable,
            status: 'free'
        }];
        setTables(updatedTables);
        saveTables(updatedTables);
        setNewTable({ name: '', seats: 4 });
        setIsEditing(false);
    };

    const handleDeleteTable = (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this table?')) {
            const updatedTables = tables.filter(t => t.id !== id);
            setTables(updatedTables);
            saveTables(updatedTables);
        }
    };

    const handleTableClick = (table) => {
        if (onSelectTable) {
            onSelectTable(table);
        }
    };

    return (
        <div className="table-manager glass-panel" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Table Management</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? 'Cancel' : 'Add Table'}
                </button>
            </div>

            {isEditing && (
                <div className="add-table-form glass-panel" style={{ padding: '1rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Table Name</label>
                            <input
                                type="text"
                                value={newTable.name}
                                onChange={e => setNewTable({ ...newTable, name: e.target.value })}
                                placeholder="e.g. Table 7"
                                className="input-field"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div style={{ width: '100px' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Seats</label>
                            <input
                                type="number"
                                value={newTable.seats}
                                onChange={e => setNewTable({ ...newTable, seats: parseInt(e.target.value) })}
                                className="input-field"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <button className="btn btn-primary" onClick={handleAddTable}>Save</button>
                    </div>
                </div>
            )}

            <div className="tables-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '1.5rem',
                overflowY: 'auto',
                padding: '0.5rem'
            }}>
                {tables.map(table => (
                    <div
                        key={table.id}
                        onClick={() => handleTableClick(table)}
                        className={`table-card glass-panel ${selectedTableId === table.id ? 'selected' : ''}`}
                        style={{
                            padding: '1.5rem',
                            cursor: 'pointer',
                            position: 'relative',
                            border: selectedTableId === table.id ? '2px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                            background: table.status === 'occupied' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: table.status === 'occupied' ? '#ef4444' : '#10b981'
                        }} />

                        <h3 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>{table.name}</h3>
                        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                            {table.seats} Seats
                        </p>
                        <p style={{ textAlign: 'center', fontSize: '0.8rem', marginTop: '0.5rem', color: table.status === 'occupied' ? '#ef4444' : '#10b981' }}>
                            {table.status.toUpperCase()}
                        </p>

                        {isEditing && (
                            <button
                                onClick={(e) => handleDeleteTable(table.id, e)}
                                style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px'
                                }}
                            >
                                &times;
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TableManager;
