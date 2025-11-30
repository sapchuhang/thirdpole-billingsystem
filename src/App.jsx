import React, { useState, useEffect, lazy, Suspense } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import MenuGrid from './components/MenuGrid';
import Cart from './components/Cart';
import BillModal from './components/BillModal';
import Login from './components/Login';
import ErrorBoundary from './components/ErrorBoundary';
import Loading from './components/Loading';
import { getMenuItems, saveMenuItems, getCategories } from './data/menu';
import { updateTableStatus } from './data/tables';

// Lazy load heavy components
const Settings = lazy(() => import('./components/Settings'));
const Orders = lazy(() => import('./components/Orders'));
const MenuEditor = lazy(() => import('./components/MenuEditor'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const TableManager = lazy(() => import('./components/TableManager'));

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

  const [activeOrders, setActiveOrders] = useState({}); // { tableId: [items] }
  const isSwitchingTable = React.useRef(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('restaurantSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    // Load menu items and categories
    setMenuItems(getMenuItems());
    setCategories(getCategories());

    // Load active orders
    const savedActiveOrders = localStorage.getItem('activeOrders');
    if (savedActiveOrders) {
      setActiveOrders(JSON.parse(savedActiveOrders));
    }
  }, []);

  // Save active orders whenever cart changes
  useEffect(() => {
    if (isSwitchingTable.current) {
      isSwitchingTable.current = false;
      return;
    }

    if (selectedTable) {
      setActiveOrders(prev => {
        const newOrders = { ...prev, [selectedTable.id]: cartItems };
        localStorage.setItem('activeOrders', JSON.stringify(newOrders));
        return newOrders;
      });

      // Update table status
      if (cartItems.length > 0) {
        updateTableStatus(selectedTable.id, 'occupied');
      } else {
        // If cart is empty for a selected table, mark it as free
        updateTableStatus(selectedTable.id, 'free');
      }
    }
  }, [cartItems, selectedTable]);

  const addToOrder = (item) => {
    if (!selectedTable) {
      toast.error('Please select a table first');
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId, newQty) => {
    if (!selectedTable) return;

    if (newQty < 1) {
      removeFromOrder(itemId);
      return;
    }

    setCartItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity: newQty } : i));
  };

  const removeFromOrder = (itemId) => {
    if (!selectedTable) return;
    setCartItems(prev => prev.filter(i => i.id !== itemId));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }
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
      settingsSnapshot: settings,
      tableId: selectedTable?.id,
      tableName: selectedTable?.name
    };

    const savedOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    localStorage.setItem('orderHistory', JSON.stringify([...savedOrders, newOrder]));

    if (selectedTable) {
      updateTableStatus(selectedTable.id, 'free');

      // Clear active order for this table
      const newActiveOrders = { ...activeOrders };
      delete newActiveOrders[selectedTable.id];
      setActiveOrders(newActiveOrders);
      localStorage.setItem('activeOrders', JSON.stringify(newActiveOrders));

      setSelectedTable(null);
    }

    setCartItems([]);
    setIsCheckoutOpen(false);
    toast.success('Order completed and saved!');
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
    isSwitchingTable.current = true;
    setSelectedTable(table);
    // Load items for this table
    const tableItems = activeOrders[table.id] || [];
    setCartItems(tableItems);

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
    <ErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Layout currentView={currentView} onViewChange={setCurrentView} onLogout={handleLogout}>
        <Suspense fallback={<Loading />}>
          {renderContent()}
        </Suspense>

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
    </ErrorBoundary>
  );
}

export default App;
