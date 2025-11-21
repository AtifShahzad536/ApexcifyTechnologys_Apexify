import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiSearch, FiX, FiStar, FiHeart, FiGrid, FiList, FiShoppingCart,
    FiFilter, FiChevronDown, FiTrendingUp, FiTag, FiZap
} from 'react-icons/fi';
import api from '../utils/api';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const Products = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [minRating, setMinRating] = useState(0);
    const [sort, setSort] = useState('-createdAt');
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid');

    // Read search query from URL params (from header search)
    useEffect(() => {
        const urlSearch = searchParams.get('search');
        if (urlSearch) {
            setSearch(urlSearch);
            setDebouncedSearch(urlSearch);
        }
    }, [searchParams]);

    // Debounce search input for better performance (like Google)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300); // 300ms delay

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [debouncedSearch, selectedCategory, priceRange, minRating, sort]);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/products/categories/list');
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = {};
            if (debouncedSearch) params.search = debouncedSearch;
            if (selectedCategory) params.category = selectedCategory;
            if (priceRange[0] > 0) params.minPrice = priceRange[0];
            if (priceRange[1] < 5000) params.maxPrice = priceRange[1];
            if (sort) params.sort = sort;

            const { data } = await api.get('/products', { params });

            let filtered = data.products || [];
            if (minRating > 0) {
                filtered = filtered.filter(p => (p.averageRating || 0) >= minRating);
            }

            setProducts(filtered);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedCategory('');
        setPriceRange([0, 5000]);
        setMinRating(0);
        setSort('-createdAt');
    };

    const activeFiltersCount = [
        search,
        selectedCategory,
        priceRange[0] > 0 || priceRange[1] < 5000,
        minRating > 0,
        sort !== '-createdAt'
    ].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Enhanced Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-md">
                <div className="container mx-auto px-6 py-4">

                    {/* Enhanced Controls Bar - Single Row Premium Design */}
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Filter Button with Gradient */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="relative px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl font-semibold group"
                        >
                            <FiFilter className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            <span className="hidden sm:inline">Filters</span>
                            {activeFiltersCount > 0 && (
                                <span className="ml-1 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>

                        {/* Active Filter Pills */}
                        {selectedCategory && (
                            <motion.span
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium border border-primary-200 dark:border-primary-800 shadow-sm"
                            >
                                <FiTag className="w-3.5 h-3.5" />
                                <span className="font-semibold">{selectedCategory}</span>
                                <button
                                    onClick={() => setSelectedCategory('')}
                                    className="ml-1 hover:bg-primary-200 dark:hover:bg-primary-700 rounded-full p-0.5 transition-colors"
                                >
                                    <FiX className="w-3.5 h-3.5" />
                                </button>
                            </motion.span>
                        )}

                        {minRating > 0 && (
                            <motion.span
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-800/20 text-yellow-700 dark:text-yellow-300 rounded-lg text-sm font-medium border border-yellow-200 dark:border-yellow-800 shadow-sm"
                            >
                                <FiStar className="w-3.5 h-3.5 fill-current" />
                                <span className="font-semibold">{minRating}+ ⭐</span>
                                <button
                                    onClick={() => setMinRating(0)}
                                    className="ml-1 hover:bg-yellow-200 dark:hover:bg-yellow-700 rounded-full p-0.5 transition-colors"
                                >
                                    <FiX className="w-3.5 h-3.5" />
                                </button>
                            </motion.span>
                        )}

                        {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                            <motion.span
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-800/20 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium border border-green-200 dark:border-green-800 shadow-sm"
                            >
                                <FiZap className="w-3.5 h-3.5" />
                                <span className="font-semibold">${priceRange[0]} - ${priceRange[1]}</span>
                                <button
                                    onClick={() => setPriceRange([0, 5000])}
                                    className="ml-1 hover:bg-green-200 dark:hover:bg-green-700 rounded-full p-0.5 transition-colors"
                                >
                                    <FiX className="w-3.5 h-3.5" />
                                </button>
                            </motion.span>
                        )}

                        {/* Clear All Button */}
                        {activeFiltersCount > 0 && (
                            <motion.button
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                onClick={clearFilters}
                                className="px-4 py-2 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-800/20 text-red-700 dark:text-red-300 rounded-lg text-sm font-semibold hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900/50 dark:hover:to-pink-800/40 transition-all border border-red-200 dark:border-red-800 shadow-sm"
                            >
                                Clear All
                            </motion.button>
                        )}

                        {/* Spacer */}
                        <div className="flex-1 min-w-[20px]"></div>

                        {/* View Toggle - Premium Design */}
                        <div className="flex bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-1 shadow-inner border border-gray-200 dark:border-gray-600">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 font-medium ${viewMode === 'grid'
                                    ? 'bg-gradient-to-r from-white to-gray-50 dark:from-gray-600 dark:to-gray-500 shadow-md text-primary-600 dark:text-primary-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-600/50'
                                    }`}
                            >
                                <FiGrid className="w-4 h-4" />
                                <span className="hidden md:inline text-sm">Grid</span>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 font-medium ${viewMode === 'list'
                                    ? 'bg-gradient-to-r from-white to-gray-50 dark:from-gray-600 dark:to-gray-500 shadow-md text-primary-600 dark:text-primary-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-600/50'
                                    }`}
                            >
                                <FiList className="w-4 h-4" />
                                <span className="hidden md:inline text-sm">List</span>
                            </button>
                        </div>
                    </div>

                    {/* Enhanced Horizontal Filter Bar */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {/* Categories */}
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-700 dark:text-gray-300">
                                                <FiTag className="w-4 h-4 text-primary-600" />
                                                Category
                                            </label>
                                            <select
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none font-medium transition-all"
                                            >
                                                <option value="">All Categories</option>
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Price Range */}
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-700 dark:text-gray-300">
                                                <FiZap className="w-4 h-4 text-primary-600" />
                                                Max Price: <span className="text-primary-600">${priceRange[1]}</span>
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="5000"
                                                step="50"
                                                value={priceRange[1]}
                                                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                                className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                            />
                                            <div className="flex justify-between mt-2 text-xs text-gray-500">
                                                <span>$0</span>
                                                <span>$5000</span>
                                            </div>
                                        </div>

                                        {/* Rating */}
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-700 dark:text-gray-300">
                                                <FiStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                Min Rating
                                            </label>
                                            <select
                                                value={minRating}
                                                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none font-medium transition-all"
                                            >
                                                <option value="0">All Ratings</option>
                                                <option value="3">⭐⭐⭐ 3+ Stars</option>
                                                <option value="4">⭐⭐⭐⭐ 4+ Stars</option>
                                                <option value="4.5">⭐⭐⭐⭐⭐ 4.5+ Stars</option>
                                            </select>
                                        </div>

                                        {/* Sort */}
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-700 dark:text-gray-300">
                                                <FiTrendingUp className="w-4 h-4 text-primary-600" />
                                                Sort By
                                            </label>
                                            <select
                                                value={sort}
                                                onChange={(e) => setSort(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none font-medium transition-all"
                                            >
                                                <option value="-createdAt">🆕 Newest First</option>
                                                <option value="price">💰 Price: Low to High</option>
                                                <option value="-price">💎 Price: High to Low</option>
                                                <option value="-averageRating">⭐ Top Rated</option>
                                                <option value="-salesCount">🔥 Best Selling</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Products Section */}
            <div className="container mx-auto px-6 py-8">
                {/* Results Count */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {loading ? 'Loading...' : `${products.length} Products`}
                    </h2>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loading />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold mb-2">No products found</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Try adjusting your filters or search term
                        </p>
                        <Button onClick={clearFilters}>Clear Filters</Button>
                    </div>
                ) : (
                    <div className={
                        viewMode === 'grid'
                            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'
                            : 'space-y-4'
                    }>
                        {products.map((product, index) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                            >
                                <ProductCard product={product} viewMode={viewMode} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Compact Product Card Component
const ProductCard = ({ product, viewMode }) => {
    const { user } = useAuth();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const toggleWishlist = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to add items to wishlist');
            return;
        }

        try {
            // Since we don't have initial status, we'll assume add for now or check if we can get status
            // For this fix, we'll use the endpoint that handles adding. 
            // If the backend supports toggle on the same endpoint or we need to check status first.
            // The backend addToWishlist (POST /:id) adds, and returns 400 if already exists.
            // So we should try to add, and if 400, maybe try to remove? 
            // Or better, just try to add and handle the "already in wishlist" message.

            // However, the user wants it to work. The previous fix in ProductDetails used:
            // if (isWishlisted) delete else post. 
            // But here we don't know isWishlisted initially.
            // For now, I will implement the POST call which was the specific request ("check endpoint").

            await api.post(`/wishlist/${product._id}`);
            setIsWishlisted(true);
            toast.success('Added to wishlist');
        } catch (error) {
            if (error.response?.status === 400) {
                // If already in wishlist, maybe we want to remove it?
                // Or just notify. For a toggle button, users expect toggle.
                try {
                    await api.delete(`/wishlist/${product._id}`);
                    setIsWishlisted(false);
                    toast.success('Removed from wishlist');
                } catch (delError) {
                    toast.error('Failed to update wishlist');
                }
            } else {
                toast.error('Failed to add to wishlist');
            }
        }
    };

    if (viewMode === 'list') {
        return (
            <Link to={`/products/${product._id}`}>
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 flex gap-4"
                >
                    <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                        {!imageLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                        <img
                            src={product.images?.[0] || '/placeholder.png'}
                            alt={product.name}
                            onLoad={() => setImageLoaded(true)}
                            className={`w-full h-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg mb-1 line-clamp-2 hover:text-primary-600 transition-colors">
                            {product.name}
                        </h3>
                        <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <FiStar
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(product.averageRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                            ))}
                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                                ({product.averageRating?.toFixed(1) || '0.0'})
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-black text-primary-600">
                                ${product.price}
                            </span>
                            {product.stock > 0 && product.stock <= 10 && (
                                <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                                    Only {product.stock} left
                                </span>
                            )}
                        </div>
                    </div>
                </motion.div>
            </Link>
        );
    }

    // Grid View - Compact Card
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="group"
        >
            <Link to={`/products/${product._id}`}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 overflow-hidden h-full flex flex-col">
                    {/* Image */}
                    <div className="relative pb-[100%] overflow-hidden bg-gray-100 dark:bg-gray-700">
                        {!imageLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                        <img
                            src={product.images?.[0] || '/placeholder.png'}
                            alt={product.name}
                            onLoad={() => setImageLoaded(true)}
                            className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        />

                        {/* Wishlist & Badges */}
                        <button
                            onClick={toggleWishlist}
                            className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform shadow-md"
                        >
                            <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                        </button>

                        {product.featured && (
                            <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                                ⭐ Hot
                            </div>
                        )}

                        {product.stock > 0 && product.stock <= 10 && (
                            <div className="absolute bottom-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                                🔥 {product.stock} left
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-3 flex-1 flex flex-col">
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors min-h-[2.5rem]">
                            {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <FiStar
                                    key={i}
                                    className={`w-3 h-3 ${i < Math.floor(product.averageRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                            ))}
                            <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                                {product.averageRating?.toFixed(1) || '0.0'}
                            </span>
                        </div>

                        {/* Price & Stock */}
                        <div className="mt-auto">
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-black text-primary-600">
                                    ${product.price}
                                </span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${product.stock > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                    {product.stock > 0 ? 'In Stock' : 'Out'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default Products;
