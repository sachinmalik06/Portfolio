import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Users, Target, Layers, Brain, Globe, Award, ExternalLink, X } from "lucide-react";
import { useExpertiseCards, useResumeCertifications } from "@/hooks/use-cms";

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
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const { data: expertiseData, isLoading } = useExpertiseCards();
  const { data: certificationsData, isLoading: certsLoading, error: certsError } = useResumeCertifications();

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
                className={`group relative overflow-hidden bg-background/40 backdrop-blur-md rounded-2xl border border-white/10 hover:border-primary/50 transition-all duration-500 ${cert.credential_url ? 'cursor-pointer hover:shadow-2xl hover:shadow-primary/20' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4, margin: "0px 0px -150px 0px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                layoutId={`cert-${cert.id || index}`}
                onClick={() => setSelectedCert(cert)}
              >
                {/* Image Header */}
                <div className="relative h-48 w-full overflow-hidden bg-muted/20">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 z-10" />
                  {cert.image_url ? (
                    <motion.img
                      src={cert.image_url}
                      alt={cert.name || cert.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Award className="w-16 h-16 text-primary/20" />
                    </div>
                  )}

                  {/* Floating Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className="backdrop-blur-xl bg-primary/20 border border-primary/30 text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      {cert.year || cert.date}
                    </span>
                  </div>
                </div>

                <div className="p-6 relative">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {cert.name || cert.title}
                    </h4>
                    {cert.credential_url && (
                      <ExternalLink className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>

                  <p className="text-sm font-semibold text-primary/80 mb-3 uppercase tracking-wider">
                    {cert.issuer}
                  </p>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                    {cert.description}
                  </p>

                  {cert.credential_id && (
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
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
        </motion.div>

        {/* Certification Overlay */}
        <AnimatePresence>
          {selectedCert && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCert(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
              />

              {/* Content */}
              <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 pointer-events-none">
                <motion.div
                  layoutId={`cert-${selectedCert.id || certifications.indexOf(selectedCert)}`}
                  className="bg-background/90 backdrop-blur-2xl rounded-3xl border border-white/10 w-full max-w-2xl overflow-hidden pointer-events-auto relative shadow-2xl"
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
                          alt={selectedCert.name || selectedCert.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10">
                          <Award className="w-24 h-24 text-primary" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent md:hidden" />
                    </div>

                    {/* Content Area */}
                    <div className="md:w-1/2 p-8">
                      <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2 block">
                        {selectedCert.issuer}
                      </span>
                      <h3 className="text-2xl font-bold text-foreground mb-4">
                        {selectedCert.name || selectedCert.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-6">
                        <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/20">
                          {selectedCert.year || selectedCert.date}
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
