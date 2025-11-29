import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import MenuGrid from './components/MenuGrid';
import Cart from './components/Cart';
import BillModal from './components/BillModal';
import Settings from './components/Settings';
import Orders from './components/Orders';
import Login from './components/Login';
import MenuEditor from './components/MenuEditor';
import { getMenuItems, saveMenuItems, getCategories, saveCategories } from './data/menu';
import Dashboard from './components/Dashboard';
import TableManager from './components/TableManager';
import { updateTableStatus } from './data/tables';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('pos'); // 'pos', 'orders', 'settings', 'menu'
  const [cartItems, setCartItems] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [settings, setSettings] = useState({
    restaurantName: 'Third Pole Restaurant',
    address: '123 Everest Base Camp Road, Kathmandu',
    taxRate: 13,
    serviceCharge: 10,
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('restaurantSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    // Load menu items and categories
    setMenuItems(getMenuItems());
    setCategories(getCategories());
  }, []);

  const addToOrder = (item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId, newQty) => {
    if (newQty < 1) {
      removeFromOrder(itemId);
      return;
    }
    setCartItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity: newQty } : i));
  };

  const removeFromOrder = (itemId) => {
    setCartItems(prev => prev.filter(i => i.id !== itemId));
  };

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleFinalizeOrder = () => {
    const newOrder = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: cartItems,
      subtotal,
      tax,
      total,
      settingsSnapshot: settings
    };

    const savedOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    localStorage.setItem('orderHistory', JSON.stringify([...savedOrders, newOrder]));

    if (selectedTable) {
      updateTableStatus(selectedTable.id, 'free');
      setSelectedTable(null);
    }

    setCartItems([]);
    setIsCheckoutOpen(false);
    alert('Order completed and saved!');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * (settings.taxRate / 100);
  const total = subtotal + tax;

  const handleMenuUpdate = (updatedItems) => {
    setMenuItems(updatedItems);
    saveMenuItems(updatedItems);
  };

  const handleCategoryUpdate = () => {
    // Reload categories from localStorage
    setCategories(getCategories());
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    updateTableStatus(table.id, 'occupied');
    setCurrentView('pos');
  };

  const renderContent = () => {
    switch (currentView) {

      case 'settings':
        return <Settings onSave={setSettings} />;
      case 'orders':
        return <Orders />;
      case 'dashboard':
        return <Dashboard />;
      case 'tables':
        return <TableManager onSelectTable={handleTableSelect} selectedTableId={selectedTable?.id} />;
      case 'menu':
        return <MenuEditor menuItems={menuItems} categories={categories} onSave={handleMenuUpdate} onCategoryUpdate={handleCategoryUpdate} />;
      case 'pos':
      default:
        return (
          <>
            <div className="menu-section glass-panel" style={{ flex: 2, padding: '1rem', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ marginBottom: '1rem' }}>Menu</h2>
              <MenuGrid
                items={menuItems}
                categories={categories}
                onAddToOrder={addToOrder}
              />
            </div>
            <div className="cart-section glass-panel" style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ marginBottom: '1rem' }}>Current Order</h2>
              <Cart
                cartItems={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromOrder}
                onCheckout={handleCheckout}
                subtotal={subtotal}
                tax={tax}
                total={total}
                taxRate={settings.taxRate}
                currency="Rs."
                selectedTable={selectedTable}
                onClearTable={() => {
                  if (selectedTable) updateTableStatus(selectedTable.id, 'free');
                  setSelectedTable(null);
                }}
              />
            </div>
          </>
        );
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isLoggedIn');
    setCurrentView('pos');
    setCartItems([]);
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView} onLogout={handleLogout}>
      {renderContent()}

      {isCheckoutOpen && (
        <BillModal
          items={cartItems}
          subtotal={subtotal}
          tax={tax}
          total={total}
          settings={settings}
          onClose={() => setIsCheckoutOpen(false)}
          onFinalize={handleFinalizeOrder}
        />
      )}
    </Layout>
  );
}

export default App;
