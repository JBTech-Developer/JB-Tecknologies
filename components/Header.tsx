'use client';

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function Header() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-luxury-beige/30 luxury-shadow">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link href="/" className="text-2xl lg:text-3xl font-display font-bold text-luxury-black hover:text-luxury-blue transition-colors duration-300">
            JB Technologies
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            <Link 
              href="/" 
              className="text-sm font-medium text-luxury-black hover:text-luxury-blue transition-colors duration-300 tracking-wide uppercase"
            >
              Home
            </Link>
            
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-luxury-black hover:text-luxury-blue transition-colors duration-300 tracking-wide uppercase">
                Services
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg luxury-shadow-lg border border-luxury-beige/30 py-4 fade-in">
                  <Link
                    href="/georgia/network-cabling"
                    className="block px-6 py-3 text-sm text-luxury-black hover:bg-luxury-beige/30 hover:text-luxury-blue transition-colors duration-200"
                  >
                    Network Cabling
                  </Link>
                  <Link
                    href="/planner"
                    className="block px-6 py-3 text-sm text-luxury-black hover:bg-luxury-beige/30 hover:text-luxury-blue transition-colors duration-200"
                  >
                    Project Planner
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              href="/planner" 
              className="text-sm font-medium text-luxury-black hover:text-luxury-blue transition-colors duration-300 tracking-wide uppercase"
            >
              Planner
            </Link>
          </nav>
          
          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button 
              asChild 
              className="bg-luxury-blue hover:bg-luxury-blue/90 text-white px-8 py-6 rounded-sm font-medium tracking-wide uppercase text-sm transition-all duration-300 hover-lift"
            >
              <Link href="/planner">Get Quote</Link>
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <Button 
            asChild 
            size="sm" 
            className="lg:hidden bg-luxury-blue hover:bg-luxury-blue/90 text-white"
          >
            <Link href="/planner">Get Quote</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

