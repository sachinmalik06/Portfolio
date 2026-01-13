import { motion } from "framer-motion";

interface StatCardProps {
  value: string;
  description: string;
  delay?: number;
}

const StatCard = ({ value, description, delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      className="space-y-1 text-center lg:text-left"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-primary">
        {value}
      </h3>
      <p className="text-xs md:text-sm text-muted-foreground max-w-[140px] lg:max-w-[160px] leading-snug">
        {description}
      </p>
    </motion.div>
  );
};

export default StatCard;
