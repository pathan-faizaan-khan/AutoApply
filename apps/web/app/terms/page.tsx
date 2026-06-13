'use client';

import { motion } from 'framer-motion';
import { Scale, FileCheck, AlertTriangle, CreditCard, HelpCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function TermsOfService() {
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
              <Scale className="w-10 h-10 text-primary" />
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Terms of Service
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
                  <FileCheck className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">1. Acceptance of Terms</h2>
              </div>
              <p className="mb-4">
                By accessing and using Auto Apply AI ("we", "us", "our"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, you should not use our services.
              </p>
              <p>
                We may modify these Terms of Service at any time. We will notify you of any significant changes, and your continued use of our platform signifies your acceptance of the updated terms.
              </p>
            </div>

            <div className="bg-secondary/30 p-8 md:p-10 rounded-3xl border border-border/50 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-background rounded-xl border border-border/50 shadow-sm">
                  <HelpCircle className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">2. User Accounts</h2>
              </div>
              <p className="mb-4">
                To use certain features of our platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to keep it updated.
              </p>
              <p>
                You are responsible for safeguarding the password that you use to access your account and for any activities or actions under your account. We encourage you to use strong, unique passwords.
              </p>
            </div>

            <div className="bg-secondary/30 p-8 md:p-10 rounded-3xl border border-border/50 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-background rounded-xl border border-border/50 shadow-sm">
                  <AlertTriangle className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">3. Acceptable Use</h2>
              </div>
              <p className="mb-4">
                You agree not to use our services to:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4 text-foreground/80">
                <li>Submit false, inaccurate, or misleading information in your job applications.</li>
                <li>Automate applications in a manner that violates the terms of service of third-party job boards.</li>
                <li>Interfere with or disrupt the integrity or performance of our services.</li>
                <li>Attempt to gain unauthorized access to our platform or related systems.</li>
              </ul>
            </div>

            <div className="bg-secondary/30 p-8 md:p-10 rounded-3xl border border-border/50 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-background rounded-xl border border-border/50 shadow-sm">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">4. Subscriptions & Payments</h2>
              </div>
              <p>
                Some features of Auto Apply AI may be billed on a subscription basis. You will be billed in advance on a recurring and periodic basis depending on your subscription plan. All payments are non-refundable unless otherwise explicitly stated in our refund policy or required by law.
              </p>
            </div>

            <div className="bg-secondary/30 p-8 md:p-10 rounded-3xl border border-border/50 hover:border-primary/30 transition-colors">
              <h2 className="text-2xl font-bold text-foreground mb-6">5. Limitation of Liability</h2>
              <p>
                In no event shall Auto Apply AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
              </p>
            </div>

            <div className="bg-secondary/30 p-8 md:p-10 rounded-3xl border border-border/50 hover:border-primary/30 transition-colors">
              <h2 className="text-2xl font-bold text-foreground mb-6">6. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at <a href="mailto:support@autoapply.ai" className="text-primary hover:underline font-medium">support@autoapply.ai</a>.
              </p>
            </div>
            
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
