import { motion } from 'framer-motion';

const Loading = ({ fullScreen = false }) => {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-12">
            <Spinner />
        </div>
    );
};

const Spinner = () => (
    <div className="relative w-16 h-16">
        <motion.div
            className="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-primary-900"
        />
        <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
    </div>
);

export default Loading;
