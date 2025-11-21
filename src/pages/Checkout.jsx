import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiX, FiTag, FiCheck, FiCreditCard, FiTruck, FiPackage } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import { fadeIn, slideUp } from '../utils/animations';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState('');

    const [shippingAddress, setShippingAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');
    const [notes, setNotes] = useState('');

    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shipping = subtotal > 50 ? 0 : 10;
    const tax = subtotal * 0.1;
    const couponDiscount = appliedCoupon?.discount || 0;
    const total = subtotal + shipping + tax - couponDiscount;

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError('Please enter a coupon code');
            return;
        }

        setCouponLoading(true);
        setCouponError('');

        try {
            const { data } = await api.post('/coupons/validate', {
                code: couponCode,
                orderTotal: subtotal,
                cart: cart
            });

            setAppliedCoupon({
                code: data.coupon.code,
                discount: data.discount,
                description: data.coupon.description
            });
            setCouponError('');
        } catch (error) {
            setCouponError(error.response?.data?.message || 'Invalid coupon code');
            setAppliedCoupon(null);
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                items: cart.map(item => ({
                    product: item.product._id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                    image: item.product.images?.[0],
                    vendor: item.product.vendor
                })),
                shippingAddress,
                paymentMethod,
                itemsPrice: subtotal,
                shippingPrice: shipping,
                taxPrice: tax,
                totalPrice: total,
                notes,
                couponCode: appliedCoupon?.code,
                couponDiscount: couponDiscount
            };

            const { data } = await api.post('/orders', orderData);

            // Apply coupon if used
            if (appliedCoupon) {
                await api.post('/coupons/apply', { code: appliedCoupon.code });
            }

            clearCart();
            navigate(`/orders`);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <FiPackage className="w-24 h-24 mx-auto mb-6 text-gray-400" />
                <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
                <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
            <div className="container mx-auto px-4">
                <motion.div {...fadeIn} className="mb-8">
                    <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        Checkout
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Complete your purchase</p>
                </motion.div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left: Forms */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Shipping Address */}
                            <motion.div {...slideUp}>
                                <Card className="p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white">
                                            <FiTruck className="w-6 h-6" />
                                        </div>
                                        <h2 className="text-2xl font-bold">Shipping Address</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <Input
                                                label="Street Address"
                                                required
                                                value={shippingAddress.street}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                                            />
                                        </div>
                                        <Input
                                            label="City"
                                            required
                                            value={shippingAddress.city}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                        />
                                        <Input
                                            label="State"
                                            required
                                            value={shippingAddress.state}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                        />
                                        <Input
                                            label="ZIP Code"
                                            required
                                            value={shippingAddress.zipCode}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                                        />
                                        <Input
                                            label="Country"
                                            required
                                            value={shippingAddress.country}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                                        />
                                    </div>
                                </Card>
                            </motion.div>

                            {/* Payment Method */}
                            <motion.div {...slideUp} transition={{ delay: 0.1 }}>
                                <Card className="p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                                            <FiCreditCard className="w-6 h-6" />
                                        </div>
                                        <h2 className="text-2xl font-bold">Payment Method</h2>
                                    </div>

                                    <div className="space-y-3">
                                        {['Credit Card', 'PayPal', 'Cash on Delivery', 'Stripe'].map((method) => (
                                            <label
                                                key={method}
                                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === method
                                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value={method}
                                                    checked={paymentMethod === method}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="w-5 h-5 text-primary-600"
                                                />
                                                <span className="font-medium">{method}</span>
                                            </label>
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>

                            {/* Order Notes */}
                            <motion.div {...slideUp} transition={{ delay: 0.2 }}>
                                <Card className="p-8">
                                    <h3 className="text-xl font-bold mb-4">Order Notes (Optional)</h3>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Any special instructions?"
                                        className="input w-full h-24 resize-none"
                                    />
                                </Card>
                            </motion.div>
                        </div>

                        {/* Right: Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-20 space-y-6">
                                {/* Coupon Section */}
                                <motion.div {...slideUp} transition={{ delay: 0.3 }}>
                                    <Card className="p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <FiTag className="text-primary-600 w-5 h-5" />
                                            <h3 className="font-bold text-lg">Have a Coupon?</h3>
                                        </div>

                                        {appliedCoupon ? (
                                            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-xl p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <FiCheck className="text-green-600 w-5 h-5" />
                                                            <span className="font-bold text-green-700 dark:text-green-400">
                                                                {appliedCoupon.code}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-green-600 dark:text-green-400">
                                                            {appliedCoupon.description}
                                                        </p>
                                                        <p className="text-lg font-bold text-green-700 dark:text-green-300 mt-2">
                                                            -${appliedCoupon.discount.toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveCoupon}
                                                        className="text-gray-500 hover:text-red-600 transition-colors"
                                                    >
                                                        <FiX className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={couponCode}
                                                        onChange={(e) => {
                                                            setCouponCode(e.target.value.toUpperCase());
                                                            setCouponError('');
                                                        }}
                                                        placeholder="Enter code"
                                                        className="input flex-1"
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={handleApplyCoupon}
                                                        disabled={couponLoading}
                                                        size="sm"
                                                    >
                                                        {couponLoading ? 'Checking...' : 'Apply'}
                                                    </Button>
                                                </div>
                                                {couponError && (
                                                    <p className="text-red-600 text-sm mt-2">{couponError}</p>
                                                )}
                                            </div>
                                        )}
                                    </Card>
                                </motion.div>

                                {/* Order Summary */}
                                <motion.div {...slideUp} transition={{ delay: 0.4 }}>
                                    <Card className="p-6">
                                        <h3 className="text-2xl font-bold mb-6">Order Summary</h3>

                                        {/* Cart Items */}
                                        <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                            {cart.map((item) => (
                                                <div key={item.productId} className="flex gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                                                    <img
                                                        src={item.image || '/placeholder.png'}
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover rounded-lg"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-sm line-clamp-2">{item.name}</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Qty: {item.quantity} × ${item.price}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Price Breakdown */}
                                        <div className="space-y-3 mb-6">
                                            <div className="flex justify-between">
                                                <span>Subtotal ({cart.length} items)</span>
                                                <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Shipping</span>
                                                <span className="font-semibold">
                                                    {shipping === 0 ? (
                                                        <span className="text-green-600">FREE</span>
                                                    ) : (
                                                        `$${shipping.toFixed(2)}`
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Tax (10%)</span>
                                                <span className="font-semibold">${tax.toFixed(2)}</span>
                                            </div>
                                            {appliedCoupon && (
                                                <div className="flex justify-between text-green-600">
                                                    <span>Coupon Discount</span>
                                                    <span className="font-bold">-${couponDiscount.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="pt-3 border-t-2 border-gray-200 dark:border-gray-700">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xl font-bold">Total</span>
                                                    <span className="text-3xl font-black text-primary-600">
                                                        ${total.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Place Order Button */}
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-4 text-lg"
                                            size="lg"
                                        >
                                            {loading ? 'Processing...' : 'Place Order'}
                                        </Button>

                                        <p className="text-xs text-gray-500 text-center mt-4">
                                            By placing your order, you agree to our terms and conditions
                                        </p>
                                    </Card>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
