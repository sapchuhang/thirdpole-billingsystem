import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({
        todayRevenue: 0,
        todayOrders: 0,
        avgOrderValue: 0,
    });
    const [revenueData, setRevenueData] = useState([]);
    const [topItems, setTopItems] = useState([]);

    useEffect(() => {
        const loadData = () => {
            const savedOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');

            // --- Process Today's Stats ---
            const today = new Date().toDateString();
            const todaysOrders = savedOrders.filter(
                (order) => new Date(order.date).toDateString() === today
            );

            const todayRevenue = todaysOrders.reduce((sum, order) => sum + order.total, 0);
            const todayOrdersCount = todaysOrders.length;
            const avgOrderValue = todayOrdersCount > 0 ? todayRevenue / todayOrdersCount : 0;

            setStats({
                todayRevenue,
                todayOrders: todayOrdersCount,
                avgOrderValue,
            });

            // --- Process Revenue Chart (Last 7 Days) ---
            const last7Days = [...Array(7)].map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - i);
                return d.toDateString();
            }).reverse();

            const chartData = last7Days.map(dateStr => {
                const dayRevenue = savedOrders
                    .filter(order => new Date(order.date).toDateString() === dateStr)
                    .reduce((sum, order) => sum + order.total, 0);

                // Format date for display (e.g., "Mon 29")
                const dateObj = new Date(dateStr);
                const displayDate = `${dateObj.toLocaleDateString('en-US', { weekday: 'short' })} ${dateObj.getDate()}`;

                return {
                    name: displayDate,
                    revenue: dayRevenue
                };
            });
            setRevenueData(chartData);

            // --- Process Top Items ---
            const itemCounts = {};
            savedOrders.forEach(order => {
                order.items.forEach(item => {
                    if (itemCounts[item.name]) {
                        itemCounts[item.name] += item.quantity;
                    } else {
                        itemCounts[item.name] = item.quantity;
                    }
                });
            });

            const topItemsData = Object.keys(itemCounts)
                .map(name => ({ name, value: itemCounts[name] }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 5); // Top 5

            setTopItems(topItemsData);
        };

        loadData();
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="dashboard-container glass-panel" style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '2rem' }}>Dashboard</h2>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="stat-card glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)' }}>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Today's Revenue</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', background: 'var(--gradient-success)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Rs. {stats.todayRevenue.toFixed(2)}
                    </p>
                </div>
                <div className="stat-card glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)' }}>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Today's Orders</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>{stats.todayOrders}</p>
                </div>
                <div className="stat-card glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)' }}>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Avg. Order Value</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Rs. {stats.avgOrderValue.toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

                {/* Revenue Chart */}
                <div className="chart-container glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Revenue (Last 7 Days)</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="var(--color-text-muted)" />
                                <YAxis stroke="var(--color-text-muted)" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="revenue" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Items Chart */}
                <div className="chart-container glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Top Selling Items</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        {topItems.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={topItems}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {topItems.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                                No sales data yet
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
