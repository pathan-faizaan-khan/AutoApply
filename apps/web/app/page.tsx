'use client';

import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  FileText, 
  Target, 
  MousePointerClick, 
  CheckSquare, 
  LayoutDashboard, 
  CalendarDays,
  ArrowRight,
  PlayCircle
} from 'lucide-react';
import Link from 'next/link';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-32 md:pt-32 md:pb-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container relative mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-center text-center">
          <motion.div 
            initial="hidden" animate="visible" variants={staggerContainer}
            className="max-w-4xl space-y-8"
          >
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground">
              AUTO APPLY <span className="text-primary">AI</span>
              <br />
              <span className="text-3xl md:text-5xl lg:text-5xl font-bold mt-4 block text-secondary-foreground">Your Smart AI-Powered Job Application Assistant</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-secondary-foreground max-w-2xl mx-auto leading-relaxed">
              Apply to jobs faster with intelligent automation, AI resume optimization, ATS checking, smart job matching, and centralized application tracking — all in one platform.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/25 hover:-translate-y-1">
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#demo" className="w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground rounded-full font-semibold text-lg hover:bg-secondary/80 transition-all flex items-center justify-center gap-2 border border-border">
                <PlayCircle className="w-5 h-5" /> View Demo
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="py-20 md:py-32 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Why Choose Auto Apply AI?</h2>
              <p className="text-lg text-secondary-foreground leading-relaxed">
                Searching and applying for jobs manually takes time and effort. Auto Apply AI simplifies the entire process by automating repetitive tasks and helping users manage everything from one centralized dashboard.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.6 }}
              className="bg-background rounded-2xl p-8 shadow-sm border border-border"
            >
              <ul className="space-y-4">
                {[
                  "Save valuable time during the job application process",
                  "Automatically apply to multiple jobs with ease",
                  "Improve resume ATS compatibility and visibility",
                  "Track applications, interviews, and notifications efficiently",
                  "Receive smart AI-powered job recommendations"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Powerful Features */}
      <section id="features" className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">Powerful Features</h2>
            <p className="text-lg text-secondary-foreground">Everything you need to land your dream job faster and smarter.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "AI Resume Optimization",
                desc: "Improve resume ATS compatibility using AI-powered keyword analysis and skill enhancement suggestions."
              },
              {
                icon: Target,
                title: "Smart Job Matching",
                desc: "Get AI-based job recommendations with accurate match percentage analysis based on your skills and experience."
              },
              {
                icon: MousePointerClick,
                title: "One-Click Auto Apply",
                desc: "Apply automatically to jobs using Chrome Extension integration without repeatedly filling forms."
              },
              {
                icon: CheckSquare,
                title: "ATS Compatibility Check",
                desc: "Analyze resumes and improve chances of getting shortlisted by Applicant Tracking Systems used by companies."
              },
              {
                icon: LayoutDashboard,
                title: "Dashboard Analytics",
                desc: "Track applications, interviews, notifications, pending responses, and success rate from one smart dashboard."
              },
              {
                icon: CalendarDays,
                title: "Interview Management",
                desc: "Receive interview reminders, meeting notifications, and manage interview schedules directly from the dashboard."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-background p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-secondary-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights / Stats */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-primary-foreground/20">
            {[
              { val: "10,000+", label: "Applications Automated" },
              { val: "95%", label: "ATS Match Accuracy" },
              { val: "500+", label: "Interviews Managed" },
              { val: "24/7", label: "Smart Automation" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-center justify-center space-y-2 p-4"
              >
                <div className="text-4xl md:text-5xl font-black">{stat.val}</div>
                <div className="text-sm md:text-base font-medium text-primary-foreground/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Platforms */}
      <section id="platforms" className="py-20 bg-background border-b border-border">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-12">Seamlessly Integrates With Top Platforms</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {["LinkedIn", "Indeed", "Naukri", "Glassdoor", "Wellfound", "ZipRecruiter"].map((platform, i) => (
              <div key={i} className="text-xl md:text-3xl font-black text-secondary-foreground">
                {platform}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-secondary/50">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Start Your Smart Job Search Today</h2>
            <p className="text-xl text-secondary-foreground leading-relaxed max-w-2xl mx-auto">
              Simplify your entire job application journey using AI-powered automation, smart resume optimization, and centralized job management tools.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2">
                Start Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/features" className="w-full sm:w-auto px-8 py-4 bg-background text-foreground rounded-full font-semibold text-lg hover:bg-secondary transition-all flex items-center justify-center border border-border">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
