import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Globe } from "lucide-react";
import { useTimeline, useAboutFooterText } from "@/hooks/use-cms";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

const About = () => {
  const { data: timelineData, isLoading } = useTimeline();
  const [aboutSettings, setAboutSettings] = useState<any>(null);

  useEffect(() => {
    fetchAboutSettings();
  }, []);

  const fetchAboutSettings = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', 'home_about')
      .single();
    
    if (data) setAboutSettings((data as any).value);
  };
  
  // Separate work experience and education from timeline
  const workExperience = timelineData?.filter((entry: any) => 
    entry.category === 'work' && entry.is_active
  ) || [];
  
  const education = timelineData?.filter((entry: any) => 
    entry.category === 'education' && entry.is_active !== false
  ) || [];

  // Default data as fallback
  const defaultExperience = {
    title: "Senior Management Associate",
    company: "Dainik Bhaskar – Panipat, India",
    period: "Jan 2022 – Sep 2023",
    description: [
      "Directed daily business operations and department coordination",
      "Developed and executed strategic plans to enhance market reach",
      "Utilized data analysis to identify performance trends"
    ]
  };

  const defaultEducation = [
    {
      degree: "MSc International Business Management",
      institution: "GISMA University, Berlin",
      period: "Current"
    },
    {
      degree: "Master of Commerce (M.Com)",
      institution: "Kurukshetra University",
      period: "2021 – 2023"
    },
    {
      degree: "Bachelor of Commerce (B.Com)",
      institution: "Kurukshetra University",
      period: "2016 – 2019"
    }
  ];

  return (
    <section id="about" className="min-h-screen bg-background px-4 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.4 }}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start"
        >
          <div className="space-y-6 md:space-y-8">
            <motion.span
              className="text-primary text-sm font-medium uppercase tracking-widest"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, amount: 0.5, margin: "0px 0px -100px 0px" }}
              transition={{ delay: 0.2 }}
            >
              {aboutSettings?.subtitle || "About Me"}
            </motion.span>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
              {aboutSettings?.title || "Driven by ambition & global perspective"}
            </h2>
            
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              {aboutSettings?.paragraph1 || "I am an internationally oriented and ambitious postgraduate student currently pursuing an MSc in International Business Management at GISMA University of Applied Sciences, Potsdam Campus Berlin. With a solid academic background in Commerce and over 2 years of hands-on experience in management and business operations, I bring a strong understanding of global business dynamics and strategic decision-making."}
            </p>
            
            {aboutSettings?.paragraph2 && (
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed hidden md:block">
                {aboutSettings.paragraph2}
              </p>
            )}
            
            <div className="flex flex-wrap gap-4 md:gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-xl md:text-2xl font-bold text-foreground">2+</h4>
                  <p className="text-muted-foreground text-xs md:text-sm">Years Experience</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-xl md:text-2xl font-bold text-foreground">MSc</h4>
                  <p className="text-muted-foreground text-xs md:text-sm">Business Management</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Globe className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-semibold text-foreground">{aboutSettings?.keyPoint3 || "Data-Driven"}</h4>
                </div>
              </div>
            </div>
          </div>
          
          {/* Work Experience & Education */}
          <motion.div
            className="space-y-6 md:space-y-8"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Work Experience */}
            <div className="bg-card rounded-2xl p-5 md:p-6 border border-border">
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Work Experience
              </h3>
              <div className="space-y-4">
                {!isLoading && workExperience.length > 0 ? (
                  workExperience.map((item: any) => (
                    <div key={item.id} className="border-l-2 border-primary/30 pl-4">
                      <h4 className="font-semibold text-foreground text-sm md:text-base">{item.title}</h4>
                      <p className="text-primary text-xs md:text-sm">{item.subtitle || item.company}</p>
                      <p className="text-muted-foreground text-xs md:text-sm">{item.date_range || item.period}</p>
                      {item.description && (
                        <ul className="mt-2 text-xs md:text-sm text-muted-foreground space-y-1">
                          {item.description.split('\n').map((line: string, i: number) => (
                            line.trim() && <li key={i}>• {line.replace(/^[•\-]\s*/, '')}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="border-l-2 border-primary/30 pl-4">
                    <h4 className="font-semibold text-foreground text-sm md:text-base">{defaultExperience.title}</h4>
                    <p className="text-primary text-xs md:text-sm">{defaultExperience.company}</p>
                    <p className="text-muted-foreground text-xs md:text-sm">{defaultExperience.period}</p>
                    <ul className="mt-2 text-xs md:text-sm text-muted-foreground space-y-1">
                      {defaultExperience.description.map((line: string, i: number) => (
                        <li key={i}>• {line}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="bg-card rounded-2xl p-5 md:p-6 border border-border">
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Education
              </h3>
              <div className="space-y-4">
                {!isLoading && education.length > 0 ? (
                  education.map((entry: any) => (
                    <div key={entry.id} className="border-l-2 border-primary/30 pl-4">
                      <h4 className="font-semibold text-foreground text-sm md:text-base">{entry.title}</h4>
                      <p className="text-primary text-xs md:text-sm">{entry.subtitle || entry.institution}</p>
                      <p className="text-muted-foreground text-xs md:text-sm">{entry.date_range || entry.period}</p>
                    </div>
                  ))
                ) : (
                  defaultEducation.map((entry, index) => (
                    <div key={index} className="border-l-2 border-primary/30 pl-4">
                      <h4 className="font-semibold text-foreground text-sm md:text-base">{entry.degree}</h4>
                      <p className="text-primary text-xs md:text-sm">{entry.institution}</p>
                      <p className="text-muted-foreground text-xs md:text-sm">{entry.period}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
