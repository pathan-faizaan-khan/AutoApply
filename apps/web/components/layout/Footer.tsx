import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link href="/" className="font-bold text-xl tracking-tight text-foreground mb-4 block">
              Auto Apply AI
            </Link>
            <p className="text-secondary-foreground text-sm max-w-xs leading-relaxed">
              Your Smart AI-Powered Job Application Assistant. Apply to jobs faster with intelligent automation, AI resume optimization, and centralized tracking.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link href="#features" className="text-sm text-secondary-foreground hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="#why-us" className="text-sm text-secondary-foreground hover:text-primary transition-colors">Why Us</Link></li>
              <li><Link href="#platforms" className="text-sm text-secondary-foreground hover:text-primary transition-colors">Integrations</Link></li>
              <li><Link href="/pricing" className="text-sm text-secondary-foreground hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-sm text-secondary-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-secondary-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-secondary-foreground">
            © {new Date().getFullYear()} Auto Apply AI. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-secondary-foreground hover:text-primary transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
