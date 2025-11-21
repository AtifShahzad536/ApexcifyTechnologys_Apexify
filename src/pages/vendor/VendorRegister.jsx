import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiFileText, FiCreditCard } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import api from '../../utils/api';
import { slideUp } from '../../utils/animations';

const VendorRegister = () => {
    const [formData, setFormData] = useState({
        storeName: '',
        storeDescription: '',
        businessLicense: ''
    });
    const [loading, setLoading] = useState(false);
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.put('/users/profile', {
                role: 'vendor',
                vendorInfo: formData
            });

            await refreshUser();
            toast.success('Vendor account created successfully!');
            navigate('/vendor/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create vendor account');
        } finally {
            setLoading(false);
        }
    };

    if (user?.role === 'vendor') {
        navigate('/vendor/dashboard');
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
            <motion.div {...slideUp} className="w-full max-w-2xl">
                <div className="card">
                    <h1 className="text-3xl font-bold text-center mb-2">Become a Vendor</h1>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                        Start selling your products on Apexify
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Store Name"
                            type="text"
                            icon={FiShoppingBag}
                            placeholder="My Amazing Store"
                            value={formData.storeName}
                            onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <FiFileText className="inline mr-2" />
                                Store Description
                            </label>
                            <textarea
                                className="input min-h-[120px]"
                                placeholder="Tell customers about your store and what makes it unique..."
                                value={formData.storeDescription}
                                onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                                required
                            />
                        </div>

                        <Input
                            label="Business License Number (Optional)"
                            type="text"
                            icon={FiCreditCard}
                            placeholder="BL-123456"
                            value={formData.businessLicense}
                            onChange={(e) => setFormData({ ...formData, businessLicense: e.target.value })}
                        />

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">What you'll get:</h3>
                            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                                <li>✓ Your own vendor dashboard</li>
                                <li>✓ Ability to list and manage products</li>
                                <li>✓ Track orders and sales</li>
                                <li>✓ Access to vendor analytics</li>
                            </ul>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Creating Vendor Account...' : 'Become a Vendor'}
                        </Button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default VendorRegister;
