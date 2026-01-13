import { motion } from "framer-motion";

interface SocialButtonProps {
  label: string;
  href?: string;
}

const SocialButton = ({ label, href = "#" }: SocialButtonProps) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 rounded-full border border-border bg-card flex items-center justify-center text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {label}
    </motion.a>
  );
};

export default SocialButton;
