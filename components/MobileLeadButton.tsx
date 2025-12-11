'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import LeadForm from './LeadForm';
import { X } from 'lucide-react';

interface MobileLeadButtonProps {
  city: string;
  state: string;
}

export default function MobileLeadButton({ city, state }: MobileLeadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sticky Mobile Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-luxury-beige p-4 luxury-shadow-lg">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-full bg-luxury-blue hover:bg-luxury-blue/90 text-white"
          size="lg"
        >
          Get a Quote
        </Button>
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
            <LeadForm 
              city={city} 
              state={state} 
              onSuccess={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}

