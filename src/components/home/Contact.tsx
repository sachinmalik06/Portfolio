import { motion } from "framer-motion";
import { Mail, MapPin, Phone, ArrowUpRight, Linkedin } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-cms";
import { useState, FormEvent, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { Database } from "@/lib/database.types";

type ContactSubmissionInsert = Database['public']['Tables']['contact_submissions']['Insert'];

const Contact = () => {
  const { data: siteData } = useSiteSettings();
  const [contactSettings, setContactSettings] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    fetchContactSettings();
  }, []);

  const fetchContactSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'home_contact')
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching contact settings:', error);
      }
      
      if (data) setContactSettings((data as any).value);
    } catch (error) {
      console.error('Error fetching contact settings:', error);
    }
  };

  // Default contact info
  const defaultContact = {
    title: "Let's Work Together",
    subtitle: "Get in Touch",
    description: "Open to professional opportunities in international business strategy, analytics, and sustainable business development within Europe and beyond.",
    email: "sachinmalikofficial6@gmail.com",
    phone: "+49 176 2135 1793",
    linkedin: "https://www.linkedin.com/in/sachinmalik6",
    location: "Berlin, Germany"
  };

  const contact = contactSettings || defaultContact;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to Supabase
      const submissionData: ContactSubmissionInsert = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'No subject',
        message: formData.message,
        status: 'unread'
      };

      const result = await (supabase
        .from('contact_submissions') as any)
        .insert([submissionData])
        .select()
        .single();
      
      const { data, error } = result;

      if (error) {
        console.error('Supabase error:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('Form submitted successfully:', data);

      // Success
      toast.success("Message sent successfully! We'll get back to you soon.");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      const errorMessage = error?.message || "Failed to send message. Please try again or contact us directly via email.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="min-h-screen bg-background px-4 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left - Info */}
          <motion.div
            className="space-y-6 md:space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <span className="text-primary text-sm font-medium uppercase tracking-widest">
                {contact.subtitle || defaultContact.subtitle}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mt-4 leading-tight">
                {contact.title || defaultContact.title}
              </h2>
            </div>

            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md">
              {contact.description || defaultContact.description}
            </p>

            <div className="space-y-3 md:space-y-4 pt-4">
              <motion.a
                href={`mailto:${contact.email || defaultContact.email}`}
                className="flex items-center gap-3 md:gap-4 text-foreground hover:text-primary transition-colors group"
                whileHover={{ x: 8 }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Mail className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="font-medium text-sm md:text-base break-all">{contact.email || defaultContact.email}</span>
              </motion.a>

              <motion.a
                href={`tel:${contact.phone || defaultContact.phone}`}
                className="flex items-center gap-3 md:gap-4 text-foreground hover:text-primary transition-colors group"
                whileHover={{ x: 8 }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Phone className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="font-medium text-sm md:text-base">{contact.phone || defaultContact.phone}</span>
              </motion.a>

              <motion.a
                href={contact.linkedin || defaultContact.linkedin}
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
                <span className="font-medium text-sm md:text-base">{contact.location || defaultContact.location}</span>
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
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label htmlFor="name" className="text-xs md:text-sm font-medium text-foreground mb-2 block">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-xs md:text-sm font-medium text-foreground mb-2 block">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="text-xs md:text-sm font-medium text-foreground mb-2 block">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Business opportunity"
                  disabled={isSubmitting}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="message" className="text-xs md:text-sm font-medium text-foreground mb-2 block">
                  Message <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell me about the opportunity..."
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground resize-none text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 md:py-4 bg-primary text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                {!isSubmitting && <ArrowUpRight className="w-4 h-4" />}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
