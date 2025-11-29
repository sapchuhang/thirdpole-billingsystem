import React from 'react';

const Cart = ({ cartItems, onUpdateQuantity, onRemoveItem, onCheckout, subtotal, tax, total, taxRate, selectedTable, onClearTable }) => {
    // Calculations moved to parent

    return (
        <div className="cart-container">
            {selectedTable && (
                <div className="selected-table glass-panel" style={{
                    padding: '0.75rem',
                    marginBottom: '1rem',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span style={{ fontWeight: 'bold', color: '#10b981' }}>{selectedTable.name}</span>
                    <button
                        onClick={onClearTable}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            padding: '0 0.5rem'
                        }}
                        title="Clear Table"
                    >
                        &times;
                    </button>
                </div>
            )}
            <div className="cart-items">
                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <p>No items in order</p>
                    </div>
                ) : (
                    cartItems.map(item => (
                        <div key={item.id} className="cart-item glass-panel">
                            <div className="item-info">
                                <h4>{item.name}</h4>
                                <span className="item-price">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                            <div className="item-controls">
                                <div className="quantity-controls">
                                    <button
                                        className="qty-btn"
                                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        className="qty-btn"
                                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    className="remove-btn"
                                    onClick={() => onRemoveItem(item.id)}
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="cart-summary glass-panel">
                <div className="summary-row">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                    <span>Tax ({taxRate || 13}%)</span>
                    <span>Rs. {tax.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                    <span>Total</span>
                    <span>Rs. {total.toFixed(2)}</span>
                </div>
                <button
                    className="btn btn-primary checkout-btn"
                    disabled={cartItems.length === 0}
                    onClick={onCheckout}
                >
                    Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;
