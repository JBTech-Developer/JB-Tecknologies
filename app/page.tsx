import Link from "next/link";
import { Button } from "@/components/ui/button";
import LeadForm from "@/components/LeadForm";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Main Content */}
        <div>
          <h1 className="text-4xl font-bold mb-6">
            Professional Network Cabling Services Nationwide
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Expert low-voltage installation and structured cabling solutions for businesses across America
          </p>
          <p className="text-lg mb-8">
            JB Technologies provides certified low voltage cabling for businesses nationwide. Our experienced technicians deliver reliable network infrastructure solutions including Cat6 data cabling, fiber optic installation, and structured cabling systems.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/georgia/network-cabling">Browse by State</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/planner">Project Planning Tool</Link>
            </Button>
          </div>
        </div>

        {/* Lead Form */}
        <div className="lg:sticky lg:top-4">
          <LeadForm city="Your City" state="Your State" />
        </div>
      </div>
    </div>
  );
}

