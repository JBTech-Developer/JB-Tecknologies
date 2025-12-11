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
    if (step < currentStep) return 'bg-luxury-gold text-white luxury-shadow';
    if (step === currentStep) return 'bg-luxury-gold text-white scale-110 luxury-shadow-lg';
    return 'bg-luxury-beige text-luxury-black/40 border border-luxury-beige';
  };

  const getConnectorClass = (connector: number) => {
    return connector < currentStep - 1
      ? 'bg-luxury-gold'
      : 'bg-luxury-beige';
  };

  return (
    <div className="min-h-screen bg-luxury-offwhite">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-12 lg:pt-16 pb-16 lg:pb-20">
        <div className="rounded-lg bg-gradient-to-br from-luxury-black via-luxury-black/95 to-luxury-black/90 text-white p-10 lg:p-16 luxury-shadow-lg border border-luxury-gold/20">
          <div className="max-w-3xl mb-12">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wider bg-luxury-gold/20 px-5 py-2.5 rounded-sm border border-luxury-gold/30 mb-6 text-luxury-gold">
              <span>✨</span> JB Planner
            </span>
            <h2 className="text-4xl lg:text-5xl font-display font-semibold mb-6 leading-tight">
              Build-ready intelligence for your next rollout.
            </h2>
            <p className="text-lg lg:text-xl text-white/90 font-light">
              Upload your RFP, pick the services you need, and our team will return a tailored plan within one business day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 lg:p-8 border border-white/20 hover-lift transition-all duration-300">
              <div className="w-14 h-14 rounded-lg bg-luxury-gold/20 flex items-center justify-center mb-4">
                <FaLayerGroup className="text-2xl text-luxury-gold" />
              </div>
              <h3 className="text-lg font-display font-semibold mb-2">500+ Programs</h3>
              <p className="text-sm text-white/80">From corporate interiors to nationwide rollouts.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 lg:p-8 border border-white/20 hover-lift transition-all duration-300">
              <div className="w-14 h-14 rounded-lg bg-luxury-gold/20 flex items-center justify-center mb-4">
                <FaBuilding className="text-2xl text-luxury-gold" />
              </div>
              <h3 className="text-lg font-display font-semibold mb-2">Mission-ready</h3>
              <p className="text-sm text-white/80">Secure hangars, data centers, labs, and more.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 lg:p-8 border border-white/20 hover-lift transition-all duration-300">
              <div className="w-14 h-14 rounded-lg bg-luxury-gold/20 flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-display font-semibold mb-2">Rapid Response</h3>
              <p className="text-sm text-white/80">Dedicated teams mobilized within days.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16 lg:pb-24">
        <div className="text-center mb-12 lg:mb-16 fade-in">
          <h1 className="text-3xl lg:text-5xl font-display font-semibold text-luxury-black mb-4">
            Project Planning Tool
          </h1>
          <p className="text-xl lg:text-2xl text-luxury-black/70 font-light">
            Step through a quick briefing so our team can respond with the right specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2.3fr_1fr] gap-8">
          {/* Main Content */}
          <section className="space-y-6">
            {/* Progress Indicator */}
            <div className="mb-12">
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${getStepCircleClass(step)}`}
                    >
                      {step}
                    </div>
                    {step < 4 && (
                      <div
                        className={`w-20 h-0.5 mx-2 transition-all duration-300 ${getConnectorClass(step)}`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-luxury-black/60 font-medium uppercase tracking-wide">
                Step {currentStep} of {totalSteps}
              </p>
            </div>

            {/* Step 1: Project Type */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg luxury-shadow-lg p-8 lg:p-12 border border-luxury-beige fade-in">
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-luxury-gold/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <FaLayerGroup className="text-3xl text-luxury-gold" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-display font-semibold text-luxury-black mb-3">
                    What type of project are you planning?
                  </h2>
                  <p className="text-lg text-luxury-black/70">Choose the category that best matches your scope.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-10">
                  {PROJECT_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => updateProject('projectType', type.value)}
                        className={`p-6 rounded-lg border-2 transition-all duration-300 text-left flex gap-4 items-start hover-lift ${
                          project.projectType === type.value
                            ? 'border-luxury-gold bg-luxury-beige/30 luxury-shadow-lg'
                            : 'border-luxury-beige hover:border-luxury-gold/50 hover:shadow-md bg-white'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          project.projectType === type.value ? 'bg-luxury-gold/20' : 'bg-luxury-beige/30'
                        }`}>
                          <Icon className={`text-xl ${project.projectType === type.value ? 'text-luxury-gold' : 'text-luxury-black/60'}`} />
                        </div>
                        <div>
                          <h3 className={`font-display font-semibold text-lg mb-1 ${
                            project.projectType === type.value ? 'text-luxury-black' : 'text-luxury-black'
                          }`}>{type.title}</h3>
                          <p className="text-sm text-luxury-black/70">{type.subtitle}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => goToStep(2)}
                    disabled={!validateStep(1)}
                    className="px-8 py-4 bg-luxury-gold text-white rounded-sm font-medium hover:bg-luxury-gold/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 luxury-shadow hover-lift uppercase tracking-wide text-sm"
                  >
                    Continue <FaArrowRight />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Timeline & Location */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg luxury-shadow-lg p-8 lg:p-12 border border-luxury-beige fade-in">
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-luxury-gold/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <FaLocationDot className="text-3xl text-luxury-gold" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-display font-semibold text-luxury-black mb-3">
                    Timeline & Location
                  </h2>
                  <p className="text-lg text-luxury-black/70">Share where the work will happen and when you need to mobilize.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <label htmlFor="project-location" className="block text-xs font-medium text-luxury-black mb-2 uppercase tracking-wide">
                      Project location
                    </label>
                    <input
                      id="project-location"
                      type="text"
                      value={project.location}
                      onChange={(e) => updateProject('location', e.target.value)}
                      className="w-full px-4 py-3 border border-luxury-beige rounded-sm focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 bg-white text-luxury-black"
                      placeholder="City, state or facility"
                    />
                  </div>
                  <div>
                    <label htmlFor="project-timeline" className="block text-xs font-medium text-luxury-black mb-2 uppercase tracking-wide">
                      Desired start
                    </label>
                    <select
                      id="project-timeline"
                      value={project.timeline}
                      onChange={(e) => updateProject('timeline', e.target.value)}
                      className="w-full px-4 py-3 border border-luxury-beige rounded-sm focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 bg-white text-luxury-black"
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
                    <label htmlFor="project-budget" className="block text-xs font-medium text-luxury-black mb-2 uppercase tracking-wide">
                      Budget range
                    </label>
                    <select
                      id="project-budget"
                      value={project.budget}
                      onChange={(e) => updateProject('budget', e.target.value)}
                      className="w-full px-4 py-3 border border-luxury-beige rounded-sm focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 bg-white text-luxury-black"
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

                <p className="text-sm text-luxury-black/70 mb-6">Optional: upload an RFP, schematic set, or scope summary.</p>

                <div className="mb-8">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-luxury-beige rounded-lg cursor-pointer bg-luxury-beige/10 hover:bg-luxury-beige/20 transition-colors duration-300"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaUpload className="text-5xl text-luxury-gold/60 mb-4" />
                      <p className="mb-2 text-sm font-medium text-luxury-black">Click to upload or drag and drop</p>
                      <p className="text-xs text-luxury-black/60">PDF, DOC, DOCX (MAX. 10MB)</p>
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
                    <div className="mt-4 p-4 bg-luxury-beige/30 border border-luxury-gold/30 rounded-sm flex items-center gap-3">
                      <FaFile className="text-2xl text-luxury-gold" />
                      <div className="flex-1">
                        <p className="font-semibold text-luxury-black">{filePreview.name}</p>
                        <p className="text-sm text-luxury-black/70">{filePreview.size}</p>
                      </div>
                      <FaCheckCircle className="text-2xl text-luxury-gold" />
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => goToStep(1)}
                    className="px-6 py-3 bg-luxury-beige text-luxury-black rounded-sm font-medium hover:bg-luxury-beige/80 transition-all duration-300 flex items-center gap-2 uppercase tracking-wide text-sm"
                  >
                    <FaArrowLeft /> Back
                  </button>
                  <button
                    onClick={() => goToStep(3)}
                    disabled={!validateStep(2)}
                    className="px-8 py-4 bg-luxury-gold text-white rounded-sm font-medium hover:bg-luxury-gold/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto luxury-shadow hover-lift uppercase tracking-wide text-sm"
                  >
                    Continue <FaArrowRight />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Services */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg luxury-shadow-lg p-8 lg:p-12 border border-luxury-beige fade-in">
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-luxury-gold/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <FaScrewdriverWrench className="text-3xl text-luxury-gold" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-display font-semibold text-luxury-black mb-3">
                    Which services do you need?
                  </h2>
                  <p className="text-lg text-luxury-black/70">Select all that apply so we can route to the right specialists.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 mb-10">
                  {SERVICES.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`px-4 py-3 rounded-sm border-2 font-medium text-xs transition-all duration-300 uppercase tracking-wide ${
                        project.services.includes(service)
                          ? 'bg-luxury-gold text-white border-luxury-gold luxury-shadow-lg'
                          : 'bg-white text-luxury-black border-luxury-beige hover:border-luxury-gold/50 hover:shadow-md'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => goToStep(2)}
                    className="px-6 py-3 bg-luxury-beige text-luxury-black rounded-sm font-medium hover:bg-luxury-beige/80 transition-all duration-300 flex items-center gap-2 uppercase tracking-wide text-sm"
                  >
                    <FaArrowLeft /> Back
                  </button>
                  <button
                    onClick={() => goToStep(4)}
                    disabled={!validateStep(3)}
                    className="px-8 py-4 bg-luxury-gold text-white rounded-sm font-medium hover:bg-luxury-gold/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto luxury-shadow hover-lift uppercase tracking-wide text-sm"
                  >
                    Continue <FaArrowRight />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Contact Form */}
            {currentStep === 4 && (
              <div className="bg-white rounded-lg luxury-shadow-lg p-8 lg:p-12 border border-luxury-beige fade-in">
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-luxury-gold/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <FaUserCheck className="text-3xl text-luxury-gold" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-display font-semibold text-luxury-black mb-3">
                    Who should we connect with?
                  </h2>
                  <p className="text-lg text-luxury-black/70">We'll follow up within one business day with next steps.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-xs font-medium text-luxury-black mb-2 uppercase tracking-wide">
                        First name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={contact.firstName}
                        onChange={(e) => updateContact('firstName', e.target.value)}
                        className="w-full px-4 py-3 border border-luxury-beige rounded-sm focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 bg-white text-luxury-black"
                        placeholder="Jordan"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-xs font-medium text-luxury-black mb-2 uppercase tracking-wide">
                        Last name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        value={contact.lastName}
                        onChange={(e) => updateContact('lastName', e.target.value)}
                        className="w-full px-4 py-3 border border-luxury-beige rounded-sm focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 bg-white text-luxury-black"
                        placeholder="Lee"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-xs font-medium text-luxury-black mb-2 uppercase tracking-wide">
                        Organization
                      </label>
                      <input
                        id="company"
                        type="text"
                        value={contact.company}
                        onChange={(e) => updateContact('company', e.target.value)}
                        className="w-full px-4 py-3 border border-luxury-beige rounded-sm focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 bg-white text-luxury-black"
                        placeholder="Company / Department"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-medium text-luxury-black mb-2 uppercase tracking-wide">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={contact.email}
                        onChange={(e) => updateContact('email', e.target.value)}
                        className="w-full px-4 py-3 border border-luxury-beige rounded-sm focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 bg-white text-luxury-black"
                        placeholder="you@company.com"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-medium text-luxury-black mb-2 uppercase tracking-wide">
                        Phone
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => updateContact('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-luxury-beige rounded-sm focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 bg-white text-luxury-black"
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="projectNotes" className="block text-xs font-medium text-luxury-black mb-2 uppercase tracking-wide">
                        Working title or facility
                      </label>
                      <input
                        id="projectNotes"
                        type="text"
                        value={contact.projectNotes}
                        onChange={(e) => updateContact('projectNotes', e.target.value)}
                        className="w-full px-4 py-3 border border-luxury-beige rounded-sm focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 bg-white text-luxury-black"
                        placeholder="e.g., ATL Innovation Center"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="projectDetails" className="block text-xs font-medium text-luxury-black mb-2 uppercase tracking-wide">
                      Project details
                    </label>
                    <textarea
                      id="projectDetails"
                      value={contact.projectDetails}
                      onChange={(e) => updateContact('projectDetails', e.target.value)}
                      className="w-full px-4 py-3 border border-luxury-beige rounded-sm focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 h-32 resize-none bg-white text-luxury-black"
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
                      className="mt-1 w-4 h-4 text-luxury-gold border-luxury-beige rounded focus:ring-luxury-gold"
                    />
                    <label htmlFor="newsletter" className="text-sm text-luxury-black/70">
                      Keep me informed about nationwide deployment tips and technology updates.
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => goToStep(3)}
                      className="px-6 py-3 bg-luxury-beige text-luxury-black rounded-sm font-medium hover:bg-luxury-beige/80 transition-all duration-300 flex items-center gap-2 uppercase tracking-wide text-sm"
                    >
                      <FaArrowLeft /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !validateStep(4)}
                      className="px-8 py-4 bg-luxury-gold text-white rounded-sm font-medium hover:bg-luxury-gold/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto luxury-shadow hover-lift uppercase tracking-wide text-sm"
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
            <div className="bg-white rounded-lg luxury-shadow-lg p-6 lg:p-8 border border-luxury-beige fade-in">
              <p className="text-xs uppercase tracking-wider text-luxury-gold font-semibold mb-3">Live Summary</p>
              <h3 className="text-2xl lg:text-3xl font-display font-semibold text-luxury-black mb-8">Project Snapshot</h3>

              <div className="h-px bg-gradient-to-r from-luxury-gold/20 to-transparent my-6"></div>

              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-luxury-black/60 mb-2">Project Type</p>
                  <p className="font-display font-semibold text-luxury-black">
                    {project.projectType || 'Not selected'}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-luxury-black/60 mb-2">Location & Schedule</p>
                  <p className="font-display font-semibold text-luxury-black">
                    {project.location || 'Not specified'}
                  </p>
                  <p className="text-sm text-luxury-black/70 mt-2">
                    Timeline: {project.timeline || '—'}
                  </p>
                  <p className="text-sm text-luxury-black/70">
                    Budget: {project.budget || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-luxury-black/60 mb-2">RFP Attachment</p>
                  <span className="inline-flex items-center gap-2 text-sm px-3 py-1.5 bg-luxury-beige/30 rounded-sm text-luxury-black border border-luxury-beige">
                    <FaPaperclip /> {filePreview?.name || 'No file attached'}
                  </span>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-luxury-black/60 mb-3">Services Needed</p>
                  <div className="flex flex-wrap gap-2">
                    {project.services.length > 0 ? (
                      project.services.map((service) => (
                        <span
                          key={service}
                          className="px-3 py-1 bg-luxury-gold/10 text-luxury-black rounded-sm text-xs font-medium border border-luxury-gold/20"
                        >
                          {service}
                        </span>
                      ))
                    ) : (
                      <span className="px-3 py-1 bg-luxury-beige/30 text-luxury-black/60 rounded-sm text-xs border border-luxury-beige">
                        No services selected
                      </span>
                    )}
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-luxury-gold/20 to-transparent my-6"></div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-luxury-black/60 mb-2">Primary Contact</p>
                  <p className="font-display font-semibold text-luxury-black">
                    {contact.firstName || contact.lastName
                      ? `${contact.firstName} ${contact.lastName}`.trim()
                      : '—'}
                  </p>
                  <p className="text-sm text-luxury-black/70 mt-2">
                    Organization: {contact.company || '—'}
                  </p>
                  <p className="text-sm text-luxury-black/70">
                    Email: {contact.email || '—'}
                  </p>
                  <p className="text-sm text-luxury-black/70">
                    Phone: {contact.phone || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-luxury-black/60 mb-2">Notes</p>
                  <p className="text-sm text-luxury-black/90">
                    {contact.projectDetails || contact.projectNotes || 'No additional details yet.'}
                  </p>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-luxury-beige/20 border border-luxury-gold/20 text-sm text-luxury-black">
                  Need help right away? Call <strong className="text-luxury-gold">770-637-2094</strong> or{' '}
                  <a href="/contact" className="text-luxury-gold hover:underline font-semibold">
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

