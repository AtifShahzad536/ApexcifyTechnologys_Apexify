import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useCart } from '../contexts/CartContext';
import Loading from '../components/common/Loading';

const OrderSuccess = () => {
    const [searchParams] = useSearchParams();
    const { clearCart } = useCart();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const verifyPayment = async () => {
            const sessionId = searchParams.get('session_id');
            const orderId = searchParams.get('order_id');

            if (!sessionId || !orderId) {
                setError('Invalid session details');
                setLoading(false);
                return;
            }

            try {
                const { data } = await api.post('/payment/success', {
                    session_id: sessionId,
                    order_id: orderId
                });

                if (data.success) {
                    setOrder(data.order);
                    clearCart();
                }
            } catch (err) {
                console.error('Payment verification failed:', err);
                setError('Payment verification failed. Please check your orders page.');
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [searchParams, clearCart]);

    if (loading) return <Loading fullScreen />;

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiCheckCircle className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                    <Link to="/orders" className="text-primary-600 hover:text-primary-700 font-medium">
                        Go to Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md w-full text-center"
            >
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiCheckCircle className="w-10 h-10" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Thank you for your purchase. Your order has been confirmed and will be shipped soon.
                </p>

                {order && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-8 text-left">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-500 dark:text-gray-400">Order ID</span>
                            <span className="font-mono font-medium text-gray-900 dark:text-white">#{order._id.slice(-8)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-500 dark:text-gray-400">Amount Paid</span>
                            <span className="font-medium text-gray-900 dark:text-white">${order.totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Status</span>
                            <span className="text-green-500 font-medium capitalize">Paid</span>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    <Link to="/orders">
                        <button className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                            <FiPackage />
                            View Order Details
                        </button>
                    </Link>
                    <Link to="/products">
                        <button className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                            Continue Shopping
                            <FiArrowRight />
                        </button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;
