import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiStar } from 'react-icons/fi';
import Button from '../components/common/Button';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const { user } = useAuth();
    const [isWishlisted, setIsWishlisted] = useState(false);

    const toggleWishlist = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to add items to wishlist');
            return;
        }

        try {
            await api.post(`/wishlist/${product._id}`);
            setIsWishlisted(true);
            toast.success('Added to wishlist');
        } catch (error) {
            if (error.response?.status === 400) {
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

    return (
        <Link to={`/products/${product._id}`} className="group block hover:shadow-lg transition-shadow rounded-lg p-2">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                <img src={product.images?.[0] || '/placeholder.png'} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-primary-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">-25%</div>
            </div>
            <h4 className="text-sm text-gray-700 dark:text-gray-200 line-clamp-2 mb-1 h-10 group-hover:text-primary-600">{product.name}</h4>
            <div className="flex flex-col">
                <span className="text-primary-600 font-bold text-lg">${product.price}</span>
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs line-through">${(product.price * 1.25).toFixed(2)}</span>
                    <span className="text-xs text-gray-500">-25%</span>
                </div>
                <div className="flex items-center mt-2">
                    <button
                        onClick={toggleWishlist}
                        className="p-1 bg-white/90 dark:bg-gray-800/90 rounded-full hover:scale-110 transition-transform"
                    >
                        <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                    </button>
                    <div className="flex items-center ml-2">
                        {[...Array(5)].map((_, i) => (
                            <FiStar
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.averageRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                        ))}
                        <span className="text-xs ml-1 text-gray-600">{product.averageRating?.toFixed(1) || '0.0'}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
