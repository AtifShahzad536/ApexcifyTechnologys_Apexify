import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/common/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';

// Vendor Pages
import VendorRegister from './pages/vendor/VendorRegister';
import VendorDashboard from './pages/vendor/VendorDashboard';
import AddProduct from './pages/vendor/AddProduct';
import EditProduct from './pages/vendor/EditProduct';
import VendorOrders from './pages/vendor/VendorOrders';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <CartProvider>
                    <Router>
                        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                            <Navbar />
                            <main className="flex-grow">
                                <Routes>
                                    {/* Public Routes */}
                                    <Route path="/" element={<Home />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/products" element={<Products />} />
                                    <Route path="/products/:id" element={<ProductDetails />} />
                                    <Route path="/cart" element={<Cart />} />

                                    {/* Public Pages */}
                                    <Route path="/affiliate" element={<div className="container mx-auto px-4 py-20 text-center"><h1 className="text-4xl font-bold mb-4">Affiliate Program</h1><p className="text-gray-600">Coming Soon!</p></div>} />
                                    <Route path="/help" element={<div className="container mx-auto px-4 py-20 text-center"><h1 className="text-4xl font-bold mb-4">Help & Support</h1><p className="text-gray-600">Contact us at support@apexify.com</p></div>} />

                                    {/* Protected Routes - User */}
                                    <Route path="/profile" element={
                                        <PrivateRoute>
                                            <Profile />
                                        </PrivateRoute>
                                    } />
                                    <Route path="/checkout" element={
                                        <PrivateRoute>
                                            <Checkout />
                                        </PrivateRoute>
                                    } />
                                    <Route path="/orders" element={
                                        <PrivateRoute>
                                            <Orders />
                                        </PrivateRoute>
                                    } />
                                    <Route path="/orders/:id" element={
                                        <PrivateRoute>
                                            <OrderDetails />
                                        </PrivateRoute>
                                    } />
                                    <Route path="/wishlist" element={
                                        <PrivateRoute>
                                            <Wishlist />
                                        </PrivateRoute>
                                    } />

                                    {/* Protected Routes - Vendor */}
                                    <Route path="/vendor/register" element={
                                        <PrivateRoute>
                                            <VendorRegister />
                                        </PrivateRoute>
                                    } />
                                    <Route path="/vendor/dashboard" element={
                                        <PrivateRoute allowedRoles={['vendor']}>
                                            <VendorDashboard />
                                        </PrivateRoute>
                                    } />
                                    <Route path="/vendor/products/add" element={
                                        <PrivateRoute allowedRoles={['vendor']}>
                                            <AddProduct />
                                        </PrivateRoute>
                                    } />
                                    <Route path="/vendor/products/edit/:id" element={
                                        <PrivateRoute allowedRoles={['vendor']}>
                                            <EditProduct />
                                        </PrivateRoute>
                                    } />
                                    <Route path="/vendor/orders" element={
                                        <PrivateRoute allowedRoles={['vendor']}>
                                            <VendorOrders />
                                        </PrivateRoute>
                                    } />

                                    {/* Protected Routes - Admin */}
                                    <Route path="/admin/dashboard" element={
                                        <PrivateRoute allowedRoles={['admin']}>
                                            <AdminDashboard />
                                        </PrivateRoute>
                                    } />
                                    <Route path="/admin/users" element={
                                        <PrivateRoute allowedRoles={['admin']}>
                                            <AdminUsers />
                                        </PrivateRoute>
                                    } />
                                    <Route path="/admin/products" element={
                                        <PrivateRoute allowedRoles={['admin']}>
                                            <AdminProducts />
                                        </PrivateRoute>
                                    } />
                                </Routes>
                            </main>
                            <Footer />
                            <Toaster position="bottom-right" />
                        </div>
                    </Router>
                </CartProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
