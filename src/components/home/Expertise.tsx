import { motion } from "framer-motion";
import { BarChart3, Users, Target, Layers, Brain, Globe } from "lucide-react";
import { useExpertiseCards, useCertifications } from "@/hooks/use-cms";

// Icon mapping for CMS data
const iconMap: { [key: string]: any } = {
  "BarChart3": BarChart3,
  "Users": Users,
  "Target": Target,
  "Layers": Layers,
  "Brain": Brain,
  "Globe": Globe,
};

const defaultExpertiseItems = [
  {
    icon: "BarChart3",
    title: "Business Analytics",
    description: "Data analysis, Power BI, and Business Intelligence for data-driven decision making.",
  },
  {
    icon: "Target",
    title: "Strategic Planning",
    description: "Developing and executing strategic plans to enhance market reach and business growth.",
  },
  {
    icon: "Users",
    title: "Leadership & Management",
    description: "Cross-functional team leadership and operational optimization in fast-paced environments.",
  },
  {
    icon: "Layers",
    title: "Financial Management",
    description: "Financial planning, budgeting, and performance analysis for sustainable growth.",
  },
  {
    icon: "Brain",
    title: "Digital Transformation",
    description: "Driving innovation and digital strategies for modern business solutions.",
  },
  {
    icon: "Globe",
    title: "International Business",
    description: "Global business dynamics and cross-cultural collaboration expertise.",
  },
];

const defaultSkills = [
  "Microsoft 365", "Power BI", "Data Analysis", "Business Intelligence",
  "Financial Planning", "Strategic Planning", "Team Leadership", "Excel",
  "Cross-functional Collaboration", "Operational Optimization"
];

const Expertise = () => {
  const { data: expertiseData, isLoading } = useExpertiseCards();
  const { data: certificationsData, isLoading: certsLoading, error: certsError } = useCertifications();
  
  // Debug logging
  console.log('Certifications Data:', certificationsData);
  console.log('Certifications Loading:', certsLoading);
  console.log('Certifications Error:', certsError);
  
  // Use CMS data if available, otherwise use defaults
  const expertiseItems = expertiseData && expertiseData.length > 0 
    ? expertiseData.map((card: any) => ({
        icon: card.icon || "Target",
        title: card.title,
        description: card.description,
      }))
    : defaultExpertiseItems;

  // Default certifications to always show
  const defaultCertifications = [
    {
      title: "Business Analytics Certificate",
      issuer: "Google",
      date: "2023",
      description: "Data analysis, visualization, and business intelligence"
    },
    {
      title: "Project Management Professional",
      issuer: "PMI",
      date: "2022",
      description: "Project planning, execution, and stakeholder management"
    },
    {
      title: "Digital Marketing Certification",
      issuer: "HubSpot",
      date: "2023",
      description: "SEO, content marketing, and digital strategy"
    }
  ];

  // Use CMS certifications or default data
  const certifications = (certificationsData && certificationsData.length > 0)
    ? certificationsData
    : defaultCertifications;

  // Parse skills from CMS or use defaults
  const skills = defaultSkills;

  return (
    <section id="expertise" className="min-h-screen bg-card px-4 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.25 }}
        >
          <span className="text-primary text-sm font-medium uppercase tracking-widest">
            What I Do
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mt-4">
            My Expertise
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
          {expertiseItems.map((item: any, index: number) => {
            const IconComponent = iconMap[item.icon] || Target;
            
            return (
              <motion.div
                key={item.title}
                className="group p-5 md:p-8 bg-background rounded-2xl border border-border hover:border-primary transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.25, delay: index * 0.03 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <motion.div
                  className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
                </motion.div>
                
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3" style={{ color: '#a77d44' }}>
                  {item.title}
                </h3>
                
                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Certifications */}
        <motion.div
          className="my-12 md:my-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <h3 className="text-lg md:text-xl font-bold text-foreground mb-6 md:mb-8 text-center">
            Certifications & Achievements
          </h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {certifications.map((cert: any, index: number) => (
              <motion.div
                key={cert.id || cert.title}
                className={`bg-background rounded-2xl p-5 md:p-6 border border-border hover:border-primary transition-all duration-300 ${cert.credential_url ? 'cursor-pointer hover:shadow-lg hover:shadow-primary/10' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4, margin: "0px 0px -150px 0px" }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                onClick={() => {
                  if (cert.credential_url) {
                    window.open(cert.credential_url, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{cert.date}</span>
                    {cert.credential_url && (
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    )}
                  </div>
                </div>
                
                <h4 className="text-base md:text-lg font-bold text-foreground mb-1">
                  {cert.title}
                </h4>
                
                <p className="text-sm font-medium text-primary mb-2">
                  {cert.issuer}
                </p>
                
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {cert.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skills Tags */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">Technical Skills</h3>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {skills.map((skill, index) => (
              <motion.span
                key={skill}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-background border border-border rounded-full text-xs md:text-sm text-muted-foreground hover:border-primary hover:text-foreground transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5, margin: "0px 0px -100px 0px" }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Languages */}
        <motion.div
          className="mt-12 md:mt-16 grid grid-cols-3 gap-3 md:gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <div className="bg-background rounded-2xl p-4 md:p-6 border border-border text-center">
            <h4 className="text-lg md:text-2xl font-bold text-foreground mb-1 md:mb-2">Hindi</h4>
            <p className="text-muted-foreground text-xs md:text-sm">Native</p>
          </div>
          <div className="bg-background rounded-2xl p-4 md:p-6 border border-border text-center">
            <h4 className="text-lg md:text-2xl font-bold text-foreground mb-1 md:mb-2">English</h4>
            <p className="text-muted-foreground text-xs md:text-sm">Proficient (C1)</p>
          </div>
          <div className="bg-background rounded-2xl p-4 md:p-6 border border-border text-center">
            <h4 className="text-lg md:text-2xl font-bold text-foreground mb-1 md:mb-2">German</h4>
            <p className="text-muted-foreground text-xs md:text-sm">Basic (A1)</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Expertise;
