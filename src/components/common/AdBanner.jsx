import { motion } from 'framer-motion';
import { fadeIn } from '../../utils/animations';

const AdBanner = ({ image, title, subtitle, link, className = '' }) => {
    return (
        <motion.div
            {...fadeIn}
            className={`relative rounded-lg overflow-hidden shadow-sm my-6 group cursor-pointer ${className}`}
        >
            <img
                src={image}
                alt={title}
                className="w-full h-32 md:h-48 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-6 md:px-12">
                <div className="text-white">
                    <h3 className="text-xl md:text-3xl font-bold mb-2">{title}</h3>
                    <p className="text-sm md:text-lg opacity-90 mb-4">{subtitle}</p>
                    <span className="inline-block bg-white text-primary-600 text-xs md:text-sm font-bold px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
                        Shop Now
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default AdBanner;
