import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            JB Technologies
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link href="/georgia/network-cabling" className="text-sm font-medium hover:text-primary">
              Services
            </Link>
          </nav>
          <Button asChild size="sm" className="md:hidden">
            <Link href="/georgia/atlanta-network-cabling">Get Quote</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

