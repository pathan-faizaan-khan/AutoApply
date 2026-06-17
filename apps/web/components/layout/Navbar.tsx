"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '../ui/ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled
          ? 'bg-background/70 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]'
          : 'bg-transparent py-2'
        }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <Image src="/logo.ico" alt="Auto Apply AI Logo" width={40} height={40} className="rounded-xl object-contain" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
              AutoApplyAI
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 bg-secondary/50 dark:bg-secondary/30 backdrop-blur-md px-6 py-2.5 rounded-full border border-border/50">
            <Link href="/#why-us" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">Why Us</Link>
            <Link href="/#features" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">Features</Link>
            <Link href="/#platforms" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">Platforms</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors px-3 py-2">
              Log in
            </Link>
            <Link href="/signup" className="relative group overflow-hidden rounded-full p-[1px]">
              <span className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-primary rounded-full animate-[spin_3s_linear_infinite] opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-background text-foreground px-5 py-2 rounded-full font-semibold text-sm transition-all group-hover:bg-transparent group-hover:text-white">
                Get Started
              </div>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button className="p-2 text-foreground rounded-full hover:bg-secondary/80 transition-colors" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 w-full border-b border-border bg-background/95 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex flex-col px-6 py-8 gap-6">
              <Link href="/#why-us" className="text-lg font-semibold text-foreground/90 hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>Why Us</Link>
              <Link href="/#features" className="text-lg font-semibold text-foreground/90 hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>Features</Link>
              <Link href="/#platforms" className="text-lg font-semibold text-foreground/90 hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>Platforms</Link>
              <div className="h-px bg-border/50 my-2" />
              <div className="flex flex-col gap-4">
                <Link href="/login" className="w-full py-3 text-center text-base font-semibold text-foreground rounded-xl border border-border hover:bg-secondary transition-colors" onClick={() => setIsOpen(false)}>Log in</Link>
                <Link href="/signup" className="w-full text-center text-base font-semibold bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-3 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all" onClick={() => setIsOpen(false)}>
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
