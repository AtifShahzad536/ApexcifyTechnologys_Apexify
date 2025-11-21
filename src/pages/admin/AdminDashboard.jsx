import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { motion } from 'framer-motion';
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign } from 'react-icons/fi';
import api from '../../utils/api';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { fadeIn, staggerContainer, staggerItem } from '../../utils/animations';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const { data } = await api.get('/admin/dashboard');
            setStats(data.stats);
            setRecentOrders(data.recentOrders || []);
            setTopProducts(data.topProducts || []);
        } catch (error) {
            console.error('Failed to fetch dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading fullScreen />;

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.h1 {...fadeIn} className="text-4xl font-bold mb-8">
                Admin Dashboard
            </motion.h1>

            {/* Stats Grid */}
            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
                <StatCard
                    icon={<FiUsers className="w-8 h-8" />}
                    title="Total Users"
                    value={stats?.totalUsers || 0}
                    subtitle={`${stats?.totalCustomers || 0} customers • ${stats?.totalVendors || 0} vendors`}
                    color="text-blue-600"
                    bgColor="bg-blue-100 dark:bg-blue-900/30"
                />
                <StatCard
                    icon={<FiPackage className="w-8 h-8" />}
                    title="Total Products"
                    value={stats?.totalProducts || 0}
                    subtitle={`${stats?.activeProducts || 0} active`}
                    color="text-purple-600"
                    bgColor="bg-purple-100 dark:bg-purple-900/30"
                />
                <StatCard
                    icon={<FiShoppingBag className="w-8 h-8" />}
                    title="Total Orders"
                    value={stats?.totalOrders || 0}
                    subtitle={`${stats?.pendingOrders || 0} pending • ${stats?.deliveredOrders || 0} delivered`}
                    color="text-green-600"
                    bgColor="bg-green-100 dark:bg-green-900/30"
                />
                <StatCard
                    icon={<FiDollarSign className="w-8 h-8" />}
                    title="Total Revenue"
                    value={`$${stats?.totalRevenue?.toFixed(2) || '0.00'}`}
                    subtitle="Platform earnings"
                    color="text-yellow-600"
                    bgColor="bg-yellow-100 dark:bg-yellow-900/30"
                />
            </motion.div>

            {/* Quick Actions */}
            <div className="flex gap-4 mb-8">
                <Link to="/admin/users">
                    <Button variant="outline" className="flex items-center gap-2">
                        <FiUsers /> Manage Users
                    </Button>
                </Link>
                <Link to="/admin/products">
                    <Button variant="outline" className="flex items-center gap-2">
                        <FiPackage /> Manage Products
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <Card>
                    <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
                    {recentOrders.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-400">No orders yet</p>
                    ) : (
                        <div className="space-y-3">
                            {recentOrders.map((order) => (
                                <div key={order._id} className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="font-semibold">#{order._id.slice(-8).toUpperCase()}</span>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {order.user?.name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-primary-600">
                                                ${order.totalPrice?.toFixed(2)}
                                            </p>
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${order.status === 'delivered'
                                                ? 'bg-green-100 text-green-600 dark:bg-green-900/30'
                                                : order.status === 'cancelled'
                                                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30'
                                                    : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Top Products */}
                <Card>
                    <h2 className="text-2xl font-bold mb-4">Top Products</h2>
                    {topProducts.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-400">No products yet</p>
                    ) : (
                        <div className="space-y-3">
                            {topProducts.map((product, index) => (
                                <div key={product._id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <span className="text-2xl font-bold text-gray-400 w-8">
                                        #{index + 1}
                                    </span>
                                    <img
                                        src={product.images?.[0] || '/placeholder.png'}
                                        alt={product.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{product.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <span>${product.price}</span>
                                            <span>•</span>
                                            <div className="flex items-center">
                                                <span className="text-yellow-500">★</span>
                                                <span className="ml-1">{product.rating?.toFixed(1)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Sales</p>
                                        <p className="font-bold">{product.totalSales || 0}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, subtitle, color, bgColor }) => (
    <motion.div variants={staggerItem}>
        <Card>
            <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${bgColor} ${color}`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
                    <p className={`text-3xl font-bold ${color} mb-1`}>{value}</p>
                    {subtitle && (
                        <p className="text-xs text-gray-500">{subtitle}</p>
                    )}
                </div>
            </div>
        </Card>
    </motion.div>
);

export default AdminDashboard;
