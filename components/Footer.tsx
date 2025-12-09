export default function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-4">JB Technologies</h3>
            <p className="text-sm text-muted-foreground">
              Professional network cabling and low-voltage installation services nationwide.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Services</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>Cat6 Data Cabling</li>
              <li>Fiber Optic Installation</li>
              <li>Structured Cabling Systems</li>
              <li>Network Infrastructure</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <p className="text-sm text-muted-foreground">
              Phone: 1-800-555-0199<br />
              Email: info@jbtech.com
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} JB Technologies. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

