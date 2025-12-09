import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">
          Professional Network Cabling Services Nationwide
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Expert low-voltage installation and structured cabling solutions for businesses across America
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/georgia-network-cabling">Browse by State</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

