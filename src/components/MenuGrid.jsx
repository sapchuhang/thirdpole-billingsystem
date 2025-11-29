import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const MenuGrid = ({ items, categories, onAddToOrder }) => {
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredItems = activeCategory === 'all'
        ? items
        : items.filter(item => item.category === activeCategory);

    return (
        <div className="menu-container">
            <div className="category-filter">
                {categories.map(category => (
                    <button
                        key={category.id}
                        className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(category.id)}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            <div className="menu-grid">
                {filteredItems.map(item => (
                    <div key={item.id} className="menu-card glass-panel">
                        <div className="card-image">
                            <img src={item.image} alt={item.name} loading="lazy" />
                            {item.inStock === false && (
                                <div style={{
                                    position: 'absolute',
                                    top: '0.5rem',
                                    right: '0.5rem',
                                    background: 'rgba(239, 68, 68, 0.9)',
                                    color: 'white',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold'
                                }}>
                                    Out of Stock
                                </div>
                            )}
                        </div>
                        <div className="card-content">
                            <div className="card-header">
                                <h4>{item.name}</h4>
                                <span className="price">Rs. {item.price.toFixed(2)}</span>
                            </div>
                            <p className="description">{item.description}</p>
                            <button
                                className="btn btn-primary add-btn"
                                onClick={() => onAddToOrder(item)}
                                disabled={item.inStock === false}
                                style={{
                                    opacity: item.inStock === false ? 0.5 : 1,
                                    cursor: item.inStock === false ? 'not-allowed' : 'pointer',
                                    marginTop: 'auto'
                                }}
                            >
                                <Plus size={16} />
                                {item.inStock === false ? 'Out of Stock' : 'Add'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuGrid;
