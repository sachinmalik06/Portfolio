import { motion } from "framer-motion";
import { Globe, ArrowUpRight, BarChart3, GraduationCap } from "lucide-react";
import { useProfileCardSettings } from "@/hooks/use-cms";
import { convertDriveUrlToDirectImageUrl } from "@/lib/image-utils";
import { useEffect } from "react";

// Default hero image URL - matches the actual image in database
// This allows the image to start loading immediately without waiting for CMS data
const DEFAULT_HERO_IMAGE = "https://ezdyscvjstfmilgucshr.supabase.co/storage/v1/object/public/images/hero/1768303245907-s499rs.jpeg";

const HeroImage = () => {
  const { data: profileData } = useProfileCardSettings();

  // Preload the image as soon as component mounts
  useEffect(() => {
    const img = new Image();
    img.src = DEFAULT_HERO_IMAGE;
  }, []);

  // Get image from CMS or use default
  const rawImageUrl = profileData?.imageUrl || profileData?.cardImageUrl;

  // Check if it's already a Supabase URL (no conversion needed)
  const isSupabaseUrl = rawImageUrl?.includes('/storage/v1/object/public/');

  const heroImageUrl = rawImageUrl
    ? (isSupabaseUrl ? rawImageUrl : convertDriveUrlToDirectImageUrl(rawImageUrl))
    : DEFAULT_HERO_IMAGE; // Use default instead of null

  return (
    <motion.div
      className="relative w-full h-full max-h-[50vh] md:max-h-[60vh] lg:max-h-[80vh]"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
    >
      {/* Main image container */}
      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl h-full bg-card">
        <img
          src={heroImageUrl}
          alt="Profile Portrait"
          className="w-full h-full object-cover object-top max-h-[50vh] md:max-h-[60vh] lg:max-h-[80vh]"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />

        {/* Signature overlay - top left */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <span className="text-foreground text-sm md:text-base font-medium">Business & Strategy</span>
        </div>
      </div>

      {/* Globe button - top right */}
      <motion.a
        href="https://www.linkedin.com/in/sachinmalik6"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute -top-2 -right-2 md:-top-4 md:-right-4 w-10 h-10 md:w-14 md:h-14 bg-foreground rounded-full flex items-center justify-center text-background shadow-lg"
        whileHover={{ scale: 1.1, rotate: 180 }}
        transition={{ duration: 0.3 }}
      >
        <Globe className="w-4 h-4 md:w-6 md:h-6" />
      </motion.a>

      {/* Floating info buttons - bottom left */}
      <div className="absolute left-2 md:left-4 bottom-4 md:bottom-6 flex flex-col gap-2 md:gap-3">
        <motion.a
          href="#expertise"
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-card border-2 border-background overflow-hidden shadow-lg flex items-center justify-center text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ delay: 0.3, duration: 0.2 }}
          title="View Expertise"
        >
          <BarChart3 className="w-4 h-4 md:w-5 md:h-5" />
        </motion.a>

        <motion.a
          href="#about"
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-card border-2 border-background overflow-hidden shadow-lg flex items-center justify-center text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ delay: 0.35, duration: 0.2 }}
          title="View Education"
        >
          <GraduationCap className="w-4 h-4 md:w-5 md:h-5" />
        </motion.a>

        <motion.a
          href="mailto:sachinmalikofficial6@gmail.com"
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-foreground flex items-center justify-center text-background shadow-lg hover:bg-accent hover:text-accent-foreground transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.2 }}
          title="Send Email"
        >
          <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
        </motion.a>
      </div>
    </motion.div>
  );
};

export default HeroImage;
