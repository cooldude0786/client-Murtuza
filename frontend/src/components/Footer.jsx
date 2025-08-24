import React from 'react';

// Simple SVG icon components for social media links
const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z" />
    </svg>
);

const YouTubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
    </svg>
);

const Footer = () => {
    return (
        <footer className="py-12 px-4 text-secondary-content/100 bg-secondary" style={{
            // backgroundColor: 'oklch(23.27% 0.0249 284.3)',
            // color: 'oklch(94.22% 0.2505 117.44)',
        }}
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                {/* Column 1: Contact & Social */}
                <div>
                    <h6 className="footer-title text-lg font-semi bold  mb-4">Follow & Contact Us</h6>
                    <div className="flex space-x-4 mb-4">
                        <a href="#" className="btn btn-ghost btn-circle text-base hover:text-base-content">
                            <FacebookIcon />
                        </a>
                        <a href="#" className="btn btn-ghost btn-circle text-base hover:text-base-content">
                            <YouTubeIcon />
                        </a>
                    </div>
                    <div className="flex flex-col space-y-1 text-sm">
                        <a href="mailto:sales.sa@anaum.com" className="link link-hover">sales.sa@anaum.com</a>
                        <a href="tel:00966126516555" className="link link-hover">00966 12 6516555</a>
                        <a href="tel:00966126525556" className="link link-hover">00966 12 6525556</a>
                    </div>
                </div>

                {/* Column 2: Helpful Info */}
                <div>
                    <h6 className="footer-title text-lg font-semi bold  mb-4">Helpful Info</h6>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/shipping" className="link link-hover">Shipping & Returns</a></li>
                        <li><a href="/privacy" className="link link-hover">Privacy Policy</a></li>
                        <li><a href="/terms" className="link link-hover">Terms & Conditions</a></li>
                        <li><a href="/faq" className="link link-hover">FAQ</a></li>
                    </ul>
                </div>

                {/* Column 3: My Account */}
                <div>
                    <h6 className="footer-title text-lg font-semi bold  mb-4">My Account</h6>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/cart" className="link link-hover">View Cart</a></li>
                        <li><a href="/signin" className="link link-hover">Sign In</a></li>
                        <li><a href="/orders" className="link link-hover">Order Status</a></li>
                    </ul>
                </div>

                {/* Column 4: Newsletter */}
                <div>
                    <h6 className="footer-title text-lg font-semi bold  mb-4">Subscribe</h6>
                    <p className="text-sm mb-4 text-base-content/70">
                        Invite customers to join your mailing list.
                    </p>
                    <div className="form-control">
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="your@email.com"
                                className="input input-bordered w-full pr-16 placeholder:text-base-content/70"
                            />

                            <button className="btn btn-primary">Sign Up</button>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
