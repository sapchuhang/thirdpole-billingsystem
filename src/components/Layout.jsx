import React from 'react';
import {
    LayoutGrid,
    UtensilsCrossed,
    History,
    Settings,
    LayoutDashboard,
    Users,
    LogOut
} from 'lucide-react';

const Layout = ({ children, currentView, onViewChange, onLogout }) => {
    return (
        <div className="layout">
            <aside className="sidebar glass-panel">
                <div className="logo">
                    <h3>3P</h3>
                </div>
                <nav className="nav-menu">
                    <button
                        className={`nav-item ${currentView === 'pos' ? 'active' : ''}`}
                        onClick={() => onViewChange('pos')}
                        title="POS"
                    >
                        <LayoutGrid />
                    </button>
                    <button
                        className={`nav-item ${currentView === 'menu' ? 'active' : ''}`}
                        onClick={() => onViewChange('menu')}
                        title="Menu"
                    >
                        <UtensilsCrossed />
                    </button>
                    <button
                        className={`nav-item ${currentView === 'orders' ? 'active' : ''}`}
                        onClick={() => onViewChange('orders')}
                        title="Orders"
                    >
                        <History />
                    </button>
                    <button
                        className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
                        onClick={() => onViewChange('dashboard')}
                        title="Dashboard"
                    >
                        <LayoutDashboard />
                    </button>
                    <button
                        className={`nav-item ${currentView === 'tables' ? 'active' : ''}`}
                        onClick={() => onViewChange('tables')}
                        title="Tables"
                    >
                        <Users />
                    </button>
                    <button
                        className={`nav-item ${currentView === 'settings' ? 'active' : ''}`}
                        onClick={() => onViewChange('settings')}
                        title="Settings"
                    >
                        <Settings />
                    </button>
                </nav>
                <button
                    className="nav-item logout-btn"
                    onClick={onLogout}
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </aside>
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
