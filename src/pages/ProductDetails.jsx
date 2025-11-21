import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiShoppingCart, FiStar, FiHeart, FiShare2, FiTruck, FiShield,
    FiRefreshCw, FiCheck, FiX, FiChevronLeft, FiChevronRight,
    FiPackage, FiAward, FiClock, FiMapPin
} from 'react-icons/fi';
import api from '../utils/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

    // Review form state
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        fetchProduct();
        fetchReviews();
    }, [id]);

    // Check if product is in wishlist
    useEffect(() => {
        if (user && product) {
            checkWishlistStatus();
        }
    }, [user, product]);

    const fetchProduct = async () => {
        try {
            const { data } = await api.get(`/products/${id}`);
            setProduct(data.product);

            // Fetch related products
            if (data.product.category) {
                const relatedRes = await api.get(`/products?category=${data.product.category}&limit=4`);
                setRelatedProducts(relatedRes.data.products.filter(p => p._id !== id));
            }
        } catch (error) {
            console.error('Failed to fetch product:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const { data } = await api.get(`/reviews/product/${id}`);
            setReviews(data.reviews || []);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
            toast.error('Failed to load reviews');
        }
    };

    const checkWishlistStatus = async () => {
        try {
            const { data } = await api.get('/wishlist');
            const isProductInWishlist = data.wishlist.products.some(item => item._id === id);
            setIsWishlisted(isProductInWishlist);
        } catch (error) {
            console.error('Failed to check wishlist status:', error);
        }
    };

    const toggleWishlist = async () => {
        if (!user) {
            toast.error('Please login to add items to wishlist');
            return;
        }

        try {
            if (isWishlisted) {
                await api.delete(`/wishlist/${id}`);
                setIsWishlisted(false);
                toast.success('Removed from wishlist');
            } else {
                await api.post(`/wishlist/${id}`);
                setIsWishlisted(true);
                toast.success('Added to wishlist');
            }
        } catch (error) {
            toast.error('Failed to update wishlist');
        }
    };

    const handleShare = async () => {
        try {
            await navigator.share({
                title: product.name,
                text: product.description,
                url: window.location.href,
            });
        } catch (error) {
            // Fallback to clipboard copy
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard');
        }
    };

    const prevImage = () => {
        setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    };

    const nextImage = () => {
        setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        toast.success('Added to cart');
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to submit a review');
            return;
        }
        setSubmittingReview(true);
        try {
            const { data } = await api.post('/reviews', {
                product: id,
                rating: reviewRating,
                comment: reviewComment
            });
            setReviews([data.review, ...reviews]);
            setShowReviewForm(false);
            setReviewComment('');
            setReviewRating(5);
            toast.success('Review submitted successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return <Loading fullScreen />;

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">The product you are looking for does not exist or has been removed.</p>
                    <Link to="/products">
                        <Button>Browse Products</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const discountPercentage = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Breadcrumb */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Link to="/" className="hover:text-primary-600">Home</Link>
                        <span>/</span>
                        <Link to="/products" className="hover:text-primary-600">Products</Link>
                        <span>/</span>
                        {product?.category && (<Link to={`/products?category=${product.category}`} className="hover:text-primary-600">{product.category}</Link>)}
                        <span>/</span>
                        <span className="text-gray-900 dark:text-white font-medium truncate">{product?.name}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column - Images */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-20">
                            {/* Main Image with Navigation */}
                            <motion.div
                                className="relative mb-4 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg group"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {/* Discount Badge */}
                                {discountPercentage > 0 && (
                                    <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                        -{discountPercentage}%
                                    </div>
                                )}

                                {/* Wishlist & Share */}
                                <div className="absolute top-4 right-4 z-10 flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => {
                                            if (isWishlisted) {
                                                navigate('/wishlist');
                                            } else {
                                                toggleWishlist();
                                            }
                                        }}
                                        className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-gray-300'}`} />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleShare}
                                        className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <FiShare2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                    </motion.button>
                                </div>

                                {/* Image */}
                                <div className="aspect-square relative">
                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={selectedImage}
                                            src={product.images?.[selectedImage] || '/placeholder.png'}
                                            alt={product?.name || 'Product image'}
                                            className="w-full h-full object-cover"
                                            initial={{ opacity: 0, x: 100 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </AnimatePresence>

                                    {/* Navigation Arrows */}
                                    {product.images?.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-800"
                                            >
                                                <FiChevronLeft className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-800"
                                            >
                                                <FiChevronRight className="w-6 h-6" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </motion.div>

                            {/* Thumbnail Images */}
                            {product.images?.length > 1 && (
                                <div className="grid grid-cols-5 gap-2">
                                    {product.images.map((img, idx) => (
                                        <motion.button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`rounded-xl overflow-hidden border-3 transition-all ${selectedImage === idx
                                                ? 'border-primary-600 shadow-lg scale-105'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-primary-400'
                                                }`}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full aspect-square object-cover" />
                                        </motion.button>
                                    ))}
                                </div>
                            )}

                            {/* Trust Badges */}
                            <div className="mt-6 grid grid-cols-3 gap-3">
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-sm">
                                    <FiTruck className="w-6 h-6 mx-auto mb-1 text-primary-600" />
                                    <p className="text-xs font-medium">Free Delivery</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-sm">
                                    <FiShield className="w-6 h-6 mx-auto mb-1 text-green-600" />
                                    <p className="text-xs font-medium">Secure Payment</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-sm">
                                    <FiRefreshCw className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                                    <p className="text-xs font-medium">Easy Returns</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Product Info */}
                    <div className="lg:col-span-7">
                        {/* Product Title & Rating */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
                            {/* Category Badge */}
                            <div className="mb-3">
                                <Link
                                    to={`/products?category=${product.category}`}
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                                >
                                    <FiPackage className="w-4 h-4" />
                                    {product.category}
                                </Link>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-black mb-4 text-gray-900 dark:text-white leading-tight">
                                {product.name}
                            </h1>

                            {/* Rating & Reviews */}
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar
                                                key={i}
                                                className={`w-5 h-5 ${i < Math.floor(product.averageRating || 0)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="font-bold text-lg">{product.averageRating?.toFixed(1) || '0.0'}</span>
                                </div>
                                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                                <span className="text-gray-600 dark:text-gray-400">
                                    <span className="font-semibold text-gray-900 dark:text-white">{reviews.length}</span> Reviews
                                </span>
                                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                                <span className="text-gray-600 dark:text-gray-400">
                                    <span className="font-semibold text-gray-900 dark:text-white">{product.salesCount || 0}</span> Sold
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-4">
                                <span className="text-5xl font-black text-primary-600">
                                    ${product.price}
                                </span>
                                {product.originalPrice && (
                                    <span className="text-2xl text-gray-400 line-through">
                                        ${product.originalPrice}
                                    </span>
                                )}
                                {discountPercentage > 0 && (
                                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-bold">
                                        Save {discountPercentage}%
                                    </span>
                                )}
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center gap-2 mb-6">
                                {product.stock > 0 ? (
                                    <>
                                        <FiCheck className="w-5 h-5 text-green-600" />
                                        <span className="text-green-600 font-semibold">
                                            In Stock ({product.stock} available)
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <FiX className="w-5 h-5 text-red-600" />
                                        <span className="text-red-600 font-semibold">Out of Stock</span>
                                    </>
                                )}
                            </div>

                            {/* Quantity & Add to Cart */}
                            {product.stock > 0 && (
                                <div className="flex flex-wrap gap-4">
                                    {/* Quantity Selector */}
                                    <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-5 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-bold text-xl"
                                        >
                                            -
                                        </button>
                                        <span className="px-8 py-3 border-x-2 border-gray-300 dark:border-gray-600 font-bold text-lg min-w-[80px] text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            className="px-5 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-bold text-xl"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <Button
                                        onClick={handleAddToCart}
                                        className="flex-1 py-4 text-lg font-bold shadow-lg hover:shadow-xl"
                                    >
                                        <FiShoppingCart className="inline mr-2 w-5 h-5" />
                                        Add to Cart
                                    </Button>

                                    {/* Buy Now Button */}
                                    <Button
                                        onClick={() => {
                                            handleAddToCart();
                                            navigate('/checkout');
                                        }}
                                        variant="outline"
                                        className="flex-1 py-4 text-lg font-bold border-2"
                                    >
                                        Buy Now
                                    </Button>
                                </div>
                            )}

                            {/* Vendor Info */}
                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xl">
                                        {product.vendor?.vendorInfo?.storeName?.charAt(0) || 'S'}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Sold by</p>
                                        <p className="font-bold text-lg">{product.vendor?.vendorInfo?.storeName || product.vendor?.name}</p>
                                    </div>
                                    <Button variant="outline" size="sm" className="ml-auto">
                                        Visit Store
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Tabs Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                            {/* Tab Headers */}
                            <div className="flex border-b border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => setActiveTab('description')}
                                    className={`flex-1 px-6 py-4 font-bold transition-colors ${activeTab === 'description'
                                        ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    Description
                                </button>
                                <button
                                    onClick={() => setActiveTab('specifications')}
                                    className={`flex-1 px-6 py-4 font-bold transition-colors ${activeTab === 'specifications'
                                        ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    Specifications
                                </button>
                                <button
                                    onClick={() => setActiveTab('reviews')}
                                    className={`flex-1 px-6 py-4 font-bold transition-colors ${activeTab === 'reviews'
                                        ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    Reviews ({reviews.length})
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'description' && (
                                        <motion.div
                                            key="description"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="prose dark:prose-invert max-w-none"
                                        >
                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                                                {product.description}
                                            </p>
                                            {product.features && (
                                                <div className="mt-6">
                                                    <h3 className="text-xl font-bold mb-3">Key Features:</h3>
                                                    <ul className="space-y-2">
                                                        {product.features.map((feature, idx) => (
                                                            <li key={idx} className="flex items-start gap-2">
                                                                <FiCheck className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                                                <span>{feature}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {activeTab === 'specifications' && (
                                        <motion.div
                                            key="specifications"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                        >
                                            {product.specifications && Object.keys(product.specifications).length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {Object.entries(product.specifications).map(([key, value]) => (
                                                        <div key={key} className="flex justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                                            <span className="font-semibold text-gray-700 dark:text-gray-300">{key}:</span>
                                                            <span className="text-gray-900 dark:text-white">{value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-600 dark:text-gray-400">No specifications available.</p>
                                            )}
                                        </motion.div>
                                    )}

                                    {activeTab === 'reviews' && (
                                        <motion.div
                                            key="reviews"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                        >
                                            {/* Write Review Button */}
                                            {user && !showReviewForm && (
                                                <div className="mb-6">
                                                    <Button
                                                        onClick={() => setShowReviewForm(true)}
                                                        className="w-full md:w-auto"
                                                    >
                                                        <FiStar className="inline mr-2" />
                                                        Write a Review
                                                    </Button>
                                                </div>
                                            )}

                                            {/* Review Form */}
                                            <AnimatePresence>
                                                {showReviewForm && (
                                                    <motion.form
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        onSubmit={handleSubmitReview}
                                                        className="mb-8 p-6 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-2xl border-2 border-primary-200 dark:border-primary-800"
                                                    >
                                                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                                            <FiStar className="text-primary-600" />
                                                            Write Your Review
                                                        </h3>

                                                        {/* Star Rating Selector */}
                                                        <div className="mb-6">
                                                            <label className="block text-sm font-bold mb-3 text-gray-700 dark:text-gray-300">
                                                                Your Rating *
                                                            </label>
                                                            <div className="flex items-center gap-2">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <motion.button
                                                                        key={star}
                                                                        type="button"
                                                                        onClick={() => setReviewRating(star)}
                                                                        whileHover={{ scale: 1.2 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        className="focus:outline-none"
                                                                    >
                                                                        <FiStar
                                                                            className={`w-10 h-10 transition-all ${star <= reviewRating
                                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                                : 'text-gray-300 hover:text-yellow-200'
                                                                                }`}
                                                                        />
                                                                    </motion.button>
                                                                ))}
                                                                <span className="ml-3 text-lg font-bold text-gray-700 dark:text-gray-300">
                                                                    {reviewRating} {reviewRating === 1 ? 'Star' : 'Stars'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Comment Textarea */}
                                                        <div className="mb-6">
                                                            <label className="block text-sm font-bold mb-3 text-gray-700 dark:text-gray-300">
                                                                Your Review *
                                                            </label>
                                                            <textarea
                                                                value={reviewComment}
                                                                onChange={(e) => setReviewComment(e.target.value)}
                                                                placeholder="Share your experience with this product..."
                                                                rows="5"
                                                                required
                                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none transition-all resize-none"
                                                            />
                                                            <p className="text-sm text-gray-500 mt-2">
                                                                Minimum 10 characters
                                                            </p>
                                                        </div>

                                                        {/* Submit Buttons */}
                                                        <div className="flex gap-3">
                                                            <Button
                                                                type="submit"
                                                                disabled={submittingReview}
                                                                className="flex-1"
                                                            >
                                                                {submittingReview ? (
                                                                    <>
                                                                        <motion.div
                                                                            animate={{ rotate: 360 }}
                                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                                            className="inline-block mr-2"
                                                                        >
                                                                            <FiRefreshCw className="w-5 h-5" />
                                                                        </motion.div>
                                                                        Submitting...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <FiCheck className="inline mr-2" />
                                                                        Submit Review
                                                                    </>
                                                                )}
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setShowReviewForm(false);
                                                                    setReviewComment('');
                                                                    setReviewRating(5);
                                                                }}
                                                                disabled={submittingReview}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </motion.form>
                                                )}
                                            </AnimatePresence>

                                            {/* Reviews List */}
                                            {reviews.length === 0 ? (
                                                <div className="text-center py-12">
                                                    <FiStar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                                                        No reviews yet. Be the first to review!
                                                    </p>
                                                    {!user && (
                                                        <Button onClick={() => navigate('/login')}>
                                                            Login to Write a Review
                                                        </Button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {reviews.map((review) => (
                                                        <motion.div
                                                            key={review._id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="p-5 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-md transition-shadow"
                                                        >
                                                            <div className="flex items-start gap-4">
                                                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg">
                                                                    {review.user?.name?.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <div>
                                                                            <p className="font-bold text-lg text-gray-900 dark:text-white">
                                                                                {review.user?.name}
                                                                            </p>
                                                                            <div className="flex items-center gap-1 mt-1">
                                                                                {[...Array(5)].map((_, i) => (
                                                                                    <FiStar
                                                                                        key={i}
                                                                                        className={`w-4 h-4 ${i < review.rating
                                                                                            ? 'fill-yellow-400 text-yellow-400'
                                                                                            : 'text-gray-300'
                                                                                            }`}
                                                                                    />
                                                                                ))}
                                                                                <span className="ml-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                                                                                    {review.rating}.0
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                                                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                                                year: 'numeric',
                                                                                month: 'long',
                                                                                day: 'numeric'
                                                                            })}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                                                                        {review.comment}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Related Products */}
                        {relatedProducts.length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-2xl font-bold mb-4">You May Also Like</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {relatedProducts.map((relProduct) => (
                                        <Link
                                            key={relProduct._id}
                                            to={`/products/${relProduct._id}`}
                                            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow group"
                                        >
                                            <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                                                <img
                                                    src={relProduct.images?.[0] || '/placeholder.png'}
                                                    alt={relProduct.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="p-3">
                                                <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
                                                    {relProduct.name}
                                                </h3>
                                                <p className="text-primary-600 font-bold">${relProduct.price}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
