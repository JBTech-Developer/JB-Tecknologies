'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import LeadForm from './LeadForm';
import { X, Phone } from 'lucide-react';

interface MobileLeadButtonProps {
  city?: string;
  state?: string;
}

export default function MobileLeadButton({ city = 'Your City', state = 'Your State' }: MobileLeadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToContactForm = () => {
    const formElement = document.getElementById('contact-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* Sticky Mobile Footer - Two Buttons - Pinned to bottom - Visible on mobile (<768px) */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] md:hidden bg-luxury-blue border-t-2 border-luxury-blue/20 luxury-shadow-lg">
        <div className="grid grid-cols-2 gap-2 p-3">
          <a
            href="tel:7706372094"
            className="flex items-center justify-center gap-2 bg-luxury-blue text-white font-semibold py-3 px-4 rounded-lg hover:bg-luxury-blue/90 transition-colors duration-300 border border-white/20"
          >
            <Phone className="h-5 w-5" />
            <span>Call Now</span>
          </a>
          <a
            href="#contact-form"
            onClick={(e) => {
              e.preventDefault();
              scrollToContactForm();
            }}
            className="flex items-center justify-center bg-luxury-blue text-white font-semibold py-3 px-4 rounded-lg hover:bg-luxury-blue/90 transition-colors duration-300 border border-white/20"
          >
            Get a Quote
          </a>
        </div>
      </div>

      {/* Mobile Form Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-white overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-luxury-black">Request a Quote</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-luxury-black hover:text-luxury-blue"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div id="contact-form">
              <LeadForm 
                city={city} 
                state={state} 
                onSuccess={() => setIsOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

