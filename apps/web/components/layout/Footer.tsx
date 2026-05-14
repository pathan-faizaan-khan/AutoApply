import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full relative overflow-hidden bg-background border-t border-border/50 pt-20 pb-10">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-tr from-primary to-blue-500 p-[1px] rounded-xl">
                <div className="bg-background rounded-[10px] p-1">
                  <Image src="/favicon.ico" alt="Auto Apply AI Logo" width={24} height={24} className="rounded-md" />
                </div>
              </div>
              <Link href="/" className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                Auto Apply AI
              </Link>
            </div>
            <p className="text-secondary-foreground text-base max-w-sm leading-relaxed mb-6">
              Your Smart AI-Powered Job Application Assistant. Apply to jobs faster with intelligent automation, AI resume optimization, and centralized tracking.
            </p>
          </div>
          
          <div className="md:col-span-2 md:col-start-7">
            <h4 className="font-bold text-foreground mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link href="#features" className="text-sm font-medium text-secondary-foreground hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="#why-us" className="text-sm font-medium text-secondary-foreground hover:text-primary transition-colors">Why Us</Link></li>
              <li><Link href="#platforms" className="text-sm font-medium text-secondary-foreground hover:text-primary transition-colors">Integrations</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="font-bold text-foreground mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="text-sm font-medium text-secondary-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm font-medium text-secondary-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-medium text-secondary-foreground/80">
            © {new Date().getFullYear()} Auto Apply AI. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              <span className="sr-only">Twitter</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
