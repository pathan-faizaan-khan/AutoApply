'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import {
  FileText,
  Target,
  MousePointerClick,
  CheckSquare,
  LayoutDashboard,
  CalendarDays,
  ArrowRight,
  PlayCircle,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
};


const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="flex flex-col w-full bg-background overflow-hidden" ref={containerRef}>
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 flex justify-center items-start">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 md:pt-48 md:pb-32 px-4 flex flex-col items-center justify-center min-h-[90vh]">
        <motion.div style={{ y: y1, opacity: opacity1 }} className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -z-10" />
        <motion.div style={{ y: y2, opacity: opacity1 }} className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] -z-10" />

        <div className="container relative mx-auto flex flex-col items-center text-center">
          <motion.div
            initial="hidden" animate="visible" variants={staggerContainer}
            className="max-w-5xl space-y-8 flex flex-col items-center"
          >

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground leading-[1.1]">
              Accelerate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-primary animate-gradient-x">
                Career Growth
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-secondary-foreground max-w-3xl mx-auto leading-relaxed font-medium">
              Apply to jobs faster with intelligent automation, AI resume optimization, and smart job matching — all from one unified platform.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-8 w-full sm:w-auto">
              <Link href="http://localhost:3008" className="relative group w-full sm:w-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-300 group-hover:duration-200" />
                <button className="relative w-full sm:w-auto px-10 py-5 bg-background text-foreground rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:bg-transparent hover:text-white transition-all">
                  Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="#demo" className="w-full sm:w-auto px-10 py-5 bg-secondary text-foreground rounded-full font-bold text-lg hover:bg-secondary/80 transition-all flex items-center justify-center gap-3 border border-border/50 backdrop-blur-sm">
                <PlayCircle className="w-5 h-5 text-primary" /> Watch Demo
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="relative z-10 py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
                Why Choose <span className="text-primary">Auto Apply AI?</span>
              </h2>
              <p className="text-xl text-secondary-foreground leading-relaxed">
                Searching and applying for jobs manually takes time and effort. We simplify the entire process by automating repetitive tasks and helping you manage everything from a centralized dashboard.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-500/20 rounded-3xl transform rotate-3 scale-105 blur-xl -z-10" />
              <div className="bg-background/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-border/50 shadow-2xl">
                <ul className="space-y-6">
                  {[
                    "Save valuable time during the job application process",
                    "Automatically apply to multiple jobs with ease",
                    "Improve resume compatibility and visibility for recruiters",
                    "Track applications, interviews, and notifications efficiently",
                    "Receive smart AI-powered job recommendations"
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-4 p-4 rounded-2xl hover:bg-secondary/50 transition-colors border border-transparent hover:border-border/50"
                    >
                      <div className="bg-primary/10 p-2 rounded-full shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-foreground font-semibold text-lg">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Highlights / Stats (Removed specific numbers as requested) */}
      <section className="relative z-10 py-16 bg-secondary/30 border-y border-border/50 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-border/50">
            {[
              { label: "Applications Successfully Automated" },
              { label: "High Application Match Accuracy" },
              { label: "Interview Notifications Managed" },
              { label: "Smart Automation Support" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center justify-center p-6 space-y-3 group"
              >
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center shadow-sm border border-border/50 group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div className="text-base md:text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Powerful Features (Bento Grid) */}
      <section id="features" className="relative z-10 py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold mb-6"
            >
              <LayoutDashboard className="w-4 h-4" /> Comprehensive Toolkit
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6">Powerful Features</h2>
            <p className="text-xl text-secondary-foreground font-medium">Everything you need to land your dream job faster and smarter, engineered into one beautiful platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {[
              {
                icon: FileText,
                title: "AI Resume Optimization",
                desc: "Improve resume compatibility using AI-powered keyword analysis and skill enhancement suggestions.",
                className: "md:col-span-1 md:row-span-1 bg-gradient-to-br from-background to-secondary/30",
                href: "http://localhost:3008/ats-checker"
              },
              {
                icon: Target,
                title: "Smart Job Matching",
                desc: "Get AI-based job recommendations with accurate match percentage analysis.",
                className: "md:col-span-1 md:row-span-1 bg-gradient-to-bl from-background to-blue-500/5",
                href: "http://localhost:3008"
              },
              {
                icon: MousePointerClick,
                title: "One-Click Auto Apply",
                desc: "Apply automatically to jobs using Chrome Extension integration without repeatedly filling forms.",
                className: "md:col-span-1 md:row-span-1 bg-gradient-to-t from-primary/5 to-background",
                href: "http://localhost:3008"
              },
              {
                icon: CalendarDays,
                title: "Interview Management",
                desc: "Receive interview reminders and manage schedules directly from the dashboard.",
                className: "md:col-span-1 md:row-span-1 bg-background",
                href: "http://localhost:3008/interviews"
              },
              {
                icon: LayoutDashboard,
                title: "Dashboard Analytics",
                desc: "Track applications, interviews, notifications, pending responses, and success rate from one smart dashboard.",
                className: "md:col-span-1 md:row-span-1 bg-gradient-to-r from-secondary/50 to-background",
                href: "http://localhost:3008"
              },
              {
                icon: CheckSquare,
                title: "ATS Compatibility",
                desc: "Analyze resumes and improve chances of getting shortlisted.",
                className: "md:col-span-1 md:row-span-1 bg-background",
                href: "http://localhost:3008/ats-checker"
              }
            ].map((feature, i) => {
              const CardContent = (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:shadow-primary/20 transition-all duration-300">
                        <feature.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-foreground">{feature.title}</h3>
                    </div>
                    <p className="text-secondary-foreground font-medium text-lg leading-relaxed">{feature.desc}</p>
                  </div>
                </>
              );

              const cardClass = `w-full relative group overflow-hidden rounded-3xl border border-border/50 p-8 flex flex-col hover:border-primary/50 transition-colors ${feature.className}`;

               return (
                <Link key={i} href={feature.href} className="flex w-full">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={cardClass}
                  >
                    {CardContent}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supported Platforms (Infinite Ticker Style) */}
      <section id="platforms" className="relative z-10 py-24 bg-background border-y border-border/50 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Seamlessly Integrates With Top Platforms</h2>
        </div>

        {/* Simple infinite scroll CSS animation structure */}
        <div className="relative w-full flex overflow-x-hidden">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-16 md:gap-24 px-8">
            {[
              { name: "LinkedIn", url: "https://www.linkedin.com/jobs" },
              { name: "Indeed", url: "https://www.indeed.com" },
              { name: "Naukri", url: "https://www.naukri.com" },
              { name: "Glassdoor", url: "https://www.glassdoor.com" },
              { name: "Wellfound", url: "https://wellfound.com" },
              { name: "ZipRecruiter", url: "https://www.ziprecruiter.com" },
              { name: "LinkedIn", url: "https://www.linkedin.com/jobs" },
              { name: "Indeed", url: "https://www.indeed.com" },
              { name: "Naukri", url: "https://www.naukri.com" },
              { name: "Glassdoor", url: "https://www.glassdoor.com" },
            ].map((platform, i) => (
              <a
                key={i}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl md:text-5xl font-black text-foreground/20 hover:text-primary transition-colors duration-300 cursor-pointer"
              >
                {platform.name}
              </a>
            ))}
          </div>
        </div>

        {/* Fade edges */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-background to-transparent z-10" />
      </section>

      {/* CTA */}
      <section className="relative z-10 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none" />
        <div className="container relative mx-auto px-4 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="bg-secondary/50 backdrop-blur-3xl border border-border/50 p-12 md:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden"
          >
            {/* Glow effect behind CTA */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.15),transparent_60%)] -z-10" />

            <h2 className="text-4xl md:text-6xl font-black text-foreground mb-8">Start Your Smart Job Search Today</h2>
            <p className="text-xl md:text-2xl text-secondary-foreground leading-relaxed max-w-2xl mx-auto mb-12 font-medium">
              Simplify your entire job application journey using AI-powered automation, smart resume optimization, and centralized job management tools.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="http://localhost:3008" className="relative group w-full sm:w-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300" />
                <button className="relative w-full sm:w-auto px-10 py-5 bg-foreground text-background rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform">
                  Start Free <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <button className="w-full sm:w-auto px-10 py-5 bg-background text-foreground rounded-full font-bold text-lg hover:bg-secondary transition-all flex items-center justify-center border border-border shadow-sm hover:shadow-md">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee Animation Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}} />
    </div>
  );
}
