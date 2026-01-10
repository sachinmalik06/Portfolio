import { motion } from "framer-motion";
import { useProfileCardSettings, useSiteSettings } from "@/hooks/use-cms";
import { convertDriveUrlToDirectImageUrl } from "@/lib/image-utils";
import SocialButton from "./SocialButton";
import StatCard from "./StatCard";
import HeroImage from "./HeroImage";

const Hero = () => {
  const { data: profileData } = useProfileCardSettings();
  const { data: siteData } = useSiteSettings();

  // Default data as fallback
  const defaultSocialLinks = [
    { label: "in", href: "https://www.linkedin.com/in/sachinmalik6" },
    { label: "✉", href: "mailto:sachinmalikofficial6@gmail.com" },
  ];

  const defaultStats = [
    {
      value: "2+",
      description: "Years of hands-on experience in management and business operations",
    },
    {
      value: "MSc",
      description: "International Business Management at GISMA University, Berlin",
    },
  ];

  // Parse social links from CMS if available
  const socialLinks = siteData?.socialLinks || defaultSocialLinks;
  const name = siteData?.siteName || "Sachin Malik";
  const description = siteData?.siteDescription || "Internationally oriented business professional passionate about strategic decision-making, data-driven growth, and digital transformation in multicultural environments.";

  return (
    <section id="home" className="h-screen bg-background px-4 md:px-12 lg:px-20 pt-16 pb-4 flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto w-full h-full flex items-center">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center w-full">
          {/* Left Content */}
          <div className="space-y-4 md:space-y-6 text-center lg:text-left">
            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="hero-title text-foreground">
                {name.split(' ').map((word: string, index: number) => (
                  <span key={index}>
                    {word}
                    {index < name.split(' ').length - 1 && <br />}
                  </span>
                ))}
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              className="text-muted-foreground text-base md:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {description}
            </motion.p>

            {/* Social Links */}
            <motion.div
              className="flex gap-3 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {socialLinks.map((link: any, index: number) => (
                <SocialButton key={index} label={link.label} href={link.href} />
              ))}
            </motion.div>

            {/* Stats */}
            <div className="flex gap-6 md:gap-8 lg:gap-10 pt-2 md:pt-4 justify-center lg:justify-start flex-wrap">
              {defaultStats.map((stat, index) => (
                <StatCard
                  key={stat.value}
                  value={stat.value}
                  description={stat.description}
                  delay={0.4 + index * 0.1}
                />
              ))}
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="lg:pl-8 order-first lg:order-last h-full flex items-center">
            <HeroImage />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
