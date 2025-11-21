import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    FiShoppingCart, FiUser, FiMenu, FiX, FiSun, FiMoon, FiLogOut,
    FiPackage, FiSettings, FiSearch, FiHeart, FiBell, FiChevronDown
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../common/Button';
import api from '../../utils/api';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, logout, isAdmin, isVendor } = useAuth();
    const { getCartCount, cart, getCartTotal } = useCart();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    // Debounce search suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!searchQuery.trim()) {
                setSuggestions([]);
                return;
            }

            setLoadingSuggestions(true);
            try {
                const { data } = await api.get('/products', {
                    params: {
                        search: searchQuery,
                        limit: 5
                    }
                });
                setSuggestions(data.products || []);
            } catch (error) {
                console.error('Failed to fetch suggestions:', error);
            } finally {
                setLoadingSuggestions(false);
            }
        };

        const timeoutId = setTimeout(() => {
            if (searchQuery.trim()) {
                fetchSuggestions();
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSuggestionClick = (productId) => {
        navigate(`/products/${productId}`);
        setShowSuggestions(false);
        setSearchQuery('');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="sticky top-0 z-[100] flex flex-col">
            {/* Top Utility Bar - Daraz Style */}
            <div className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 text-xs py-1 hidden md:block">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-primary-700 dark:text-primary-400">
                        <Link to="/vendor/register" className="hover:underline font-medium">Become a Seller</Link>
                        <Link to="/affiliate" className="hover:underline">Affiliate Program</Link>
                        <Link to="/help" className="hover:underline">Help & Support</Link>
                    </div>
                    <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                        <button className="hover:text-primary-600 flex items-center gap-1">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Flag_of_Pakistan.svg/320px-Flag_of_Pakistan.svg.png" alt="PK" className="w-4 h-3 object-cover" />
                            <span>Save More on App</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <motion.nav
                className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-8">
                        {/* Logo */}
                        <Link to="/" className="flex items-center flex-shrink-0">
                            <motion.div
                                className="text-3xl font-black text-primary-600 tracking-tight"
                                whileHover={{ scale: 1.05 }}
                            >
                                Apexify
                            </motion.div>
                        </Link>

                        {/* Search Bar - Central & Prominent */}
                        <div className="flex-1 max-w-2xl hidden md:block">
                            <form onSubmit={handleSearch} className="relative group">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click
                                    placeholder="Search in Apexify"
                                    className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-lg py-2.5 pl-4 pr-12 focus:ring-2 focus:ring-primary-500 transition-all"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 top-0 h-full px-4 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition-colors"
                                >
                                    <FiSearch className="w-5 h-5" />
                                </button>

                                {/* Search Suggestions Dropdown */}
                                <AnimatePresence>
                                    {showSuggestions && searchQuery.trim() && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
                                        >
                                            {loadingSuggestions ? (
                                                <div className="p-4 text-center text-gray-500 text-sm">
                                                    Loading...
                                                </div>
                                            ) : suggestions.length > 0 ? (
                                                <ul>
                                                    {suggestions.map((product) => (
                                                        <li key={product._id}>
                                                            <button
                                                                onClick={() => handleSuggestionClick(product._id)}
                                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                                                            >
                                                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
                                                                    <img
                                                                        src={product.images?.[0] || '/placeholder.png'}
                                                                        alt={product.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1">
                                                                        {product.name}
                                                                    </p>
                                                                    <p className="text-xs text-primary-600 font-bold">
                                                                        ${product.price}
                                                                    </p>
                                                                </div>
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="p-4 text-center text-gray-500 text-sm">
                                                    No results found
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </div>

                        {/* Desktop Navigation Links */}
                        <div className="hidden lg:flex items-center space-x-6">
                            <Link
                                to="/products"
                                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
                            >
                                Products
                            </Link>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center space-x-3 md:space-x-6">
                            {/* Theme Toggle */}
                            <motion.button
                                onClick={toggleTheme}
                                className="p-2 text-gray-500 hover:text-primary-600"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                            </motion.button>

                            {/* User Actions */}
                            {user ? (
                                <div className="relative group">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-primary-600"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center font-bold border border-primary-200">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="hidden md:block text-left">
                                            <p className="text-xs text-gray-500">Hello,</p>
                                            <p className="text-sm font-bold leading-none">{user.name.split(' ')[0]}</p>
                                        </div>
                                        <FiChevronDown className="w-4 h-4 text-gray-400" />
                                    </button>

                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50"
                                            >
                                                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                                                    <p className="font-bold text-gray-800 dark:text-white">{user.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                </div>
                                                <Link to="/profile" className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200">
                                                    <FiUser className="w-4 h-4" /> <span>My Profile</span>
                                                </Link>
                                                <Link to="/orders" className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200">
                                                    <FiPackage className="w-4 h-4" /> <span>My Orders</span>
                                                </Link>
                                                <Link to="/wishlist" className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200">
                                                    <FiHeart className="w-4 h-4" /> <span>My Wishlist</span>
                                                </Link>
                                                {isAdmin && (
                                                    <Link to="/admin/dashboard" className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-primary-600 font-medium">
                                                        <FiSettings className="w-4 h-4" /> <span>Admin Dashboard</span>
                                                    </Link>
                                                )}
                                                {isVendor && (
                                                    <Link to="/vendor/dashboard" className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-primary-600 font-medium">
                                                        <FiSettings className="w-4 h-4" /> <span>Vendor Dashboard</span>
                                                    </Link>
                                                )}
                                                <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center space-x-3 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left text-red-600 text-sm"
                                                    >
                                                        <FiLogOut className="w-4 h-4" /> <span>Logout</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link to="/login" className="text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-primary-600">Login</Link>
                                    <span className="text-gray-300">|</span>
                                    <Link to="/register" className="text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-primary-600">Sign Up</Link>
                                </div>
                            )}

                            {/* Cart */}
                            <div
                                className="relative z-40"
                                onMouseEnter={() => setIsCartOpen(true)}
                                onMouseLeave={() => setIsCartOpen(false)}
                            >
                                <Link to="/cart" className="relative block p-2">
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <FiShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                                        {getCartCount() > 0 && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute top-0 right-0 bg-primary-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white dark:border-gray-900"
                                            >
                                                {getCartCount()}
                                            </motion.span>
                                        )}
                                    </motion.div>
                                </Link>

                                <AnimatePresence>
                                    {isCartOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                                        >
                                            <div className="p-4">
                                                <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                                                    <h3 className="font-bold text-sm text-gray-500">Recently Added</h3>
                                                    <span className="text-xs font-bold text-primary-600">
                                                        {getCartCount()} Items
                                                    </span>
                                                </div>

                                                {cart.length === 0 ? (
                                                    <div className="text-center py-8">
                                                        <FiShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                                        <p className="text-gray-500 text-sm">Your cart is empty</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="max-h-60 overflow-y-auto space-y-3 mb-4 pr-1 custom-scrollbar">
                                                            {cart.slice(0, 3).map((item) => (
                                                                <div key={item.product._id} className="flex gap-3">
                                                                    <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
                                                                        <img
                                                                            src={item.product.images?.[0] || '/placeholder.png'}
                                                                            alt={item.product.name}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="font-medium text-sm truncate text-gray-800 dark:text-gray-200">{item.product.name}</h4>
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                            Qty: {item.quantity}
                                                                        </p>
                                                                        <p className="font-bold text-primary-600 text-sm">
                                                                            ${(item.product.price * item.quantity).toFixed(2)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="space-y-2">
                                                            <div className="flex justify-between font-bold text-base border-t border-gray-100 dark:border-gray-700 pt-3">
                                                                <span>Total:</span>
                                                                <span className="text-primary-600">${getCartTotal().toFixed(2)}</span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <Link to="/cart" onClick={() => setIsCartOpen(false)}>
                                                                    <Button variant="outline" size="sm" className="w-full">
                                                                        View Cart
                                                                    </Button>
                                                                </Link>
                                                                <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
                                                                    <Button size="sm" className="w-full bg-primary-600 hover:bg-primary-700 border-primary-600">
                                                                        Checkout
                                                                    </Button>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Search - Visible only on mobile */}
                <div className="md:hidden px-4 pb-3">
                    <form onSubmit={handleSearch} className="relative group">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click
                            placeholder="Search in Apexify"
                            className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-lg py-2 pl-4 pr-10"
                        />
                        <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <FiSearch />
                        </button>

                        {/* Search Suggestions Dropdown (Mobile) */}
                        <AnimatePresence>
                            {showSuggestions && searchQuery.trim() && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 mx-4"
                                >
                                    {loadingSuggestions ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            Loading...
                                        </div>
                                    ) : suggestions.length > 0 ? (
                                        <ul>
                                            {suggestions.map((product) => (
                                                <li key={product._id}>
                                                    <button
                                                        onClick={() => handleSuggestionClick(product._id)}
                                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                                                    >
                                                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
                                                            <img
                                                                src={product.images?.[0] || '/placeholder.png'}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1">
                                                                {product.name}
                                                            </p>
                                                            <p className="text-xs text-primary-600 font-bold">
                                                                ${product.price}
                                                            </p>
                                                        </div>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            No results found
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden overflow-hidden border-t border-gray-100 dark:border-gray-700"
                        >
                            <div className="py-2 space-y-1">
                                <MobileNavLink to="/products" onClick={() => setIsMenuOpen(false)}>Products</MobileNavLink>
                                <MobileNavLink to="/wishlist" onClick={() => setIsMenuOpen(false)}>Wishlist</MobileNavLink>
                                {isVendor && <MobileNavLink to="/vendor/dashboard" onClick={() => setIsMenuOpen(false)}>Vendor Dashboard</MobileNavLink>}
                                {isAdmin && <MobileNavLink to="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</MobileNavLink>}
                                {!user && (
                                    <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                                        <MobileNavLink to="/login" onClick={() => setIsMenuOpen(false)}>Login</MobileNavLink>
                                        <MobileNavLink to="/register" onClick={() => setIsMenuOpen(false)}>Sign Up</MobileNavLink>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </div>
    );
};

const MobileNavLink = ({ to, children, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
    >
        {children}
    </Link>
);

export default Navbar;
