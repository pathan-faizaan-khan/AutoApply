'use client';

import { motion } from 'framer-motion';
import { Mail, MessageSquare, Phone, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function ContactUs() {
  return (
    <div className="flex flex-col w-full bg-background min-h-screen pt-32 pb-20 relative">
      {/* Back Button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-24 left-4 md:left-8 lg:left-12 z-10"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-secondary-foreground hover:text-foreground transition-colors group font-medium px-4 py-2 rounded-full hover:bg-secondary/50">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </Link>
      </motion.div>

      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="space-y-12"
        >

          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div variants={fadeInUp} className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
              <MessageSquare className="w-10 h-10 text-primary" />
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Contact Us
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-secondary-foreground max-w-2xl mx-auto">
              Have questions, feedback, or need support? We're here to help. Reach out to us using the form below or via our direct contact information.
            </motion.p>
          </div>

          {/* Content */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-secondary/30 p-8 rounded-3xl border border-border/50 hover:border-primary/30 transition-colors h-full flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-foreground mb-8">Get in Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-background rounded-xl border border-border/50 shadow-sm">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-secondary-foreground">Email us</p>
                      <a href="mailto:support@autoapply.ai" className="text-lg font-medium text-foreground hover:text-primary transition-colors">support@autoapply.ai</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-background rounded-xl border border-border/50 shadow-sm">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-secondary-foreground">Call us</p>
                      <p className="text-lg font-medium text-foreground">+91 98765 43210</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-secondary/30 p-8 rounded-3xl border border-border/50 hover:border-primary/30 transition-colors">
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Name</label>
                  <input type="text" id="name" className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input type="email" id="email" className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="your@email.com" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">Message</label>
                  <textarea id="message" rows={4} className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none" placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40">
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
            
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
