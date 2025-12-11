import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import LeadForm from "@/components/LeadForm";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Full-Screen Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-luxury-black via-luxury-black/95 to-luxury-black/90">
        {/* Background Video */}
        <div className="absolute inset-0 bg-luxury-black">
          <video 
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40"
          >
            <source src="/assets/Servers.mp4" type="video/mp4" />
          </video>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-8 text-center text-white">
          <div className="max-w-4xl mx-auto fade-in">
            <h1 className="text-5xl lg:text-7xl font-display font-bold mb-6 leading-tight">
              Professional Network Cabling Services Nationwide
            </h1>
            <p className="text-xl lg:text-2xl font-light mb-12 text-white/90 max-w-2xl mx-auto">
              Expert low-voltage installation and structured cabling solutions for businesses across America
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-luxury-blue hover:bg-luxury-blue/90 text-white">
                <Link href="/georgia/network-cabling">Explore Services</Link>
              </Button>
              <Button asChild size="lg" className="bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 hover:border-white/50">
                <Link href="/planner">Check Availability</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="fade-in">
              <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6 text-luxury-black">
                Excellence in Every Connection
              </h2>
              <p className="text-lg text-luxury-black/70 leading-relaxed mb-6">
                JB Technologies provides certified low voltage cabling for businesses nationwide. Our experienced technicians deliver reliable network infrastructure solutions including Cat6 data cabling, fiber optic installation, and structured cabling systems.
              </p>
              <p className="text-lg text-luxury-black/70 leading-relaxed mb-8">
                With precision craftsmanship and unwavering attention to detail, we ensure your network infrastructure meets the highest standards of performance and reliability.
              </p>
              <Button asChild size="lg" variant="outline">
                <Link href="/georgia/network-cabling">Learn More</Link>
              </Button>
            </div>
            <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden luxury-shadow-lg bg-luxury-beige">
              <Image 
                src="/assets/serverr.jpg" 
                alt="Professional network cabling installation and structured cabling systems"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-24 lg:py-32 bg-luxury-offwhite">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4 text-luxury-black">
              Our Services
            </h2>
            <p className="text-lg text-luxury-black/70 max-w-2xl mx-auto">
              Comprehensive network infrastructure solutions tailored to your business needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Cat6 Data Cabling", desc: "High-performance structured cabling for modern networks" },
              { title: "Fiber Optic Installation", desc: "Lightning-fast connectivity for enterprise applications" },
              { title: "Structured Cabling Systems", desc: "Comprehensive infrastructure design and implementation" },
              { title: "Network Infrastructure", desc: "End-to-end network solutions for seamless operations" },
              { title: "Low-Voltage Installation", desc: "Professional installation of all low-voltage systems" },
              { title: "Network Design & Consulting", desc: "Expert guidance for optimal network architecture" },
            ].map((service, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg p-8 luxury-shadow hover-lift transition-all duration-300 fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-xl font-display font-semibold mb-3 text-luxury-black">
                  {service.title}
                </h3>
                <p className="text-luxury-black/70 leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Form */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Content */}
              <div className="fade-in">
                <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6 text-luxury-black">
                  Request a Quote
                </h2>
                <p className="text-lg text-luxury-black/70 leading-relaxed mb-8">
                  Let our team of experts provide you with a customized quote for your network cabling needs. We'll respond within one business day with detailed information and next steps.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-luxury-blue/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-luxury-blue"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-luxury-black mb-1">Expert Consultation</h4>
                      <p className="text-sm text-luxury-black/70">Professional assessment of your requirements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-luxury-blue/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-luxury-blue"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-luxury-black mb-1">Custom Solutions</h4>
                      <p className="text-sm text-luxury-black/70">Tailored to your specific business needs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-luxury-blue/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-luxury-blue"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-luxury-black mb-1">Rapid Response</h4>
                      <p className="text-sm text-luxury-black/70">Quick turnaround on all inquiries</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead Form */}
              <div className="lg:sticky lg:top-24 fade-in">
                <LeadForm city="Your City" state="Your State" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Large Image Banner */}
      <section className="relative h-96 lg:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-black via-luxury-black/95 to-luxury-black/90">
          <Image 
            src="/assets/serverr.jpg" 
            alt="Network infrastructure and structured cabling systems"
            fill
            className="object-cover opacity-50"
            sizes="100vw"
          />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Contact us today to discuss your project
            </p>
            <Button asChild size="lg" className="bg-luxury-blue hover:bg-luxury-blue/90 text-white">
              <Link href="/planner">Start Your Project</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

