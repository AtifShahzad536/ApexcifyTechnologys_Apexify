import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiChevronRight, FiSearch, FiStar, FiHeart, FiGrid, FiList, FiSliders } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import AdBanner from '../components/common/AdBanner';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import PopupAd from '../components/common/PopupAd';

const Home = () => {
    const navigate = useNavigate();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentBanner, setCurrentBanner] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [minRating, setMinRating] = useState(0);
    const [sort, setSort] = useState('-createdAt');
    const [timeLeft, setTimeLeft] = useState({
        hours: 12,
        minutes: 0,
        seconds: 0
    });

    const banners = [
        {
            id: 1,
            title: "11.11 Biggest Sale",
            subtitle: "Up to 80% Off",
            color: "from-primary-500 to-primary-700",
            image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        },
        {
            id: 2,
            title: "Tech Revolution",
            subtitle: "Latest Gadgets",
            color: "from-blue-500 to-cyan-600",
            image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        },
        {
            id: 3,
            title: "Fashion Week",
            subtitle: "New Arrivals",
            color: "from-purple-500 to-pink-600",
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        },
    ];

    useEffect(() => {
        fetchData();
        const timer = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                } else {
                    // Reset for demo
                    return { hours: 12, minutes: 0, seconds: 0 };
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const fetchData = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                api.get('/products?featured=true&limit=18'),
                api.get('/products/categories/list'),
            ]);
            setFeaturedProducts(productsRes.data.products || []);
            setCategories(categoriesRes.data.categories || []);

            const bestRes = await api.get('/products?sort=-averageRating&limit=12');
            setBestSellers(bestRes.data.products || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
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
        sort !== '-createdAt',
    ].filter(Boolean).length;

    const getCategoryIcon = (category, className = "w-full h-full") => {
        const iconProps = { className };
        const icons = {
            Electronics: <FiMenu {...iconProps} />, // placeholder icons
            Clothing: <FiMenu {...iconProps} />, // placeholder
            "Home & Garden": <FiMenu {...iconProps} />, // placeholder
            Sports: <FiMenu {...iconProps} />, // placeholder
            Books: <FiMenu {...iconProps} />, // placeholder
            Food: <FiMenu {...iconProps} />, // placeholder
            Toys: <FiMenu {...iconProps} />, // placeholder
            Beauty: <FiMenu {...iconProps} />, // placeholder
            Other: <FiMenu {...iconProps} />, // placeholder
        };
        return icons[category] || <FiMenu {...iconProps} />;
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <PopupAd />
            {/* Hero Section: Sidebar + Banner */}
            <div className="container mx-auto px-4 py-4">
                <div className="flex gap-4 h-[350px] md:h-[400px]">
                    {/* Left Sidebar - Categories (Hidden on mobile) */}
                    <div className="hidden lg:block w-1/5 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-y-auto custom-scrollbar border border-gray-200 dark:border-gray-700">
                        <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                                <FiMenu /> Categories
                            </h3>
                        </div>
                        <ul className="py-2">
                            {categories.map((category) => (
                                <li key={category}>
                                    <Link
                                        to={`/products?category=${encodeURIComponent(category)}`}
                                        className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 transition-colors"
                                    >
                                        <span className="flex items-center gap-3">
                                            {getCategoryIcon(category, "w-4 h-4")}
                                            {category}
                                        </span>
                                        <FiChevronRight className="w-3 h-3 text-gray-400" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Main Banner Carousel */}
                    <div className="flex-1 relative rounded-lg overflow-hidden shadow-sm group">
                        {banners.map((banner, index) => (
                            <div
                                key={banner.id}
                                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentBanner ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center px-8 md:px-16">
                                    <div className="text-white max-w-lg">
                                        <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{banner.title}</h2>
                                        <p className="text-xl mb-6 opacity-90">{banner.subtitle}</p>
                                        <Button onClick={() => navigate('/products')} className="bg-primary-600 hover:bg-primary-700 text-white border-none px-8">
                                            Shop Now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Indicators */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {banners.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentBanner(idx)}
                                    className={`w-2 h-2 rounded-full transition-all ${idx === currentBanner ? 'bg-primary-500 w-6' : 'bg-white/50'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Links / Circular Categories (Mobile Optimized) */}
            <div className="container mx-auto px-4 py-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6 border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                        {categories.slice(0, 8).map((category) => (
                            <Link
                                key={category}
                                to={`/products?category=${encodeURIComponent(category)}`}
                                className="flex flex-col items-center group"
                            >
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center mb-2 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors border border-gray-100 dark:border-gray-600">
                                    <div className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 group-hover:text-primary-600">
                                        {getCategoryIcon(category)}
                                    </div>
                                </div>
                                <span className="text-xs text-center text-gray-600 dark:text-gray-300 group-hover:text-primary-600 font-medium line-clamp-1">
                                    {category}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Flash Sale Section */}
            <div className="container mx-auto px-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <h3 className="text-xl font-bold text-primary-600">Flash Sale</h3>
                            <div className="hidden md:flex items-center gap-2">
                                <span className="text-sm text-gray-500 uppercase font-medium tracking-wider">Ending in</span>
                                <div className="flex gap-1">
                                    <span className="bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-sm">{String(timeLeft.hours).padStart(2, '0')}</span>
                                    <span className="text-primary-600 font-bold">:</span>
                                    <span className="bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-sm">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                    <span className="text-primary-600 font-bold">:</span>
                                    <span className="bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-sm">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate('/products')} className="text-primary-600 border-primary-600 hover:bg-primary-50">
                            Shop All
                        </Button>
                    </div>
                    <div className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {bestSellers.slice(0, 6).map((product) => (
                                <Link key={product._id} to={`/products/${product._id}`} className="group block hover:shadow-lg transition-shadow rounded-lg p-2">
                                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                                        <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
                                        <div className="absolute top-2 left-2 bg-primary-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">-25%</div>
                                    </div>
                                    <h4 className="text-sm text-gray-700 dark:text-gray-200 line-clamp-2 mb-1 h-10 group-hover:text-primary-600">{product.name}</h4>
                                    <div className="flex flex-col">
                                        <span className="text-primary-600 font-bold text-lg">${product.price}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 text-xs line-through">${(product.price * 1.25).toFixed(2)}</span>
                                            <span className="text-xs text-gray-500">-25%</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Just For You - Infinite Feed */}
            <div className="container mx-auto px-4 py-4">
                <h3 className="text-xl font-bold mb-4 text-gray-700 dark:text-white">Just For You</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                    {featuredProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                    {bestSellers.map((product) => (
                        <ProductCard key={`bs-${product._id}`} product={product} />
                    ))}
                </div>
                <div className="mt-8 text-center">
                    <Button variant="outline" onClick={() => navigate('/products')} className="w-full md:w-auto min-w-[240px] border-primary-600 text-primary-600 hover:bg-primary-50">
                        Load More
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Home;
