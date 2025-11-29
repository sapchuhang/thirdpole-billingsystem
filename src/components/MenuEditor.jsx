import React, { useState } from 'react';
import { saveCategories } from '../data/menu';

const MenuEditor = ({ menuItems, categories, onSave, onCategoryUpdate }) => {
    const [activeTab, setActiveTab] = useState('items'); // 'items' or 'categories'
    const [items, setItems] = useState(menuItems);
    const [cats, setCats] = useState(categories);
    const [editingItem, setEditingItem] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Category management state
    const [editingCategory, setEditingCategory] = useState(null);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [categoryFormData, setCategoryFormData] = useState({ name: '' });
    const [deleteCategoryConfirm, setDeleteCategoryConfirm] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'starters',
        description: '',
        image: '',
        inStock: true,
    });

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            category: 'starters',
            description: '',
            image: '',
            inStock: true,
        });
        setEditingItem(null);
        setIsAdding(false);
    };

    const handleEdit = (item) => {
        setEditingItem(item.id);
        setFormData({
            name: item.name,
            price: item.price,
            category: item.category,
            description: item.description,
            image: item.image,
            inStock: item.inStock !== false,
        });
        setIsAdding(false);
    };

    const handleSave = () => {
        if (!formData.name || !formData.price) {
            alert('Please fill in name and price');
            return;
        }

        let updatedItems;
        if (editingItem) {
            updatedItems = items.map(item =>
                item.id === editingItem
                    ? { ...item, ...formData, price: parseFloat(formData.price) }
                    : item
            );
        } else {
            const newItem = {
                id: Date.now(),
                ...formData,
                price: parseFloat(formData.price),
            };
            updatedItems = [...items, newItem];
        }

        setItems(updatedItems);
        onSave(updatedItems);
        resetForm();
    };

    const handleDelete = (id) => {
        const updatedItems = items.filter(item => item.id !== id);
        setItems(updatedItems);
        onSave(updatedItems);
        setDeleteConfirm(null);
    };

    const toggleStock = (id) => {
        const updatedItems = items.map(item =>
            item.id === id ? { ...item, inStock: !item.inStock } : item
        );
        setItems(updatedItems);
        onSave(updatedItems);
    };

    // Category management functions
    const handleCategoryEdit = (cat) => {
        setEditingCategory(cat.id);
        setCategoryFormData({ name: cat.name });
        setIsAddingCategory(false);
    };

    const handleCategorySave = () => {
        if (!categoryFormData.name) {
            alert('Please enter a category name');
            return;
        }

        let updatedCats;
        if (editingCategory) {
            updatedCats = cats.map(cat =>
                cat.id === editingCategory
                    ? { ...cat, name: categoryFormData.name }
                    : cat
            );
        } else {
            const newCat = {
                id: categoryFormData.name.toLowerCase().replace(/\s+/g, '_'),
                name: categoryFormData.name,
            };
            updatedCats = [...cats, newCat];
        }

        setCats(updatedCats);
        saveCategories(updatedCats);
        if (onCategoryUpdate) onCategoryUpdate();
        setCategoryFormData({ name: '' });
        setEditingCategory(null);
        setIsAddingCategory(false);
    };

    const handleCategoryDelete = (id) => {
        // Check if any items use this category
        const itemsInCategory = items.filter(item => item.category === id);
        if (itemsInCategory.length > 0) {
            alert(`Cannot delete category. ${itemsInCategory.length} item(s) are using this category.`);
            setDeleteCategoryConfirm(null);
            return;
        }

        const updatedCats = cats.filter(cat => cat.id !== id);
        setCats(updatedCats);
        saveCategories(updatedCats);
        if (onCategoryUpdate) onCategoryUpdate();
        setDeleteCategoryConfirm(null);
    };

    const moveCategoryUp = (index) => {
        if (index === 0 || index === 1) return; // Can't move 'all' or first real category
        const updatedCats = [...cats];
        [updatedCats[index], updatedCats[index - 1]] = [updatedCats[index - 1], updatedCats[index]];
        setCats(updatedCats);
        saveCategories(updatedCats);
        if (onCategoryUpdate) onCategoryUpdate();
    };

    const moveCategoryDown = (index) => {
        if (index >= cats.length - 1) return;
        const updatedCats = [...cats];
        [updatedCats[index], updatedCats[index + 1]] = [updatedCats[index + 1], updatedCats[index]];
        setCats(updatedCats);
        saveCategories(updatedCats);
        if (onCategoryUpdate) onCategoryUpdate();
    };

    return (
        <div className="menu-editor" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '2rem' }}>Menu Management</h2>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)' }}>
                <button
                    onClick={() => setActiveTab('items')}
                    style={{
                        padding: '1rem 2rem',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'items' ? '2px solid var(--color-primary)' : '2px solid transparent',
                        color: activeTab === 'items' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'items' ? 'bold' : 'normal'
                    }}
                >
                    Menu Items
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    style={{
                        padding: '1rem 2rem',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'categories' ? '2px solid var(--color-primary)' : '2px solid transparent',
                        color: activeTab === 'categories' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'categories' ? 'bold' : 'normal'
                    }}
                >
                    Categories
                </button>
            </div>

            {/* Menu Items Tab */}
            {activeTab === 'items' && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3>Menu Items</h3>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                if (isAdding || editingItem) {
                                    resetForm();
                                } else {
                                    setIsAdding(true);
                                    setEditingItem(null);
                                    setFormData({
                                        name: '',
                                        price: '',
                                        category: cats.filter(c => c.id !== 'all')[0]?.id || 'starters',
                                        description: '',
                                        image: '',
                                        inStock: true,
                                    });
                                }
                            }}
                        >
                            {(isAdding || editingItem) ? 'Cancel' : '+ Add New Item'}
                        </button>
                    </div>

                    {(isAdding || editingItem) && (
                        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                            <h3>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Price (Rs.)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                    >
                                        {cats.filter(c => c.id !== 'all').map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Image URL</label>
                                    <input
                                        type="text"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="https://..."
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                    />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.2)', color: 'white', resize: 'vertical' }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button className="btn btn-primary" onClick={handleSave}>
                                    {editingItem ? 'Update' : 'Add'} Item
                                </button>
                                <button className="btn" onClick={resetForm} style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'white' }}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="menu-items-list">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Category</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Price</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>Stock</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>{item.name}</td>
                                        <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>
                                            {cats.find(c => c.id === item.category)?.name}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>Rs. {item.price}</td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <button
                                                onClick={() => toggleStock(item.id)}
                                                style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '20px',
                                                    background: item.inStock !== false ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                    color: item.inStock !== false ? '#10b981' : '#ef4444',
                                                    border: 'none',
                                                    fontSize: '0.875rem',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {item.inStock !== false ? 'In Stock' : 'Out of Stock'}
                                            </button>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button
                                                onClick={() => handleEdit(item)}
                                                style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(item.id)}
                                                style={{ padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3>Categories</h3>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                if (isAddingCategory || editingCategory) {
                                    setCategoryFormData({ name: '' });
                                    setEditingCategory(null);
                                    setIsAddingCategory(false);
                                } else {
                                    setIsAddingCategory(true);
                                    setEditingCategory(null);
                                    setCategoryFormData({ name: '' });
                                }
                            }}
                        >
                            {(isAddingCategory || editingCategory) ? 'Cancel' : '+ Add New Category'}
                        </button>
                    </div>

                    {(isAddingCategory || editingCategory) && (
                        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                            <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
                            <div style={{ marginTop: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Category Name</label>
                                <input
                                    type="text"
                                    value={categoryFormData.name}
                                    onChange={(e) => setCategoryFormData({ name: e.target.value })}
                                    placeholder="e.g., Appetizers, Beverages"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button className="btn btn-primary" onClick={handleCategorySave}>
                                    {editingCategory ? 'Update' : 'Add'} Category
                                </button>
                                <button
                                    className="btn"
                                    onClick={() => {
                                        setCategoryFormData({ name: '' });
                                        setEditingCategory(null);
                                        setIsAddingCategory(false);
                                    }}
                                    style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'white' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="categories-list">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Category Name</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>Items</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cats.filter(c => c.id !== 'all').map((cat, index) => {
                                    const itemCount = items.filter(item => item.category === cat.id).length;
                                    const actualIndex = index + 1; // Account for 'all' being filtered out
                                    return (
                                        <tr key={cat.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '1rem' }}>{cat.name}</td>
                                            <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                                {itemCount} item{itemCount !== 1 ? 's' : ''}
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                <button
                                                    onClick={() => moveCategoryUp(actualIndex)}
                                                    disabled={actualIndex === 1}
                                                    style={{
                                                        marginRight: '0.5rem',
                                                        padding: '0.5rem',
                                                        background: 'transparent',
                                                        border: '1px solid var(--color-border)',
                                                        color: 'white',
                                                        borderRadius: 'var(--radius-md)',
                                                        cursor: actualIndex === 1 ? 'not-allowed' : 'pointer',
                                                        opacity: actualIndex === 1 ? 0.3 : 1
                                                    }}
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    onClick={() => moveCategoryDown(actualIndex)}
                                                    disabled={actualIndex === cats.length - 1}
                                                    style={{
                                                        marginRight: '0.5rem',
                                                        padding: '0.5rem',
                                                        background: 'transparent',
                                                        border: '1px solid var(--color-border)',
                                                        color: 'white',
                                                        borderRadius: 'var(--radius-md)',
                                                        cursor: actualIndex === cats.length - 1 ? 'not-allowed' : 'pointer',
                                                        opacity: actualIndex === cats.length - 1 ? 0.3 : 1
                                                    }}
                                                >
                                                    ↓
                                                </button>
                                                <button
                                                    onClick={() => handleCategoryEdit(cat)}
                                                    style={{
                                                        marginRight: '0.5rem',
                                                        padding: '0.5rem 1rem',
                                                        background: 'transparent',
                                                        border: '1px solid var(--color-border)',
                                                        color: 'white',
                                                        borderRadius: 'var(--radius-md)',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeleteCategoryConfirm(cat.id)}
                                                    style={{
                                                        padding: '0.5rem 1rem',
                                                        background: 'rgba(239, 68, 68, 0.1)',
                                                        border: '1px solid var(--color-danger)',
                                                        color: 'var(--color-danger)',
                                                        borderRadius: 'var(--radius-md)',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Delete Item Confirmation */}
            {deleteConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel" style={{ maxWidth: '400px', padding: '2rem' }}>
                        <h3>Confirm Delete</h3>
                        <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>
                            Are you sure you want to delete "{items.find(i => i.id === deleteConfirm)?.name}"?
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button
                                className="btn"
                                onClick={() => handleDelete(deleteConfirm)}
                                style={{ flex: 1, background: 'var(--color-danger)', color: 'white' }}
                            >
                                Delete
                            </button>
                            <button
                                className="btn"
                                onClick={() => setDeleteConfirm(null)}
                                style={{ flex: 1, background: 'transparent', border: '1px solid var(--color-border)', color: 'white' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Category Confirmation */}
            {deleteCategoryConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel" style={{ maxWidth: '400px', padding: '2rem' }}>
                        <h3>Confirm Delete</h3>
                        <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>
                            Are you sure you want to delete category "{cats.find(c => c.id === deleteCategoryConfirm)?.name}"?
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button
                                className="btn"
                                onClick={() => handleCategoryDelete(deleteCategoryConfirm)}
                                style={{ flex: 1, background: 'var(--color-danger)', color: 'white' }}
                            >
                                Delete
                            </button>
                            <button
                                className="btn"
                                onClick={() => setDeleteCategoryConfirm(null)}
                                style={{ flex: 1, background: 'transparent', border: '1px solid var(--color-border)', color: 'white' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuEditor;
