import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="container mx-auto px-6 lg:px-8 py-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-luxury-black/40 mx-2" />
              )}
              {isLast ? (
                <span className="text-luxury-black font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="text-luxury-black/70 hover:text-luxury-blue transition-colors duration-300"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-luxury-black/70">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

