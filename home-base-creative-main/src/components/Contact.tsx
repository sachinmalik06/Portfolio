import { motion } from "framer-motion";
import { Mail, MapPin, Phone, ArrowUpRight, Linkedin } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="min-h-screen bg-background px-4 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left - Info */}
          <motion.div
            className="space-y-6 md:space-y-8"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <div>
              <span className="text-primary text-sm font-medium uppercase tracking-widest">
                Get In Touch
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mt-4 leading-tight">
                Let's connect and collaborate
              </h2>
            </div>

            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md">
              Open to professional opportunities in international business strategy, analytics, and sustainable business development within Europe and beyond.
            </p>

            <div className="space-y-3 md:space-y-4 pt-4">
              <motion.a
                href="mailto:sachinmalikofficial6@gmail.com"
                className="flex items-center gap-3 md:gap-4 text-foreground hover:text-primary transition-colors group"
                whileHover={{ x: 8 }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Mail className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="font-medium text-sm md:text-base break-all">sachinmalikofficial6@gmail.com</span>
              </motion.a>

              <motion.a
                href="tel:+4917621351793"
                className="flex items-center gap-3 md:gap-4 text-foreground hover:text-primary transition-colors group"
                whileHover={{ x: 8 }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Phone className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="font-medium text-sm md:text-base">+49 176 2135 1793</span>
              </motion.a>

              <motion.a
                href="https://www.linkedin.com/in/sachinmalik6"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 md:gap-4 text-foreground hover:text-primary transition-colors group"
                whileHover={{ x: 8 }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="font-medium text-sm md:text-base">linkedin.com/in/sachinmalik6</span>
              </motion.a>

              <motion.div
                className="flex items-center gap-3 md:gap-4 text-foreground"
                whileHover={{ x: 8 }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="font-medium text-sm md:text-base">Berlin, Germany</span>
              </motion.div>
            </div>

            {/* Interests */}
            <div className="pt-4 md:pt-8">
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">Interests & Hobbies</h3>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {["Entrepreneurship", "BobaQ Café Founder", "Digital Marketing", "Cultural Exchange", "Fitness"].map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1.5 md:px-4 md:py-2 bg-primary/10 rounded-full text-xs md:text-sm text-foreground"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            className="bg-card rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 border border-border"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-6">Send a Message</h3>
            <form className="space-y-4 md:space-y-6">
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="text-xs md:text-sm font-medium text-foreground mb-2 block">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium text-foreground mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm md:text-base"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium text-foreground mb-2 block">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Business opportunity"
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm md:text-base"
                />
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium text-foreground mb-2 block">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell me about the opportunity..."
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground resize-none text-sm md:text-base"
                />
              </div>

              <motion.button
                type="submit"
                className="w-full py-3 md:py-4 bg-primary text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors text-sm md:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Message
                <ArrowUpRight className="w-4 h-4" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
