import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import {
  Download,
  Mail,
  MapPin,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  Code2,
  Globe,
  Folder,
  ExternalLink,
  Github,
  Linkedin,
  Calendar,
  ChevronRight,
  BarChart3,
  Target,
  Users,
  TrendingUp,
  Zap,
  Star,
  CheckCircle2,
  Rocket,
  User,
  X
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  useResumeExperiences,
  useResumeProjects,
  useResumeEducation,
  useResumeSkills,
  useResumeCertifications,
  useResumeLanguages,
  useResumeStats,
  useResumeHero
} from "@/hooks/use-cms";
import PillNav from "@/components/PillNav";
import FloatingActionMenu from "@/components/FloatingActionMenu";
import { useTheme } from "@/components/providers/ThemeProvider";
import gsap from "gsap";

// Animated Counter Component
function AnimatedCounter({ end, duration = 2, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const Resume = () => {
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const pillNavRef = useRef<HTMLDivElement>(null);

  // Force dark mode on Resume page
  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);

  // Animate pill navbar from top on mount (Desktop only)
  useEffect(() => {
    if (pillNavRef.current && window.innerWidth >= 768) {
      gsap.set(pillNavRef.current, {
        y: -100,
        opacity: 0,
        visibility: 'visible',
        display: 'block'
      });

      gsap.to(pillNavRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.2)",
        delay: 0.3
      });
    } else if (pillNavRef.current) {
      // On mobile, ensure it's completely hidden
      gsap.set(pillNavRef.current, {
        display: 'none',
        visibility: 'hidden',
        opacity: 0
      });
    }
  }, []);

  const iconMap: Record<string, any> = {
    briefcase: Briefcase,
    rocket: Rocket,
    award: Award,
    trendingup: TrendingUp,
    barchart3: BarChart3,
    target: Target,
    zap: Zap,
    folder: Folder,
    code2: Code2,
    globe: Globe,
    linkedin: Linkedin,
    github: Github,
    mail: Mail,
    phone: Phone,
    mappin: MapPin,
    calendar: Calendar,
    checkcircle2: CheckCircle2,
    star: Star,
    graduationcap: GraduationCap
  };
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const heroY = useTransform(smoothProgress, [0, 0.15], [0, -100]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);

  const statsY = useTransform(smoothProgress, [0.05, 0.15], [100, 0]);
  const summaryY = useTransform(smoothProgress, [0.1, 0.25], [100, 0]);
  const experienceY = useTransform(smoothProgress, [0.2, 0.35], [80, 0]);
  const projectsY = useTransform(smoothProgress, [0.3, 0.45], [80, 0]);
  const educationY = useTransform(smoothProgress, [0.4, 0.55], [80, 0]);
  const skillsY = useTransform(smoothProgress, [0.5, 0.65], [80, 0]);
  const certY = useTransform(smoothProgress, [0.6, 0.75], [80, 0]);
  const langY = useTransform(smoothProgress, [0.7, 0.85], [80, 0]);

  // Fetch hero data from CMS
  const { data: heroDataRaw } = useResumeHero();
  const heroData = heroDataRaw as any;

  // Resume Data - Enhanced with more details
  const about = {
    name: heroData?.name || "Sachin Malik",
    role: heroData?.role || "International Business Management Professional",
    bio: heroData?.bio || "Internationally oriented and ambitious postgraduate student pursuing MSc in International Business Management at GISMA University, Berlin.",
    email: heroData?.email || "sachinmalikofficial6@gmail.com",
    phone: heroData?.phone || "+49 XXX XXX XXXX",
    location: heroData?.location || "Berlin, Germany"
  };

  const professionalSummary = heroData?.professional_summary || "Internationally oriented and ambitious postgraduate student pursuing MSc in International Business Management at GISMA University, Berlin. With 2+ years of hands-on experience in management and business operations, I bring a strong understanding of global business dynamics, strategic decision-making, and data-driven insights to drive organizational growth.";

  const summaryTags = heroData?.summary_tags || ["Business Analytics", "Strategic Planning", "Team Leadership", "Data-Driven", "International Business", "Process Optimization"];

  // Statistics
  const { data: statsRaw = [] } = useResumeStats();
  const stats = statsRaw as any[];

  const { data: experiencesRaw = [] } = useResumeExperiences();
  const experiences = experiencesRaw as any[];

  // Featured Projects
  const { data: projectsRaw = [] } = useResumeProjects();
  const projects = projectsRaw as any[];

  const { data: educationRaw = [] } = useResumeEducation();
  const education = educationRaw as any[];

  const { data: skillsRaw = [] } = useResumeSkills();
  const skills = skillsRaw as any[];

  const { data: certificationsRaw = [] } = useResumeCertifications();
  const certifications = certificationsRaw as any[];

  const { data: languagesRaw = [] } = useResumeLanguages();
  const languages = languagesRaw as any[];

  const socialLinks = heroData?.social_links || [
    { platform: "LinkedIn", url: "https://www.linkedin.com/in/sachinmalik6", icon_name: "linkedin" },
    { platform: "GitHub", url: "https://github.com/sachinmalik06", icon_name: "github" }
  ];

  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, typeof skills>
  );



  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Floating Action Menu - Mobile Only */}
      <div className="fixed top-4 right-4 z-[60] md:hidden">
        <FloatingActionMenu
          options={[
            {
              label: "Home",
              onClick: () => navigate("/"),
              Icon: <User className="w-4 h-4" />,
            },
            {
              label: "About",
              onClick: () => navigate("/about"),
              Icon: <User className="w-4 h-4" />,
            },
            {
              label: "Expertise",
              onClick: () => navigate("/expertise"),
              Icon: <Briefcase className="w-4 h-4" />,
            },
            {
              label: "Contact",
              onClick: () => navigate("/contact"),
              Icon: <Mail className="w-4 h-4" />,
            },
          ]}
        />
      </div>

      {/* PILL NAV - Appears from top (Desktop Only) */}
      <div ref={pillNavRef} className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto w-full max-w-fit px-4 hidden md:block" style={{ visibility: 'hidden', opacity: 0, display: 'none' }}>
        <PillNav
          items={[
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about' },
            { label: 'Expertise', href: '/expertise' },
            { label: 'Resume', href: '/resume' },
            { label: 'Contact', href: '/contact' }
          ]}
          activeHref={location.pathname}
          baseColor="hsl(20 8% 6%)"
          pillColor="hsl(34 36% 91%)"
          hoveredPillTextColor="hsl(34 36% 91%)"
          pillTextColor="hsl(20 8% 6%)"
          initialLoadAnimation={false}
        />
      </div>

      {/* Hero Section */}
      <motion.section
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-32"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className="absolute inset-0 dot-background opacity-30" />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute -right-[300px] -top-[300px] h-[600px] w-[600px] opacity-20"
        >
          <div className="absolute inset-0 rounded-full border border-border/30" />
          <div className="absolute inset-[80px] rounded-full border border-primary/20" />
          <div className="absolute inset-[160px] rounded-full border border-foreground/10" />
        </motion.div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4 text-5xl font-bold text-foreground md:text-7xl"
          >
            {about.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 text-xl text-primary md:text-2xl"
          >
            {about.role}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              {about.email}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {about.location}
            </span>
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {about.phone}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href={heroData?.resume_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              download="Resume.pdf"
              className="group flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25"
            >
              <Download className="h-5 w-5" />
              Download Resume
            </motion.a>
            <div className="flex items-center gap-3">
              {socialLinks.map((link: any, index: number) => {
                const Icon = iconMap[link.icon_name?.toLowerCase()] || Globe;
                return (
                  <motion.a
                    key={link.id || index}
                    whileHover={{ scale: 1.1, y: -2 }}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all hover:border-primary hover:text-primary"
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex justify-center py-8"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-primary/60">Scroll to explore</span>
          <div className="h-10 w-5 rounded-full border border-border p-1">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </motion.div>

      <div className="relative mx-auto max-w-6xl px-6 pb-32">
        {/* Statistics Section */}
        <motion.section
          className="py-16"
          style={{ y: statsY }}
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {stats.map((stat, index) => {
              const Icon = iconMap[stat.icon_name?.toLowerCase()] || Briefcase;
              return (
                <motion.div
                  key={stat.id || index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-card/50 p-6 text-center transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative">
                    <Icon className={`mx-auto mb-3 h-8 w-8 ${stat.color}`} />
                    <div className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-xs text-muted-foreground md:text-sm">{stat.label}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Professional Summary */}
        <motion.section
          className="py-16"
          style={{ y: summaryY }}
        >
          <SectionHeader icon={<Code2 className="h-5 w-5" />} title="Professional Summary" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-gradient-to-br from-card to-transparent p-6 md:p-8 backdrop-blur-sm"
          >
            <p className="text-lg leading-relaxed text-muted-foreground">
              {professionalSummary}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {summaryTags.map((tag: string) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ scale: 1.1 }}
                  className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary cursor-default"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Work Experience */}
        {experiences.length > 0 && (
          <motion.section
            className="py-16"
            style={{ y: experienceY }}
          >
            <SectionHeader icon={<Briefcase className="h-5 w-5" />} title="Work Experience" />
            <div className="relative">
              <div className="absolute left-[19px] top-0 h-full w-[2px] bg-gradient-to-b from-primary via-primary/50 to-transparent md:left-1/2 md:-translate-x-1/2" />

              <div className="space-y-12">
                {experiences.map((exp, index) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    <div className="absolute left-[12px] top-0 z-10 h-4 w-4 rounded-full border-4 border-background bg-primary md:left-1/2 md:-translate-x-1/2" />

                    <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      <motion.div
                        whileHover={{ scale: 1.02, y: -4 }}
                        className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5"
                      >
                        <div className={`mb-2 flex items-center gap-2 text-sm text-primary ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                          <Calendar className="h-4 w-4" />
                          {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {exp.is_current || !exp.end_date ? "Present" : new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </div>
                        <h3 className="mb-1 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {exp.position}
                        </h3>
                        <p className="mb-3 font-medium text-primary/80">{exp.company}</p>
                        {exp.location && (
                          <p className={`mb-3 flex items-center gap-1 text-sm text-muted-foreground ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                            <MapPin className="h-3 w-3" />
                            {exp.location}
                          </p>
                        )}
                        <p className="text-sm leading-relaxed text-muted-foreground mb-4">{exp.description}</p>

                        {/* Achievements */}
                        <div className="space-y-2 mb-4">
                          {exp.achievements.map((achievement: string, i: number) => (
                            <div key={i} className={`flex items-start gap-2 text-sm text-muted-foreground ${index % 2 === 0 ? "md:flex-row-reverse md:text-right" : ""}`}>
                              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                              <span>{achievement}</span>
                            </div>
                          ))}
                        </div>

                        {/* Technologies */}
                        <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                          {exp.technologies.map((tech: string) => (
                            <span key={tech} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Featured Projects */}
        <motion.section
          className="py-16"
          style={{ y: projectsY }}
        >
          <SectionHeader icon={<Folder className="h-5 w-5" />} title="Featured Projects" />
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project, index) => {
              const ProjectIcon = iconMap[project.icon_name?.toLowerCase()] || Folder;
              return (
                <motion.div
                  key={project.id || index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -8 }}
                  className="group rounded-2xl border border-border bg-gradient-to-br from-card to-card/50 p-6 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <ProjectIcon className="h-6 w-6 text-primary" />
                    </div>
                    <Star className="h-5 w-5 text-primary/50 group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                  <div className="mb-4 flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-green-500 font-medium">{project.impact}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: string) => (
                      <span key={tech} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Education */}
        {education.length > 0 && (
          <motion.section
            className="py-16"
            style={{ y: educationY }}
          >
            <SectionHeader icon={<GraduationCap className="h-5 w-5" />} title="Education" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {education.map((edu) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <span className="rounded-full bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                      {edu.start_year}{edu.end_year && edu.end_year !== edu.start_year ? ` - ${edu.end_year}` : " - Current"}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {edu.degree}
                  </h3>
                  <p className="mb-1 font-medium text-primary/80">{edu.institution}</p>
                  {edu.location && (
                    <p className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {edu.location}
                    </p>
                  )}
                  {edu.gpa && (
                    <p className="mb-3 text-sm text-muted-foreground">GPA: {edu.gpa}</p>
                  )}
                  {edu.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {edu.highlights.map((highlight: string) => (
                        <span
                          key={highlight}
                          className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}
                  {edu.coursework && edu.coursework.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-2">Key Coursework:</p>
                      <div className="flex flex-wrap gap-1">
                        {edu.coursework.map((course: string) => (
                          <span key={course} className="text-xs text-muted-foreground/70">
                            • {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Technical Skills */}
        {Object.keys(skillsByCategory).length > 0 && (
          <motion.section
            className="py-16"
            style={{ y: skillsY }}
          >
            <SectionHeader icon={<Code2 className="h-5 w-5" />} title="Skills & Expertise" />
            <div className="space-y-8">
              {Object.entries(skillsByCategory).map(([category, categorySkills]: [string, any]) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <h3 className="mb-4 text-lg font-semibold text-foreground">{category}</h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {categorySkills.map((skill: any) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                        whileHover={{ scale: 1.03, y: -2 }}
                        className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md hover:shadow-primary/5"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {skill.name}
                          </span>
                          <span className="text-sm text-primary font-semibold">{skill.proficiency}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-card/50">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.proficiency}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <motion.section
            className="py-16"
            style={{ y: certY }}
          >
            <SectionHeader icon={<Award className="h-5 w-5" />} title="Certifications & Achievements" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.3,
                    layout: { type: "spring", stiffness: 450, damping: 40 }
                  }}
                  whileHover={{ y: -5, scale: 1.01 }}
                  layoutId={`cert-resume-${cert.id || cert.name}`}
                  onClick={() => setSelectedCert(cert)}
                  className="group relative overflow-hidden bg-card/40 backdrop-blur-md rounded-2xl border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer"
                >
                  {/* Image Header */}
                  <div className="relative h-48 w-full overflow-hidden bg-muted/20">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 z-10" />
                    {cert.image_url ? (
                      <motion.img
                        src={cert.image_url}
                        alt={cert.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Award className="w-16 h-16 text-primary/20" />
                      </div>
                    )}

                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4 z-20">
                      <span className="backdrop-blur-xl bg-primary/20 border border-primary/30 text-primary px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        {cert.year}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 relative">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {cert.name}
                      </h3>
                      <ExternalLink className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <p className="text-sm font-semibold text-primary/80 mb-3 uppercase tracking-wider">
                      {cert.issuer}
                    </p>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {cert.description}
                    </p>

                    {cert.credential_id && (
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-mono">
                          Credential ID
                        </span>
                        <span className="text-[10px] text-primary/70 font-mono bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                          {cert.credential_id}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Certification Overlay */}
            <AnimatePresence>
              {selectedCert && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    onClick={() => setSelectedCert(null)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
                  />

                  {/* Content */}
                  <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 pointer-events-none">
                    <motion.div
                      layoutId={`cert-resume-${selectedCert.id || selectedCert.name}`}
                      transition={{ type: "spring", stiffness: 500, damping: 45, mass: 0.8 }}
                      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.1 } }}
                      className="bg-[#111] backdrop-blur-2xl rounded-3xl border border-white/10 w-full max-w-2xl overflow-hidden pointer-events-auto relative shadow-2xl"
                    >
                      <button
                        onClick={() => setSelectedCert(null)}
                        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
                      >
                        <X className="w-6 h-6 text-white" />
                      </button>

                      <div className="flex flex-col md:flex-row">
                        {/* Image Area */}
                        <div className="md:w-1/2 h-64 md:h-auto relative">
                          {selectedCert.image_url ? (
                            <img
                              src={selectedCert.image_url}
                              alt={selectedCert.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10">
                              <Award className="w-24 h-24 text-primary" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent md:hidden" />
                        </div>

                        {/* Content Area */}
                        <div className="md:w-1/2 p-8">
                          <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2 block">
                            {selectedCert.issuer}
                          </span>
                          <h3 className="text-2xl font-bold text-foreground mb-4">
                            {selectedCert.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-6">
                            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/20">
                              {selectedCert.year}
                            </span>
                          </div>

                          <p className="text-muted-foreground leading-relaxed mb-8">
                            {selectedCert.description}
                          </p>

                          <div className="space-y-4">
                            {selectedCert.credential_id && (
                              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Credential ID</span>
                                <span className="text-primary font-mono text-sm">{selectedCert.credential_id}</span>
                              </div>
                            )}

                            {selectedCert.credential_url && (
                              <motion.a
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                href={selectedCert.credential_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 transition-all"
                              >
                                <ExternalLink className="w-5 h-5" />
                                Verify Certification
                              </motion.a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </>
              )}
            </AnimatePresence>
          </motion.section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <motion.section
            className="py-16"
            style={{ y: langY }}
          >
            <SectionHeader icon={<Globe className="h-5 w-5" />} title="Languages" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {languages.map((lang, index) => (
                <motion.div
                  key={lang.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-card/50 p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative flex flex-col items-center text-center">
                    {/* Language Icon */}
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Globe className="h-7 w-7 text-primary" />
                    </div>

                    {/* Language Name */}
                    <h3 className="mb-3 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {lang.name}
                    </h3>

                    {/* Proficiency Level Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2 text-sm font-medium text-primary">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      {lang.level}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* CTA Section */}
        <motion.section
          className="py-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-transparent p-8 md:p-12 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-4 text-3xl font-bold text-foreground md:text-4xl"
            >
              Let's Work Together
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mx-auto mb-8 max-w-2xl text-muted-foreground"
            >
              I'm currently open to new opportunities and exciting projects.
              Let's discuss how we can create something amazing together.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25"
                >
                  <Mail className="h-5 w-5" />
                  Get in Touch
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-xl border-2 border-border px-8 py-4 font-semibold text-foreground transition-all hover:border-primary hover:bg-card/20"
              >
                <Download className="h-5 w-5" />
                Download Resume
              </motion.button>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mb-8 flex items-center gap-3"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      <div className="h-[2px] flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
    </motion.div>
  );
}

export default Resume;
