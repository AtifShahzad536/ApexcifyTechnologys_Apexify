import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiAlertCircle } from 'react-icons/fi';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-lg"
            >
                <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiAlertCircle className="w-12 h-12" />
                </div>

                <h1 className="text-6xl font-black text-gray-900 dark:text-white mb-4">404</h1>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Page Not Found</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                    Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <Link to="/">
                    <button className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        <FiHome className="w-5 h-5" />
                        Back to Home
                    </button>
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;
