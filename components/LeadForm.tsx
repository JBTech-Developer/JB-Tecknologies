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
  const [emailStatus, setEmailStatus] = useState<{ sent: boolean; error?: string } | null>(null);

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
        const result = await response.json();
        setSubmitStatus('success');
        setEmailStatus({
          sent: result.emailSent || false,
          error: result.emailError
        });
        setFormData({
          firstName: '',
          lastName: '',
          companyName: '',
          email: '',
          phone: '',
          projectDetails: '',
          facilityType: '',
        });
        // Close mobile form after 3 seconds
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 3000);
        }
      } else {
        setSubmitStatus('error');
        setEmailStatus(null);
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
          <div className="space-y-3">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="font-semibold text-green-800 mb-1">Quote Request Submitted Successfully!</p>
                  <p className="text-sm text-green-700">Thank you for your interest. We've received your request and will be in touch shortly.</p>
                </div>
              </div>
            </div>
            {emailStatus && emailStatus.sent && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs text-blue-700">Email notification sent to our sales team</p>
                </div>
              </div>
            )}
            {emailStatus && !emailStatus.sent && emailStatus.error && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-xs text-yellow-700">Your request was received, but email notification failed. Our team will still process your request.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-red-800 mb-1">Submission Error</p>
                <p className="text-sm text-red-700">There was an error submitting your request. Please try again or contact us directly.</p>
              </div>
            </div>
          </div>
        )}

        <Button type="submit" className="w-full bg-luxury-blue hover:bg-luxury-blue/90 text-white" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Get a Quote'}
        </Button>
      </form>
    </div>
  );
}

