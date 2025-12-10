'use client';

import { useState, useEffect } from 'react';
import { FaLayerGroup, FaLocationDot, FaScrewdriverWrench, FaUserCheck, FaArrowRight, FaArrowLeft, FaUpload, FaFile, FaPaperPlane, FaBuilding, FaPlaneUp, FaHeartPulse, FaIndustry, FaSchool, FaServer, FaPaperclip } from 'react-icons/fa6';
import { FaCheckCircle } from 'react-icons/fa';

interface FileInfo {
  name: string;
  size: number;
}

interface ProjectData {
  projectType: string;
  location: string;
  timeline: string;
  budget: string;
  services: string[];
  rfpFile: FileInfo | null;
}

interface ContactData {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  projectNotes: string;
  projectDetails: string;
}

const PROJECT_TYPES = [
  { value: 'Corporate interiors', icon: FaBuilding, title: 'Corporate Interiors', subtitle: 'Headquarters, operations centers, tenant build-outs.' },
  { value: 'Aviation & hangar', icon: FaPlaneUp, title: 'Aviation & Hangar', subtitle: 'Hangars, MRO facilities, secure mission support.' },
  { value: 'Healthcare & labs', icon: FaHeartPulse, title: 'Healthcare & Labs', subtitle: 'Clinical suites, clean rooms, life science environments.' },
  { value: 'Manufacturing & industrial', icon: FaIndustry, title: 'Manufacturing & Industrial', subtitle: 'Process facilities, high-bay, plant modernizations.' },
  { value: 'Education & institutional', icon: FaSchool, title: 'Education & Institutional', subtitle: 'K-12, higher-ed campuses, civic and cultural spaces.' },
  { value: 'Technology & data', icon: FaServer, title: 'Technology & Data', subtitle: 'Data centers, network operations, broadcast, labs.' },
];

const SERVICES = [
  'Design Assist',
  'Preconstruction',
  'General Contracting',
  'Technology Integration',
  'Structured Cabling',
  'Wireless / DAS',
  'Security & Access Control',
  'Nationwide Rollouts',
];

const TIMELINE_OPTIONS = [
  { value: 'Immediately', label: 'Immediately' },
  { value: '1-3 months', label: 'Within 1-3 months' },
  { value: '3-6 months', label: '3-6 months' },
  { value: '6+ months', label: '6+ months' },
  { value: 'To be determined', label: 'Still defining' },
];

const BUDGET_OPTIONS = [
  { value: 'Under $1M', label: 'Under $1M' },
  { value: '$1M – $5M', label: '$1M – $5M' },
  { value: '$5M – $15M', label: '$5M – $15M' },
  { value: '$15M – $50M', label: '$15M – $50M' },
  { value: '$50M+', label: '$50M+' },
];

export default function ProjectPlanner() {
  const [currentStep, setCurrentStep] = useState(1);
  const [project, setProject] = useState<ProjectData>({
    projectType: '',
    location: '',
    timeline: '',
    budget: '',
    services: [],
    rfpFile: null,
  });
  const [contact, setContact] = useState<ContactData>({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    projectNotes: '',
    projectDetails: '',
  });
  const [newsletter, setNewsletter] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filePreview, setFilePreview] = useState<{ name: string; size: string } | null>(null);

  const totalSteps = 4;

  const goToStep = (step: number) => {
    if (step < 1 || step > totalSteps) return;
    setCurrentStep(step);
  };

  const updateProject = (field: keyof ProjectData, value: any) => {
    setProject(prev => ({ ...prev, [field]: value }));
  };

  const updateContact = (field: keyof ContactData, value: string) => {
    setContact(prev => ({ ...prev, [field]: value }));
  };

  const toggleService = (service: string) => {
    setProject(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      updateProject('rfpFile', {
        name: file.name,
        size: file.size,
      });
      setFilePreview({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      });
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!project.projectType;
      case 2:
        return !!(project.location && project.timeline && project.budget);
      case 3:
        return project.services.length > 0;
      case 4:
        return !!(
          contact.firstName &&
          contact.lastName &&
          contact.company &&
          contact.email &&
          contact.phone &&
          contact.projectDetails
        );
      default:
        return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(4)) {
      alert('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/planner/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project,
          contact,
          newsletter,
        }),
      });

      if (!response.ok) throw new Error('Submission failed');

      alert('Thanks! Your project brief has been submitted.');
      resetForm();
    } catch (error) {
      console.error('Planner submission error:', error);
      alert('We could not send your project brief. Please email sales@jbtecknologies.com so we can assist.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setProject({
      projectType: '',
      location: '',
      timeline: '',
      budget: '',
      services: [],
      rfpFile: null,
    });
    setContact({
      firstName: '',
      lastName: '',
      company: '',
      email: '',
      phone: '',
      projectNotes: '',
      projectDetails: '',
    });
    setNewsletter(false);
    setFilePreview(null);
    setCurrentStep(1);
  };

  const getStepCircleClass = (step: number) => {
    if (step < currentStep) return 'bg-[#5BA5A5] text-white';
    if (step === currentStep) return 'bg-[#245B8A] text-white scale-110';
    return 'bg-gray-300 text-gray-600';
  };

  const getConnectorClass = (connector: number) => {
    return connector < currentStep - 1
      ? 'bg-[#5BA5A5]'
      : 'bg-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 md:p-12 shadow-2xl border border-white/10">
          <div className="max-w-3xl mb-8">
            <span className="inline-flex items-center gap-2 text-sm uppercase tracking-wider bg-white/10 px-4 py-2 rounded-full border border-white/20 mb-4">
              <span>✨</span> JB Planner
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Build-ready intelligence for your next rollout.
            </h2>
            <p className="text-lg text-gray-300">
              Upload your RFP, pick the services you need, and our team will return a tailored plan within one business day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-14 h-14 rounded-xl bg-[#5BA5A5]/20 flex items-center justify-center mb-4">
                <FaLayerGroup className="text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">500+ Programs</h3>
              <p className="text-sm text-gray-300">From corporate interiors to nationwide rollouts.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-14 h-14 rounded-xl bg-[#5BA5A5]/20 flex items-center justify-center mb-4">
                <FaBuilding className="text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Mission-ready</h3>
              <p className="text-sm text-gray-300">Secure hangars, data centers, labs, and more.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-14 h-14 rounded-xl bg-[#5BA5A5]/20 flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Rapid Response</h3>
              <p className="text-sm text-gray-300">Dedicated teams mobilized within days.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Project Planning Tool - Upload Plans for Free Quote
          </h1>
          <p className="text-xl text-gray-600">
            Step through a quick briefing so our team can respond with the right specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2.3fr_1fr] gap-8">
          {/* Main Content */}
          <section className="space-y-6">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${getStepCircleClass(step)}`}
                    >
                      {step}
                    </div>
                    {step < 4 && (
                      <div
                        className={`w-16 h-1 mx-2 transition-all ${getConnectorClass(step)}`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-gray-600 font-medium">
                Step {currentStep} of {totalSteps}
              </p>
            </div>

            {/* Step 1: Project Type */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-12">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#245B8A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaLayerGroup className="text-3xl text-[#245B8A]" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    What type of project are you planning?
                  </h2>
                  <p className="text-gray-600">Choose the category that best matches your scope.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {PROJECT_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => updateProject('projectType', type.value)}
                        className={`p-5 rounded-xl border-2 transition-all text-left flex gap-4 items-start ${
                          project.projectType === type.value
                            ? 'border-[#245B8A] bg-gradient-to-br from-[#245B8A]/10 to-[#5BA5A5]/10 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-[#245B8A]/12 flex items-center justify-center flex-shrink-0">
                          <Icon className="text-xl text-[#245B8A]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{type.title}</h3>
                          <p className="text-sm text-gray-600">{type.subtitle}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => goToStep(2)}
                    disabled={!validateStep(1)}
                    className="px-6 py-3 bg-[#245B8A] text-white rounded-lg font-semibold hover:bg-[#1a4666] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Continue <FaArrowRight />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Timeline & Location */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-12">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#245B8A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaLocationDot className="text-3xl text-[#245B8A]" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Timeline & Location
                  </h2>
                  <p className="text-gray-600">Share where the work will happen and when you need to mobilize.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label htmlFor="project-location" className="block text-sm font-semibold text-gray-700 mb-2">
                      Project location
                    </label>
                    <input
                      id="project-location"
                      type="text"
                      value={project.location}
                      onChange={(e) => updateProject('location', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#245B8A] focus:outline-none focus:ring-2 focus:ring-[#245B8A]/20"
                      placeholder="City, state or facility"
                    />
                  </div>
                  <div>
                    <label htmlFor="project-timeline" className="block text-sm font-semibold text-gray-700 mb-2">
                      Desired start
                    </label>
                    <select
                      id="project-timeline"
                      value={project.timeline}
                      onChange={(e) => updateProject('timeline', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#245B8A] focus:outline-none focus:ring-2 focus:ring-[#245B8A]/20"
                    >
                      <option value="">Select timeline</option>
                      {TIMELINE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="project-budget" className="block text-sm font-semibold text-gray-700 mb-2">
                      Budget range
                    </label>
                    <select
                      id="project-budget"
                      value={project.budget}
                      onChange={(e) => updateProject('budget', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#245B8A] focus:outline-none focus:ring-2 focus:ring-[#245B8A]/20"
                    >
                      <option value="">Select range</option>
                      {BUDGET_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">Optional: upload an RFP, schematic set, or scope summary.</p>

                <div className="mb-6">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaUpload className="text-5xl text-gray-400 mb-4" />
                      <p className="mb-2 text-sm font-semibold text-gray-500">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX (MAX. 10MB)</p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                    />
                  </label>

                  {filePreview && (
                    <div className="mt-4 p-4 bg-[#245B8A]/10 rounded-lg flex items-center gap-3">
                      <FaFile className="text-2xl text-[#245B8A]" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{filePreview.name}</p>
                        <p className="text-sm text-gray-600">{filePreview.size}</p>
                      </div>
                      <FaCheckCircle className="text-2xl text-green-500" />
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => goToStep(1)}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-all flex items-center gap-2"
                  >
                    <FaArrowLeft /> Back
                  </button>
                  <button
                    onClick={() => goToStep(3)}
                    disabled={!validateStep(2)}
                    className="px-6 py-3 bg-[#245B8A] text-white rounded-lg font-semibold hover:bg-[#1a4666] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto"
                  >
                    Continue <FaArrowRight />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Services */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-12">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#245B8A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaScrewdriverWrench className="text-3xl text-[#245B8A]" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Which services do you need?
                  </h2>
                  <p className="text-gray-600">Select all that apply so we can route to the right specialists.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                  {SERVICES.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`px-4 py-3 rounded-full border-2 font-semibold text-sm transition-all ${
                        project.services.includes(service)
                          ? 'bg-[#245B8A] text-white border-[#245B8A] shadow-lg'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => goToStep(2)}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-all flex items-center gap-2"
                  >
                    <FaArrowLeft /> Back
                  </button>
                  <button
                    onClick={() => goToStep(4)}
                    disabled={!validateStep(3)}
                    className="px-6 py-3 bg-[#245B8A] text-white rounded-lg font-semibold hover:bg-[#1a4666] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto"
                  >
                    Continue <FaArrowRight />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Contact Form */}
            {currentStep === 4 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-12">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#245B8A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUserCheck className="text-3xl text-[#245B8A]" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Who should we connect with?
                  </h2>
                  <p className="text-gray-600">We'll follow up within one business day with next steps.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                        First name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={contact.firstName}
                        onChange={(e) => updateContact('firstName', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#245B8A] focus:outline-none focus:ring-2 focus:ring-[#245B8A]/20"
                        placeholder="Jordan"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Last name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        value={contact.lastName}
                        onChange={(e) => updateContact('lastName', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#245B8A] focus:outline-none focus:ring-2 focus:ring-[#245B8A]/20"
                        placeholder="Lee"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                        Organization
                      </label>
                      <input
                        id="company"
                        type="text"
                        value={contact.company}
                        onChange={(e) => updateContact('company', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#245B8A] focus:outline-none focus:ring-2 focus:ring-[#245B8A]/20"
                        placeholder="Company / Department"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={contact.email}
                        onChange={(e) => updateContact('email', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#245B8A] focus:outline-none focus:ring-2 focus:ring-[#245B8A]/20"
                        placeholder="you@company.com"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => updateContact('phone', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#245B8A] focus:outline-none focus:ring-2 focus:ring-[#245B8A]/20"
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="projectNotes" className="block text-sm font-semibold text-gray-700 mb-2">
                        Working title or facility
                      </label>
                      <input
                        id="projectNotes"
                        type="text"
                        value={contact.projectNotes}
                        onChange={(e) => updateContact('projectNotes', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#245B8A] focus:outline-none focus:ring-2 focus:ring-[#245B8A]/20"
                        placeholder="e.g., ATL Innovation Center"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="projectDetails" className="block text-sm font-semibold text-gray-700 mb-2">
                      Project details
                    </label>
                    <textarea
                      id="projectDetails"
                      value={contact.projectDetails}
                      onChange={(e) => updateContact('projectDetails', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#245B8A] focus:outline-none focus:ring-2 focus:ring-[#245B8A]/20 h-32 resize-none"
                      placeholder="Tell us about goals, constraints, or success metrics."
                      required
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      id="newsletter"
                      type="checkbox"
                      checked={newsletter}
                      onChange={(e) => setNewsletter(e.target.checked)}
                      className="mt-1"
                    />
                    <label htmlFor="newsletter" className="text-sm text-gray-700">
                      Keep me informed about nationwide deployment tips and technology updates.
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => goToStep(3)}
                      className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-all flex items-center gap-2"
                    >
                      <FaArrowLeft /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !validateStep(4)}
                      className="px-6 py-3 bg-[#245B8A] text-white rounded-lg font-semibold hover:bg-[#1a4666] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto"
                    >
                      {isSubmitting ? 'Sending plan...' : 'Submit plan'} <FaPaperPlane />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </section>

          {/* Summary Sidebar */}
          <aside className="lg:sticky lg:top-24 self-start">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <p className="text-xs uppercase tracking-wider text-[#245B8A] font-bold mb-2">Live Summary</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Project Snapshot</h3>

              <div className="h-px bg-gradient-to-r from-[#245B8A]/20 to-transparent my-6"></div>

              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-600 mb-1">Project Type</p>
                  <p className="font-semibold text-gray-900">
                    {project.projectType || 'Not selected'}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-600 mb-1">Location & Schedule</p>
                  <p className="font-semibold text-gray-900">
                    {project.location || 'Not specified'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Timeline: {project.timeline || '—'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Budget: {project.budget || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-600 mb-2">RFP Attachment</p>
                  <span className="inline-flex items-center gap-2 text-sm px-3 py-1.5 bg-[#245B8A]/8 rounded-full text-[#245B8A]">
                    <FaPaperclip /> {filePreview?.name || 'No file attached'}
                  </span>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-600 mb-2">Services Needed</p>
                  <div className="flex flex-wrap gap-2">
                    {project.services.length > 0 ? (
                      project.services.map((service) => (
                        <span
                          key={service}
                          className="px-3 py-1 bg-[#245B8A]/12 text-[#245B8A] rounded-full text-sm font-semibold"
                        >
                          {service}
                        </span>
                      ))
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        No services selected
                      </span>
                    )}
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-[#245B8A]/20 to-transparent my-6"></div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-600 mb-1">Primary Contact</p>
                  <p className="font-semibold text-gray-900">
                    {contact.firstName || contact.lastName
                      ? `${contact.firstName} ${contact.lastName}`.trim()
                      : '—'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Organization: {contact.company || '—'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: {contact.email || '—'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Phone: {contact.phone || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-600 mb-1">Notes</p>
                  <p className="text-sm text-gray-900">
                    {contact.projectDetails || contact.projectNotes || 'No additional details yet.'}
                  </p>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#245B8A]/10 to-[#5BA5A5]/15 text-sm text-gray-800">
                  Need help right away? Call <strong>770-637-2094</strong> or{' '}
                  <a href="/contact" className="text-[#245B8A] hover:underline font-semibold">
                    contact our team
                  </a>
                  .
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

