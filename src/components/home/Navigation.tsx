import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router";
import ThemeToggle from "@/components/ThemeToggle";
import { useLogoSettings } from "@/hooks/use-cms";
import { convertDriveUrlToDirectImageUrl } from "@/lib/image-utils";

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: logoSettings } = useLogoSettings();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Expertise", href: "/expertise" },
    { label: "Contact", href: "/contact" },
  ];

  const handleNavClick = (href: string) => {
    navigate(href);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-12 lg:px-20 py-4 transition-all duration-300 ${
          scrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <motion.div
              className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
            {logoSettings?.logoUrl ? (
              <img
                src={convertDriveUrlToDirectImageUrl(logoSettings.logoUrl)}
                alt="Logo"
                className="h-8 w-8 object-contain"
              />
            ) : (
              <span className="text-xl font-bold text-primary">
                {logoSettings?.logoText || "SM"}
              </span>
            )}
            </motion.div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item, index) => (
              <div key={item.label} className="flex items-center">
                <Link to={item.href}>
                  <motion.div
                    className="relative px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors duration-200 group cursor-pointer"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-3/4 transition-all duration-300 rounded-full" />
                  </motion.div>
                </Link>
                
                {index < navItems.length - 1 && (
                  <motion.span
                    className="w-1.5 h-1.5 bg-primary rotate-45 mx-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link to="/contact">
              <motion.div
                className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-primary group-hover:text-primary-foreground text-lg">+</span>
                <span className="text-sm text-foreground group-hover:text-primary-foreground">Open to Work</span>
              </motion.div>
            </Link>
            
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden w-10 h-10 flex items-center justify-center text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-background md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pt-24 px-6 flex flex-col items-center gap-6">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="text-2xl font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.label}
                </motion.div>
              ))}
              <motion.div
                onClick={() => handleNavClick("/contact")}
                className="mt-8 flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">+</span>
                <span className="text-sm font-medium">Open to Work</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
