'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LeadFormProps {
  city: string;
  state: string;
  onSuccess?: () => void;
}

export default function LeadForm({ city, state, onSuccess }: LeadFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    projectDetails: '',
    facilityType: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          city,
          state,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          companyName: '',
          email: '',
          phone: '',
          projectDetails: '',
          facilityType: '',
        });
        // Close mobile form after 2 seconds
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-luxury-beige rounded-lg p-8 lg:p-10 bg-white luxury-shadow-lg">
      <h2 className="text-3xl font-display font-bold mb-2 text-luxury-black">Request a Quote</h2>
      <p className="text-sm text-luxury-black/60 mb-8 uppercase tracking-wide">Get started today</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            required
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="projectDetails">Project Details</Label>
          <textarea
            id="projectDetails"
            required
            value={formData.projectDetails}
            onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
            className="mt-2 flex min-h-[100px] w-full rounded-sm border border-luxury-beige bg-white px-4 py-3 text-sm text-luxury-black ring-offset-background placeholder:text-luxury-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-blue focus-visible:ring-offset-2 focus-visible:border-luxury-blue transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
            placeholder="Tell us about your project (e.g., number of locations, square footage, specific requirements, timeline, etc.)"
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="facilityType">Facility Type</Label>
          <Select
            value={formData.facilityType}
            onValueChange={(value) => setFormData({ ...formData, facilityType: value })}
            required
          >
            <SelectTrigger id="facilityType" className="mt-2">
              <SelectValue placeholder="Select facility type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Office">Office</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="Warehouse">Warehouse</SelectItem>
              <SelectItem value="School">School</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {submitStatus === 'success' && (
          <div className="p-4 bg-luxury-beige/30 border border-luxury-blue/30 rounded-sm text-sm text-luxury-black">
            Thank you! We'll be in touch shortly.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-sm text-sm text-red-800">
            There was an error submitting your request. Please try again.
          </div>
        )}

        <Button type="submit" className="w-full bg-luxury-blue hover:bg-luxury-blue/90 text-white" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Get a Quote'}
        </Button>
      </form>
    </div>
  );
}

