import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiFacebook, FiInstagram } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-xl font-bold text-gradient mb-4">Apexify</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Your trusted multi-vendor marketplace for quality products from vendors worldwide.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <FooterLink to="/products">Products</FooterLink>
                            <FooterLink to="/about">About Us</FooterLink>
                            <FooterLink to="/contact">Contact</FooterLink>
                            <FooterLink to="/faq">FAQ</FooterLink>
                        </ul>
                    </div>

                    {/* For Vendors */}
                    <div>
                        <h4 className="font-semibold mb-4">For Vendors</h4>
                        <ul className="space-y-2">
                            <FooterLink to="/become-vendor">Become a Vendor</FooterLink>
                            <FooterLink to="/vendor/dashboard">Vendor Dashboard</FooterLink>
                            <FooterLink to="/vendor-guide">Vendor Guide</FooterLink>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="font-semibold mb-4">Connect With Us</h4>
                        <div className="flex space-x-4">
                            <SocialLink Icon={FiGithub} />
                            <SocialLink Icon={FiTwitter} />
                            <SocialLink Icon={FiFacebook} />
                            <SocialLink Icon={FiInstagram} />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Apexify. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

const FooterLink = ({ to, children }) => (
    <li>
        <Link
            to={to}
            className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors"
        >
            {children}
        </Link>
    </li>
);

const SocialLink = ({ Icon }) => (
    <a
        href="#"
        className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"
    >
        <Icon className="w-5 h-5" />
    </a>
);

export default Footer;
