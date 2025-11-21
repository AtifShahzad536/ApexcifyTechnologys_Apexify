import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiMapPin, FiCreditCard, FiClock } from 'react-icons/fi';
import api from '../utils/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { toast } from 'react-hot-toast';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            const { data } = await api.get(`/orders/${id}`);
            setOrder(data.order);
        } catch (error) {
            console.error('Failed to fetch order details:', error);
            toast.error('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading fullScreen />;

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
                <Link to="/orders">
                    <Button>Back to Orders</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/orders" className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6">
                <FiArrowLeft className="mr-2" /> Back to Orders
            </Link>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    <Card>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                            <div>
                                <h1 className="text-2xl font-bold mb-1">Order #{order._id.slice(-8).toUpperCase()}</h1>
                                <p className="text-gray-500 text-sm">
                                    Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold capitalize ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                                        order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-blue-100 text-blue-700'
                                    }`}>
                                    {order.orderStatus}
                                </span>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item._id} className="flex gap-4 py-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.product?.images?.[0] || '/placeholder.png'}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Link to={`/products/${item.product?._id}`} className="font-medium hover:text-primary-600 transition-colors">
                                            {item.name}
                                        </Link>
                                        <p className="text-sm text-gray-500 mt-1">Vendor: {item.vendor?.name || 'Apexify'}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                            <p className="font-bold">${item.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="lg:w-1/3 space-y-6">
                    <Card>
                        <h3 className="font-bold text-lg mb-4 flex items-center">
                            <FiPackage className="mr-2" /> Order Summary
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>${order.itemsPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span>${order.shippingPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax</span>
                                <span>${order.taxPrice.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="text-primary-600">${order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="font-bold text-lg mb-4 flex items-center">
                            <FiMapPin className="mr-2" /> Shipping Address
                        </h3>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-medium text-gray-900 dark:text-white">{order.customer?.name}</p>
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                            <p>{order.shippingAddress.country}</p>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="font-bold text-lg mb-4 flex items-center">
                            <FiCreditCard className="mr-2" /> Payment Info
                        </h3>
                        <div className="text-sm text-gray-600 space-y-2">
                            <div className="flex justify-between">
                                <span>Method:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <span className={`capitalize font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                                    }`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
