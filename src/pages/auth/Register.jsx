import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { slideUp } from '../../utils/animations';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'customer',
        phone: '',
        vendorInfo: { storeName: '', storeDescription: '' }
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...registerData } = formData;
            await register(registerData);
            toast.success('Account created successfully!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to register');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
            <motion.div {...slideUp} className="w-full max-w-2xl">
                <div className="card">
                    <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                        Join our marketplace today
                    </p>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Full Name"
                                type="text"
                                icon={FiUser}
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />

                            <Input
                                label="Phone"
                                type="tel"
                                icon={FiPhone}
                                placeholder="+1234567890"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <Input
                            label="Email"
                            type="email"
                            icon={FiMail}
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Password"
                                type="password"
                                icon={FiLock}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />

                            <Input
                                label="Confirm Password"
                                type="password"
                                icon={FiLock}
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Account Type
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <motion.button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'customer' })}
                                    className={`p-4 rounded-lg border-2 transition-all ${formData.role === 'customer'
                                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                                        : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <h3 className="font-semibold">Customer</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Buy products</p>
                                </motion.button>

                                <motion.button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'vendor' })}
                                    className={`p-4 rounded-lg border-2 transition-all ${formData.role === 'vendor'
                                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                                        : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <h3 className="font-semibold">Vendor</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Sell products</p>
                                </motion.button>
                            </div>
                        </div>

                        {formData.role === 'vendor' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-4"
                            >
                                <Input
                                    label="Store Name"
                                    type="text"
                                    placeholder="My Amazing Store"
                                    value={formData.vendorInfo.storeName}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            vendorInfo: { ...formData.vendorInfo, storeName: e.target.value }
                                        })
                                    }
                                    required
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Store Description
                                    </label>
                                    <textarea
                                        className="input min-h-[100px]"
                                        placeholder="Tell us about your store..."
                                        value={formData.vendorInfo.storeDescription}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                vendorInfo: { ...formData.vendorInfo, storeDescription: e.target.value }
                                            })
                                        }
                                    />
                                </div>
                            </motion.div>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </form>

                    <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 hover:underline font-medium">
                            Login
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
