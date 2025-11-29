const DEFAULT_TABLES = [
    { id: '1', name: 'Table 1', status: 'free', seats: 4 },
    { id: '2', name: 'Table 2', status: 'free', seats: 4 },
    { id: '3', name: 'Table 3', status: 'free', seats: 2 },
    { id: '4', name: 'Table 4', status: 'free', seats: 6 },
    { id: '5', name: 'Table 5', status: 'free', seats: 4 },
    { id: '6', name: 'Table 6', status: 'free', seats: 8 },
];

export const getTables = () => {
    const saved = localStorage.getItem('restaurantTables');
    if (saved) {
        return JSON.parse(saved);
    }
    // Initialize if empty
    localStorage.setItem('restaurantTables', JSON.stringify(DEFAULT_TABLES));
    return DEFAULT_TABLES;
};

export const saveTables = (tables) => {
    localStorage.setItem('restaurantTables', JSON.stringify(tables));
};

export const updateTableStatus = (tableId, status) => {
    const tables = getTables();
    const updated = tables.map(t =>
        t.id === tableId ? { ...t, status } : t
    );
    saveTables(updated);
    return updated;
};
