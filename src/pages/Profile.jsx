import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiSave } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { slideUp } from '../utils/animations';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updateData = {
                name: formData.name,
                phone: formData.phone
            };

            if (formData.newPassword) {
                if (formData.newPassword !== formData.confirmPassword) {
                    alert('New passwords do not match');
                    return;
                }
                updateData.currentPassword = formData.currentPassword;
                updateData.newPassword = formData.newPassword;
            }

            await updateProfile(updateData);
            alert('Profile updated successfully!');

            // Clear password fields
            setFormData({
                ...formData,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <motion.h1 {...slideUp} className="text-4xl font-bold mb-8">
                My Profile
            </motion.h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Summary */}
                <motion.div {...slideUp}>
                    <Card className="text-center">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white flex items-center justify-center text-4xl font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-2xl font-bold mb-2">{user?.name}</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{user?.email}</p>
                        <div className="inline-block px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium capitalize">
                            {user?.role}
                        </div>
                    </Card>
                </motion.div>

                {/* Profile Form */}
                <div className="md:col-span-2">
                    <form onSubmit={handleSubmit}>
                        {/* Personal Information */}
                        <Card className="mb-6">
                            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
                            <div className="space-y-4">
                                <Input
                                    label="Full Name"
                                    icon={FiUser}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Email Address"
                                    icon={FiMail}
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
                                />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Email cannot be changed
                                </p>
                                <Input
                                    label="Phone Number"
                                    icon={FiPhone}
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </Card>

                        {/* Change Password */}
                        <Card className="mb-6">
                            <h2 className="text-2xl font-bold mb-6">Change Password</h2>
                            <div className="space-y-4">
                                <Input
                                    label="Current Password"
                                    type="password"
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                    placeholder="Leave blank to keep current password"
                                />
                                <Input
                                    label="New Password"
                                    type="password"
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    placeholder="Minimum 6 characters"
                                />
                                <Input
                                    label="Confirm New Password"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="Re-enter new password"
                                />
                            </div>
                        </Card>

                        {/* Submit Button */}
                        <Button type="submit" disabled={loading} className="w-full">
                            <FiSave className="inline mr-2" />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
