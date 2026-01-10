import { motion } from "framer-motion";
import { BarChart3, Users, Target, Layers, Brain, Globe } from "lucide-react";

const expertiseItems = [
  {
    icon: BarChart3,
    title: "Business Analytics",
    description: "Data analysis, Power BI, and Business Intelligence for data-driven decision making.",
  },
  {
    icon: Target,
    title: "Strategic Planning",
    description: "Developing and executing strategic plans to enhance market reach and business growth.",
  },
  {
    icon: Users,
    title: "Leadership & Management",
    description: "Cross-functional team leadership and operational optimization in fast-paced environments.",
  },
  {
    icon: Layers,
    title: "Financial Management",
    description: "Financial planning, budgeting, and performance analysis for sustainable growth.",
  },
  {
    icon: Brain,
    title: "Digital Transformation",
    description: "Driving innovation and digital strategies for modern business solutions.",
  },
  {
    icon: Globe,
    title: "International Business",
    description: "Global business dynamics and cross-cultural collaboration expertise.",
  },
];

const skills = [
  "Microsoft 365", "Power BI", "Data Analysis", "Business Intelligence",
  "Financial Planning", "Strategic Planning", "Team Leadership", "Excel",
  "Cross-functional Collaboration", "Operational Optimization"
];

const Expertise = () => {
  return (
    <section id="expertise" className="min-h-screen bg-card px-4 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-primary text-sm font-medium uppercase tracking-widest">
            What I Do
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mt-4">
            My Expertise
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
          {expertiseItems.map((item, index) => (
            <motion.div
              key={item.title}
              className="group p-5 md:p-8 bg-background rounded-2xl border border-border hover:border-primary transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <motion.div
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <item.icon className="w-5 h-5 md:w-6 md:h-6" />
              </motion.div>
              
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 md:mb-3">
                {item.title}
              </h3>
              
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Skills Tags */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">Technical Skills</h3>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {skills.map((skill, index) => (
              <motion.span
                key={skill}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-background border border-border rounded-full text-xs md:text-sm text-muted-foreground hover:border-primary hover:text-foreground transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.5 }}
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
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.5 }}
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
