import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-luxury-beige/30 bg-white mt-auto">
      <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-xl font-bold mb-6 text-luxury-black">JB Technologies</h3>
            <p className="text-sm text-luxury-black/70 leading-relaxed max-w-md">
              Professional network cabling and low-voltage installation services nationwide. 
              Delivering excellence in every project with precision and care.
            </p>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6 text-luxury-black">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/georgia/network-cabling" className="text-sm text-luxury-black/70 hover:text-luxury-blue transition-colors duration-300">
                  Cat6 Data Cabling
                </Link>
              </li>
              <li>
                <Link href="/georgia/network-cabling" className="text-sm text-luxury-black/70 hover:text-luxury-blue transition-colors duration-300">
                  Fiber Optic Installation
                </Link>
              </li>
              <li>
                <Link href="/georgia/network-cabling" className="text-sm text-luxury-black/70 hover:text-luxury-blue transition-colors duration-300">
                  Structured Cabling Systems
                </Link>
              </li>
              <li>
                <Link href="/georgia/network-cabling" className="text-sm text-luxury-black/70 hover:text-luxury-blue transition-colors duration-300">
                  Network Infrastructure
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6 text-luxury-black">Contact</h3>
            <div className="space-y-3">
              <p className="text-sm text-luxury-black/70">
                Phone: <a href="tel:18005550199" className="hover:text-luxury-blue transition-colors duration-300">1-800-555-0199</a>
              </p>
              <p className="text-sm text-luxury-black/70">
                Email: <a href="mailto:info@jbtech.com" className="hover:text-luxury-blue transition-colors duration-300">info@jbtech.com</a>
              </p>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-luxury-beige/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-luxury-black/60 tracking-wide uppercase">
              © {new Date().getFullYear()} JB Technologies. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/" className="text-xs text-luxury-black/60 hover:text-luxury-blue transition-colors duration-300 uppercase tracking-wide">
                Privacy Policy
              </Link>
              <Link href="/" className="text-xs text-luxury-black/60 hover:text-luxury-blue transition-colors duration-300 uppercase tracking-wide">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

