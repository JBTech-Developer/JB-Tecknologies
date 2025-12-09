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
    dropCount: '',
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
          dropCount: '',
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
    <div className="border rounded-lg p-6 bg-card">
      <h2 className="text-2xl font-bold mb-4">Request a Quote</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
          />
        </div>

        <div>
          <Label htmlFor="dropCount">Drop Count</Label>
          <Select
            value={formData.dropCount}
            onValueChange={(value) => setFormData({ ...formData, dropCount: value })}
            required
          >
            <SelectTrigger id="dropCount">
              <SelectValue placeholder="Select drop count" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1-10</SelectItem>
              <SelectItem value="11-50">11-50</SelectItem>
              <SelectItem value="51-200">51-200</SelectItem>
              <SelectItem value="200+">200+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="facilityType">Facility Type</Label>
          <Select
            value={formData.facilityType}
            onValueChange={(value) => setFormData({ ...formData, facilityType: value })}
            required
          >
            <SelectTrigger id="facilityType">
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
          <div className="p-3 bg-green-50 text-green-800 rounded-md text-sm">
            Thank you! We'll be in touch shortly.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-3 bg-red-50 text-red-800 rounded-md text-sm">
            There was an error submitting your request. Please try again.
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Get a Quote'}
        </Button>
      </form>
    </div>
  );
}

