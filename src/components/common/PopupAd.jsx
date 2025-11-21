import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const PopupAd = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [adData, setAdData] = useState(null);
    const [hasShown, setHasShown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchActiveAd();
    }, []);

    const fetchActiveAd = async () => {
        try {
            const { data } = await api.get('/popup-ads/active');

            if (data.success && data.popupAd) {
                setAdData(data.popupAd);

                // Check if ad was already shown in this session
                const adShown = sessionStorage.getItem(`popupAd_${data.popupAd._id}`);

                if (!adShown && !hasShown) {
                    // Show popup after delay specified by admin
                    const timer = setTimeout(() => {
                        setIsVisible(true);
                        setHasShown(true);
                        sessionStorage.setItem(`popupAd_${data.popupAd._id}`, 'true');
                    }, data.popupAd.delayBeforeShow || 3000);

                    return () => clearTimeout(timer);
                }
            }
        } catch (error) {
            console.error('Failed to fetch popup ad:', error);
        }
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleClick = () => {
        setIsVisible(false);
        if (adData?.linkUrl) {
            navigate(adData.linkUrl);
        }
    };

    if (!adData) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
                    />

                    {/* Banner-Style Popup Ad */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        transition={{ type: "spring", duration: 0.6 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[95%] max-w-4xl"
                    >
                        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 z-10 p-2.5 bg-white/95 dark:bg-gray-900/95 rounded-full hover:bg-white dark:hover:bg-gray-900 transition-all shadow-lg hover:scale-110"
                            >
                                <FiX className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                            </button>

                            {/* Banner Content */}
                            <div
                                className="relative flex flex-col md:flex-row items-center min-h-[300px] md:min-h-[400px] cursor-pointer group"
                                onClick={handleClick}
                                style={{
                                    background: adData.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                }}
                            >
                                {/* Left Side - Image */}
                                {adData.imageUrl && (
                                    <div className="w-full md:w-1/2 h-64 md:h-full relative overflow-hidden">
                                        <motion.img
                                            initial={{ scale: 1.2, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.8 }}
                                            src={adData.imageUrl}
                                            alt={adData.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30 md:to-transparent"></div>
                                    </div>
                                )}

                                {/* Right Side - Text Content */}
                                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative z-10">
                                    {/* Decorative Elements */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                                    {/* Content */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3, duration: 0.6 }}
                                        className="relative z-10"
                                    >
                                        {/* Title */}
                                        <h2
                                            className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 leading-tight"
                                            style={{ color: adData.textColor || '#ffffff' }}
                                        >
                                            {adData.title}
                                        </h2>

                                        {/* Description */}
                                        <p
                                            className="text-lg md:text-xl mb-6 md:mb-8 leading-relaxed opacity-95"
                                            style={{ color: adData.textColor || '#ffffff' }}
                                        >
                                            {adData.description}
                                        </p>

                                        {/* CTA Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all group-hover:gap-4"
                                        >
                                            {adData.buttonText || 'Shop Now'}
                                            <svg
                                                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </motion.button>

                                        {/* Small Print */}
                                        <p
                                            className="text-xs mt-4 opacity-75"
                                            style={{ color: adData.textColor || '#ffffff' }}
                                        >
                                            *Limited time offer. Click to explore.
                                        </p>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Decorative Corner Badge */}
                            <div className="absolute top-0 left-0 overflow-hidden w-24 h-24">
                                <div className="absolute top-0 left-0 w-32 h-32 bg-red-500 transform -rotate-45 -translate-x-16 -translate-y-16 flex items-end justify-center pb-4">
                                    <span className="text-white text-xs font-bold transform rotate-45">
                                        HOT
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PopupAd;
