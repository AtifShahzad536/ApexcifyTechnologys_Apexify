import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiTrash2, FiX } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import api from '../utils/api';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { fadeIn, slideUp, staggerContainer } from '../utils/animations';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const { data } = await api.get('/wishlist');
            setWishlist(data.wishlist?.products || []);
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
            toast.error('Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await api.delete(`/wishlist/${productId}`);
            setWishlist(wishlist.filter(p => p._id !== productId));
            toast.success('Removed from wishlist');
        } catch (error) {
            toast.error('Failed to remove from wishlist');
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm('Remove all items from your wishlist?')) return;

        try {
            await api.delete('/wishlist');
            setWishlist([]);
            toast.success('Wishlist cleared');
        } catch (error) {
            toast.error('Failed to clear wishlist');
        }
    };

    const handleAddToCart = (product) => {
        addToCart({
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0],
            stock: product.stock,
            vendor: product.vendor
        });
        toast.success('Added to cart');
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div {...fadeIn} className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center text-white">
                                <FiHeart className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-5xl font-black bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                                    My Wishlist
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                    {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                                </p>
                            </div>
                        </div>

                        {wishlist.length > 0 && (
                            <Button
                                onClick={handleClearAll}
                                variant="outline"
                                className="border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <FiTrash2 className="mr-2" />
                                Clear All
                            </Button>
                        )}
                    </div>
                </motion.div>

                {wishlist.length === 0 ? (
                    <motion.div {...fadeIn} className="text-center py-20">
                        <div className="w-32 h-32 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <FiHeart className="w-16 h-16 text-gray-400" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Your wishlist is empty</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                            Save items you love for later
                        </p>
                        <Link to="/products">
                            <Button size="lg">Discover Products</Button>
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {wishlist.map((product, index) => (
                            <motion.div
                                key={product._id}
                                variants={slideUp}
                                custom={index}
                                className="group relative"
                            >
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-200 dark:border-gray-700">
                                    {/* Remove Button */}
                                    <button
                                        onClick={() => handleRemove(product._id)}
                                        className="absolute top-3 right-3 z-10 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:bg-red-500 hover:text-white transition-all shadow-lg group/btn"
                                    >
                                        <FiX className="w-5 h-5" />
                                    </button>

                                    {/* Image */}
                                    <Link to={`/products/${product._id}`}>
                                        <div className="relative pb-[100%] overflow-hidden bg-gray-200 dark:bg-gray-700">
                                            <img
                                                src={product.images?.[0] || '/placeholder.png'}
                                                alt={product.name}
                                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                    </Link>

                                    {/* Content */}
                                    <div className="p-5">
                                        <Link to={`/products/${product._id}`}>
                                            <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                                                {product.name}
                                            </h3>
                                        </Link>

                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className={`w-4 h-4 ${i < Math.floor(product.averageRating || 0)
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'fill-gray-300 text-gray-300'
                                                            }`}
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                ({product.averageRating?.toFixed(1) || '0.0'})
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-3xl font-black text-primary-600">
                                                ${product.price}
                                            </span>
                                            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>

                                        <Button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={product.stock === 0}
                                            className="w-full"
                                        >
                                            <FiShoppingCart className="mr-2" />
                                            Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
