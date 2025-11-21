import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiImage, FiDollarSign, FiTag, FiPercent } from 'react-icons/fi';
import api from '../../utils/api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import ImageUpload from '../../components/common/ImageUpload';
import { fadeIn, slideUp } from '../../utils/animations';

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Electronics',
        stock: '',
        images: '',
        tags: '',
        featured: false,
        discount: '',
        discountStartDate: '',
        discountEndDate: ''
    });

    const categories = [
        'Electronics',
        'Clothing',
        'Home & Garden',
        'Sports',
        'Books',
        'Toys',
        'Food',
        'Beauty',
        'Other'
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                stock: parseInt(formData.stock),
                images: formData.images.split(',').map(url => url.trim()).filter(Boolean),
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
                featured: formData.featured
            };

            // Add discount fields if provided
            if (formData.discount) {
                productData.discount = parseFloat(formData.discount);
                if (formData.discountStartDate) {
                    productData.discountStartDate = formData.discountStartDate;
                }
                if (formData.discountEndDate) {
                    productData.discountEndDate = formData.discountEndDate;
                }
            }

            await api.post('/products', productData);
            toast.success('Product created successfully!');
            navigate('/vendor/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div {...fadeIn} className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white">
                            <FiPackage className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                                Add New Product
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                Create a new product listing
                            </p>
                        </div>
                    </div>
                </motion.div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <motion.div {...slideUp}>
                            <Card className="p-8">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <FiPackage className="text-primary-600" />
                                    Basic Information
                                </h2>

                                <div className="space-y-4">
                                    <Input
                                        label="Product Name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g., MacBook Pro 16-inch"
                                    />

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            required
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Describe your product in detail..."
                                            className="input w-full h-32 resize-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Category
                                            </label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className="input w-full"
                                            >
                                                {categories.map((cat) => (
                                                    <option key={cat} value={cat}>
                                                        {cat}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <Input
                                            label="Tags (comma-separated)"
                                            name="tags"
                                            value={formData.tags}
                                            onChange={handleChange}
                                            placeholder="e.g., laptop, apple, pro"
                                            icon={FiTag}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Pricing & Inventory */}
                        <motion.div {...slideUp} transition={{ delay: 0.1 }}>
                            <Card className="p-8">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <FiDollarSign className="text-green-600" />
                                    Pricing & Inventory
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Price ($)"
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        icon={FiDollarSign}
                                    />

                                    <Input
                                        label="Stock Quantity"
                                        name="stock"
                                        type="number"
                                        required
                                        value={formData.stock}
                                        onChange={handleChange}
                                        placeholder="0"
                                    />
                                </div>
                            </Card>
                        </motion.div>

                        {/* Discount (Optional) */}
                        <motion.div {...slideUp} transition={{ delay: 0.2 }}>
                            <Card className="p-8">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <FiPercent className="text-orange-600" />
                                    Discount (Optional)
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Input
                                        label="Discount (%)"
                                        name="discount"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.discount}
                                        onChange={handleChange}
                                        placeholder="0"
                                        icon={FiPercent}
                                    />

                                    <Input
                                        label="Start Date"
                                        name="discountStartDate"
                                        type="date"
                                        value={formData.discountStartDate}
                                        onChange={handleChange}
                                    />

                                    <Input
                                        label="End Date"
                                        name="discountEndDate"
                                        type="date"
                                        value={formData.discountEndDate}
                                        onChange={handleChange}
                                    />
                                </div>

                                {formData.discount && (
                                    <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-700">
                                        <p className="text-sm text-orange-700 dark:text-orange-300">
                                            <strong>Preview:</strong> Original Price ${formData.price || '0'} →
                                            Sale Price ${((formData.price || 0) * (1 - (formData.discount || 0) / 100)).toFixed(2)}
                                        </p>
                                    </div>
                                )}
                            </Card>
                        </motion.div>

                        {/* Images */}
                        <motion.div {...slideUp} transition={{ delay: 0.3 }}>
                            <Card className="p-8">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <FiImage className="text-purple-600" />
                                    Product Images
                                </h2>

                                <ImageUpload
                                    label="Product Image"
                                    onUpload={(url) => setFormData({ ...formData, images: url })}
                                />

                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    Upload a high-quality image for your product.
                                </p>
                            </Card>
                        </motion.div>

                        {/* Additional Options */}
                        <motion.div {...slideUp} transition={{ delay: 0.4 }}>
                            <Card className="p-8">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="featured"
                                        checked={formData.featured}
                                        onChange={handleChange}
                                        className="w-6 h-6 text-primary-600 rounded"
                                    />
                                    <div>
                                        <span className="font-bold text-lg">Mark as Featured</span>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Featured products appear on the homepage
                                        </p>
                                    </div>
                                </label>
                            </Card>
                        </motion.div>

                        {/* Actions */}
                        <motion.div {...slideUp} transition={{ delay: 0.5 }} className="flex gap-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                size="lg"
                                className="flex-1"
                            >
                                {loading ? 'Creating Product...' : 'Create Product'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                onClick={() => navigate('/vendor')}
                            >
                                Cancel
                            </Button>
                        </motion.div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
