import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiX, FiImage } from 'react-icons/fi';
import api from '../../utils/api';

const ImageUpload = ({ onUpload, initialImage = '', label = 'Product Image' }) => {
    const [image, setImage] = useState(initialImage);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('File size should be less than 5MB');
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('image', file);

        try {
            const { data } = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Construct full URL
            // API_URL might be http://localhost:5000/api, but images are at http://localhost:5000/uploads
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const serverUrl = apiUrl.replace('/api', '');
            const fullUrl = `${serverUrl}${data.url}`;

            setImage(fullUrl);
            onUpload(fullUrl);
        } catch (err) {
            console.error('Upload failed:', err);
            setError('Failed to upload image');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = () => {
        setImage('');
        onUpload('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
            </label>

            <div className="relative">
                {image ? (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
                        <img
                            src={image}
                            alt="Uploaded"
                            className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                                <FiX className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
                            ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800'}
                        `}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />

                        {loading ? (
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                                <p className="text-sm text-gray-500">Uploading...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-full flex items-center justify-center mb-3">
                                    <FiUploadCloud className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    Click to upload image
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    SVG, PNG, JPG or GIF (max. 5MB)
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-600 dark:text-red-400"
                    >
                        {error}
                    </motion.p>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
