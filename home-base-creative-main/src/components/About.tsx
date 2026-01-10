import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Globe } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="min-h-screen bg-background px-4 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start"
        >
          <div className="space-y-6 md:space-y-8">
            <motion.span
              className="text-primary text-sm font-medium uppercase tracking-widest"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ delay: 0.2 }}
            >
              About Me
            </motion.span>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
              Driven by ambition & global perspective
            </h2>
            
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              I am an internationally oriented and ambitious postgraduate student currently pursuing an MSc in International Business Management at GISMA University of Applied Sciences, Potsdam Campus Berlin. With a solid academic background in Commerce and over 2 years of hands-on experience in management and business operations, I bring a strong understanding of global business dynamics and strategic decision-making.
            </p>
            
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed hidden md:block">
              My strengths lie in business analytics, financial planning, and cross-functional leadership. I am passionate about working in multicultural environments and thrive in fast-paced, innovation-driven settings.
            </p>
            
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
                  <h4 className="text-xl md:text-2xl font-bold text-foreground">Berlin</h4>
                  <p className="text-muted-foreground text-xs md:text-sm">Germany</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Work Experience & Education */}
          <motion.div
            className="space-y-6 md:space-y-8"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Work Experience */}
            <div className="bg-card rounded-2xl p-5 md:p-6 border border-border">
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Work Experience
              </h3>
              <div className="space-y-4">
                <div className="border-l-2 border-primary/30 pl-4">
                  <h4 className="font-semibold text-foreground text-sm md:text-base">Senior Management Associate</h4>
                  <p className="text-primary text-xs md:text-sm">Dainik Bhaskar – Panipat, India</p>
                  <p className="text-muted-foreground text-xs md:text-sm">Jan 2022 – Sep 2023</p>
                  <ul className="mt-2 text-xs md:text-sm text-muted-foreground space-y-1">
                    <li>• Directed daily business operations and department coordination</li>
                    <li>• Developed and executed strategic plans to enhance market reach</li>
                    <li>• Utilized data analysis to identify performance trends</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-card rounded-2xl p-5 md:p-6 border border-border">
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Education
              </h3>
              <div className="space-y-4">
                <div className="border-l-2 border-primary/30 pl-4">
                  <h4 className="font-semibold text-foreground text-sm md:text-base">MSc International Business Management</h4>
                  <p className="text-primary text-xs md:text-sm">GISMA University, Berlin</p>
                  <p className="text-muted-foreground text-xs md:text-sm">Current</p>
                </div>
                <div className="border-l-2 border-primary/30 pl-4">
                  <h4 className="font-semibold text-foreground text-sm md:text-base">Master of Commerce (M.Com)</h4>
                  <p className="text-primary text-xs md:text-sm">Kurukshetra University</p>
                  <p className="text-muted-foreground text-xs md:text-sm">2021 – 2023</p>
                </div>
                <div className="border-l-2 border-primary/30 pl-4">
                  <h4 className="font-semibold text-foreground text-sm md:text-base">Bachelor of Commerce (B.Com)</h4>
                  <p className="text-primary text-xs md:text-sm">Kurukshetra University</p>
                  <p className="text-muted-foreground text-xs md:text-sm">2016 – 2019</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
