import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
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
import Profile from './pages/Profile';
import VendorDashboard from './pages/vendor/VendorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Wishlist from './pages/Wishlist';
import AddProduct from './pages/vendor/AddProduct';
import EditProduct from './pages/vendor/EditProduct';
import VendorProducts from './pages/vendor/VendorProducts';
import VendorOrders from './pages/vendor/VendorOrders';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <CartProvider>
                    <BrowserRouter>
                        <div className="flex flex-col min-h-screen">
                            <Navbar />
                            <main className="flex-grow">
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/products" element={<Products />} />
                                    <Route path="/products/:id" element={<ProductDetails />} />
                                    <Route path="/cart" element={<Cart />} />

                                    {/* Public Pages */}
                                    <Route path="/vendor/register" element={<Register />} />
                                    <Route path="/affiliate" element={<div className="container mx-auto px-4 py-20 text-center"><h1 className="text-4xl font-bold mb-4">Affiliate Program</h1><p className="text-gray-600">Coming Soon!</p></div>} />
                                    <Route path="/help" element={<div className="container mx-auto px-4 py-20 text-center"><h1 className="text-4xl font-bold mb-4">Help & Support</h1><p className="text-gray-600">Contact us at support@apexify.com</p></div>} />

                                    {/* Protected Routes */}
                                    <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
                                    <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
                                    <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
                                    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

                                    {/* Vendor Routes */}
                                    <Route path="/vendor/dashboard" element={
                                        <PrivateRoute allowedRoles={['vendor']}>
                                            <VendorDashboard />
                                        </PrivateRoute>
                                    } />
                                    <Route path="/vendor/products" element={
                                        <PrivateRoute allowedRoles={['vendor']}>
                                            <VendorProducts />
                                        </PrivateRoute>
                                    } />
                                    <Route path="/vendor/orders" element={
                                        <PrivateRoute allowedRoles={['vendor']}>
                                            <VendorOrders />
                                        </PrivateRoute>
                                    } />
                                    <Route path="/vendor/add-product" element={
                                        <PrivateRoute allowedRoles={['vendor']}>
                                            <AddProduct />
                                        </PrivateRoute>
                                    } />
                                    <Route path="/vendor/edit-product/:id" element={
                                        <PrivateRoute allowedRoles={['vendor']}>
                                            <EditProduct />
                                        </PrivateRoute>
                                    } />

                                    {/* Admin Routes */}
                                    <Route path="/admin/dashboard" element={
                                        <PrivateRoute allowedRoles={['admin']}>
                                            <AdminDashboard />
                                        </PrivateRoute>
                                    } />
                                </Routes>
                            </main>
                            <Footer />
                        </div>
                    </BrowserRouter>
                </CartProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
