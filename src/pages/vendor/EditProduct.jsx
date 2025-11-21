import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiImage, FiDollarSign, FiTag, FiPercent, FiSave } from 'react-icons/fi';
import api from '../../utils/api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import ImageUpload from '../../components/common/ImageUpload';
import { fadeIn, slideUp } from '../../utils/animations';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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
    const [specifications, setSpecifications] = useState([{ key: '', value: '' }]);

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

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const { data } = await api.get(`/products/${id}`);
            const product = data.product;

            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                stock: product.stock,
                images: product.images.join(', '),
                tags: product.tags.join(', '),
                featured: product.featured || false,
                discount: product.discount || '',
                discountStartDate: product.discountStartDate ? new Date(product.discountStartDate).toISOString().split('T')[0] : '',
                discountEndDate: product.discountEndDate ? new Date(product.discountEndDate).toISOString().split('T')[0] : ''
            });

            // Load specifications
            if (product.specifications && typeof product.specifications === 'object') {
                const specsArray = Object.entries(product.specifications).map(([key, value]) => ({ key, value }));
                setSpecifications(specsArray.length > 0 ? specsArray : [{ key: '', value: '' }]);
            }
        } catch (error) {
            console.error('Failed to fetch product:', error);
            toast.error('Failed to load product details');
            navigate('/vendor');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSpecificationChange = (index, field, value) => {
        const newSpecs = [...specifications];
        newSpecs[index][field] = value;
        setSpecifications(newSpecs);
    };

    const addSpecification = () => {
        setSpecifications([...specifications, { key: '', value: '' }]);
    };

    const removeSpecification = (index) => {
        const newSpecs = specifications.filter((_, i) => i !== index);
        setSpecifications(newSpecs.length > 0 ? newSpecs : [{ key: '', value: '' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

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

            // Add specifications if provided
            const specsObj = {};
            specifications.forEach(spec => {
                if (spec.key && spec.value) {
                    specsObj[spec.key] = spec.value;
                }
            });
            if (Object.keys(specsObj).length > 0) {
                productData.specifications = specsObj;
            }

            // Add discount fields if provided
            if (formData.discount) {
                productData.discount = parseFloat(formData.discount);
                if (formData.discountStartDate) {
                    productData.discountStartDate = formData.discountStartDate;
                }
                if (formData.discountEndDate) {
                    productData.discountEndDate = formData.discountEndDate;
                }
            } else {
                // Explicitly remove discount if cleared
                productData.discount = 0;
                productData.discountStartDate = null;
                productData.discountEndDate = null;
            }

            await api.put(`/products/${id}`, productData);
            toast.success('Product updated successfully!');
            navigate('/vendor/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update product');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loading fullScreen />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div {...fadeIn} className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white">
                            <FiPackage className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Edit Product
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                Update product details and inventory
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

                                {formData.discount > 0 && (
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
                                    initialImage={formData.images.split(',')[0]}
                                    onUpload={(url) => setFormData({ ...formData, images: url })}
                                />

                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    Upload a high-quality image for your product.
                                </p>
                            </Card>
                        </motion.div>

                        {/* Specifications */}
                        <motion.div {...slideUp} transition={{ delay: 0.35 }}>
                            <Card className="p-8">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <FiTag className="text-indigo-600" />
                                    Product Specifications
                                </h2>

                                <div className="space-y-4">
                                    {specifications.map((spec, index) => (
                                        <div key={index} className="flex gap-3 items-start">
                                            <div className="flex-1 grid grid-cols-2 gap-3">
                                                <Input
                                                    label={index === 0 ? "Specification Name" : ""}
                                                    placeholder="e.g., Brand, Color, Size"
                                                    value={spec.key}
                                                    onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                                                />
                                                <Input
                                                    label={index === 0 ? "Value" : ""}
                                                    placeholder="e.g., Apple, Red, Large"
                                                    value={spec.value}
                                                    onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeSpecification(index)}
                                                className={`px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ${index === 0 ? 'mt-6' : ''}`}
                                                disabled={specifications.length === 1}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={addSpecification}
                                        className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-primary-500 hover:text-primary-600 transition-colors"
                                    >
                                        + Add Specification
                                    </button>
                                </div>
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
                                disabled={saving}
                                size="lg"
                                className="flex-1"
                            >
                                <FiSave className="mr-2" />
                                {saving ? 'Saving Changes...' : 'Save Changes'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                onClick={() => navigate('/vendor/dashboard')}
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

export default EditProduct;
