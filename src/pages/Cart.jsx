import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { slideUp, staggerContainer, staggerItem } from '../utils/animations';

const Cart = () => {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <motion.div {...slideUp}>
                    <FiShoppingCart className="w-24 h-24 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Start shopping to add items to your cart
                    </p>
                    <Button onClick={() => navigate('/products')}>
                        Browse Products
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.h1 {...slideUp} className="text-4xl font-bold mb-8">
                Shopping Cart
            </motion.h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="lg:col-span-2"
                >
                    {cart.map((item) => (
                        <motion.div key={item.product._id} variants={staggerItem}>
                            <Card className="mb-4">
                                <div className="flex gap-4">
                                    {/* Product Image */}
                                    <img
                                        src={item.product.images?.[0] || '/placeholder.png'}
                                        alt={item.product.name}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />

                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-2">{item.product.name}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                            ${item.product.price} each
                                        </p>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                                                <button
                                                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                                    className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 py-1 border-x border-gray-300 dark:border-gray-600">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                                    className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                    disabled={item.quantity >= item.product.stock}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                onClick={() => removeFromCart(item.product._id)}
                                                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <FiTrash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Item Total */}
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-primary-600">
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}

                    {/* Clear Cart */}
                    <Button variant="ghost" onClick={clearCart} className="text-red-600">
                        Clear Cart
                    </Button>
                </motion.div>

                {/* Order Summary */}
                <motion.div {...slideUp}>
                    <Card className="sticky top-20">
                        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                <span className="font-semibold">${getCartTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                                <span className="font-semibold">Calculated at checkout</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                                <span className="font-semibold">Calculated at checkout</span>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                <div className="flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span className="text-primary-600">${getCartTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <Button onClick={() => navigate('/checkout')} className="w-full mb-3">
                            Proceed to Checkout
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/products')}
                            className="w-full"
                        >
                            Continue Shopping
                        </Button>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Cart;
