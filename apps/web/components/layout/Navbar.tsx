"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/favicon.ico" alt="Auto Apply AI Logo" width={32} height={32} className="rounded-md" />
            <Link href="/" className="font-bold text-xl tracking-tight text-foreground">
              Auto Apply AI
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-secondary-foreground hover:text-primary transition-colors">Features</Link>
            <Link href="#why-us" className="text-sm font-medium text-secondary-foreground hover:text-primary transition-colors">Why Us</Link>
            <Link href="#platforms" className="text-sm font-medium text-secondary-foreground hover:text-primary transition-colors">Platforms</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:opacity-90 transition-opacity shadow-sm">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background"
          >
            <div className="flex flex-col px-4 py-6 gap-4">
              <Link href="#features" className="text-base font-medium text-secondary-foreground" onClick={() => setIsOpen(false)}>Features</Link>
              <Link href="#why-us" className="text-base font-medium text-secondary-foreground" onClick={() => setIsOpen(false)}>Why Us</Link>
              <Link href="#platforms" className="text-base font-medium text-secondary-foreground" onClick={() => setIsOpen(false)}>Platforms</Link>
              <div className="h-px bg-border my-2" />
              <Link href="/login" className="text-base font-medium text-foreground" onClick={() => setIsOpen(false)}>Log in</Link>
              <Link href="/signup" className="w-full text-center text-base font-medium bg-primary text-primary-foreground px-4 py-3 rounded-full" onClick={() => setIsOpen(false)}>
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
