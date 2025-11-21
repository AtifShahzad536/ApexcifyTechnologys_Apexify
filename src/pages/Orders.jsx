import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiTruck, FiCheckCircle, FiClock } from 'react-icons/fi';
import api from '../utils/api';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import { staggerContainer, staggerItem } from '../utils/animations';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            setOrders(data.orders || []);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <FiClock className="w-5 h-5 text-yellow-500" />;
            case 'processing':
                return <FiPackage className="w-5 h-5 text-blue-500" />;
            case 'shipped':
                return <FiTruck className="w-5 h-5 text-purple-500" />;
            case 'delivered':
                return <FiCheckCircle className="w-5 h-5 text-green-500" />;
            default:
                return <FiPackage className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
            case 'processing':
                return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
            case 'shipped':
                return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
            case 'delivered':
                return 'text-green-600 bg-green-50 dark:bg-green-900/20';
            case 'cancelled':
                return 'text-red-600 bg-red-50 dark:bg-red-900/20';
            default:
                return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
        }
    };

    if (loading) return <Loading fullScreen />;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">My Orders</h1>

            {orders.length === 0 ? (
                <Card className="text-center py-12">
                    <FiPackage className="w-24 h-24 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Start shopping to see your orders here
                    </p>
                    <Link
                        to="/products"
                        className="btn btn-primary inline-block"
                    >
                        Browse Products
                    </Link>
                </Card>
            ) : (
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="space-y-4"
                >
                    {orders.map((order) => (
                        <motion.div key={order._id} variants={staggerItem}>
                            <Link to={`/orders/${order._id}`}>
                                <Card hover>
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        {/* Order Number & Date */}
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg mb-1">
                                                Order #{order._id.slice(-8).toUpperCase()}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        {/* Items Count */}
                                        <div className="flex items-center gap-2">
                                            <FiPackage className="w-5 h-5 text-gray-400" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>

                                        {/* Total Amount */}
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                                            <p className="font-bold text-lg text-primary-600">
                                                ${order.totalPrice.toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Status */}
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(order.status)}
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Items Preview */}
                                    <div className="mt-4 flex gap-2 overflow-x-auto">
                                        {order.items.slice(0, 4).map((item, idx) => (
                                            <img
                                                key={idx}
                                                src={item.product?.images?.[0] || '/placeholder.png'}
                                                alt={item.product?.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        ))}
                                        {order.items.length > 4 && (
                                            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-sm font-semibold">
                                                +{order.items.length - 4}
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default Orders;
