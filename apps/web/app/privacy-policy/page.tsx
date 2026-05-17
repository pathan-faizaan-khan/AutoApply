'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function PrivacyPolicy() {
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
              <Shield className="w-10 h-10 text-primary" />
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Privacy Policy
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-secondary-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </motion.p>
          </div>

          {/* Content */}
          <motion.div variants={fadeInUp} className="space-y-8 text-secondary-foreground leading-relaxed text-lg">
            
            <div className="bg-secondary/30 p-8 md:p-10 rounded-3xl border border-border/50 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-background rounded-xl border border-border/50 shadow-sm">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">1. Information We Collect</h2>
              </div>
              <p className="mb-4">
                We collect information you provide directly to us when you create an account, use our services, or communicate with us. This may include your name, email address, resume data, and job application history.
              </p>
              <p>
                We also automatically collect certain information about your device and how you interact with our platform, including IP addresses, browser types, and usage data to improve our services.
              </p>
            </div>

            <div className="bg-secondary/30 p-8 md:p-10 rounded-3xl border border-border/50 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-background rounded-xl border border-border/50 shadow-sm">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">2. How We Use Your Information</h2>
              </div>
              <p className="mb-4">
                We use the information we collect to provide, maintain, and improve our services, to process your job applications automatically, and to communicate with you about your account and our services. 
              </p>
              <p>
                We do not sell your personal data to third parties. Your data is strictly used to facilitate your job search and application processes as intended by our platform features.
              </p>
            </div>

            <div className="bg-secondary/30 p-8 md:p-10 rounded-3xl border border-border/50 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-background rounded-xl border border-border/50 shadow-sm">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">3. Data Security</h2>
              </div>
              <p>
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage. We use industry-standard encryption protocols to secure your data in transit and at rest. However, please be aware that no internet transmission is completely secure.
              </p>
            </div>

            <div className="bg-secondary/30 p-8 md:p-10 rounded-3xl border border-border/50 hover:border-primary/30 transition-colors">
              <h2 className="text-2xl font-bold text-foreground mb-6">4. Your Rights</h2>
              <p>
                Depending on your location, you may have rights to access, correct, or delete your personal data. You can manage most of your data directly through your account dashboard or by contacting our support team. We will respond to your requests in accordance with applicable data protection laws.
              </p>
            </div>

            <div className="bg-secondary/30 p-8 md:p-10 rounded-3xl border border-border/50 hover:border-primary/30 transition-colors">
              <h2 className="text-2xl font-bold text-foreground mb-6">5. Contact Us</h2>
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please don't hesitate to reach out to our privacy team at <a href="mailto:privacy@autoapply.ai" className="text-primary hover:underline font-medium">privacy@autoapply.ai</a>.
              </p>
            </div>
            
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}