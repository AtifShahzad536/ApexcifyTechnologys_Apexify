import { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiShoppingBag, FiDollarSign, FiTrendingUp, FiPlus, FiArrowRight } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../../utils/api';
import Loading from '../../components/common/Loading';
import { fadeIn, slideUp, staggerContainer } from '../../utils/animations';

const StatCard = ({ title, value, icon, trend, color }) => (
    <motion.div
        variants={slideUp}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                <div className={`text-2xl ${color.replace('bg-', 'text-')}`}>
                    {icon}
                </div>
            </div>
            {trend && (
                <div className="flex items-center gap-1 text-green-500 text-sm font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                    <FiTrendingUp />
                    {trend}
                </div>
            )}
        </div>
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
    </motion.div>
);

const VendorDashboard = () => {
    const [stats, setStats] = useState(null);
    const [charts, setCharts] = useState({ revenueData: [], salesData: [] });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const { data } = await api.get('/vendor/dashboard');
            setStats(data.stats);
            setCharts(data.charts || { revenueData: [], salesData: [] });
            setRecentOrders(data.recentOrders || []);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading fullScreen />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <motion.div {...fadeIn} className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400">Welcome back to your store overview</p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/vendor/products">
                            <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
                                Manage Products
                            </button>
                        </Link>
                        <Link to="/vendor/add-product">
                            <Button>
                                <FiPlus className="mr-2" />
                                Add Product
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <StatCard
                        title="Total Revenue"
                        value={`$${Number(stats?.totalRevenue || 0).toFixed(2)}`}
                        icon={<FiDollarSign />}
                        color="bg-green-500"
                        trend="+12.5%"
                    />
                    <StatCard
                        title="Total Orders"
                        value={stats?.totalOrders || 0}
                        icon={<FiShoppingBag />}
                        color="bg-blue-500"
                        trend="+8.2%"
                    />
                    <StatCard
                        title="Total Products"
                        value={stats?.totalProducts || 0}
                        icon={<FiPackage />}
                        color="bg-purple-500"
                    />
                    <StatCard
                        title="Average Rating"
                        value={stats?.averageRating?.toFixed(1) || '0.0'}
                        icon={<FiTrendingUp />}
                        color="bg-orange-500"
                    />
                </motion.div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Chart */}
                    <motion.div
                        {...slideUp}
                        className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                    >
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Revenue Overview</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={charts.revenueData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#4F46E5"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Sales by Category */}
                    <motion.div
                        {...slideUp}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                    >
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Sales by Category</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={charts.salesData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                {/* Recent Orders */}
                <motion.div
                    {...slideUp}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h3>
                        <Link to="/vendor/orders" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 text-sm">
                            View All <FiArrowRight />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {recentOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-sm text-gray-600 dark:text-gray-400">
                                            #{order._id.slice(-6)}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {order.user?.name || 'Guest'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            ${(order.totalAmount || order.totalPrice || 0).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                    order.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default VendorDashboard;
