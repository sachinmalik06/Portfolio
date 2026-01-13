import { motion, AnimatePresence } from "framer-motion";
import { useGalleryItems } from "@/hooks/use-cms";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";

const Projects = () => {
  const { data: projects, isLoading } = useGalleryItems(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter active projects and sort by order
  const activeProjects = projects?.filter((p: any) => p.active).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)) || [];

  if (isLoading || activeProjects.length === 0) {
    return null;
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="projects" className="min-h-screen bg-card px-4 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <span className="text-primary text-sm font-medium uppercase tracking-widest">
            Portfolio
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mt-4">
            Featured Projects
          </h2>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start">
          {activeProjects.map((project: any, index: number) => {
            const isExpanded = expandedId === project.id;
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ 
                  duration: 0.2, 
                  delay: index * 0.02,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                layout="position"
              >
                {/* Project Card */}
                <motion.div
                  layout="size"
                  className="relative overflow-hidden rounded-2xl bg-background border border-border hover:border-primary transition-colors duration-300 flex flex-col"
                  animate={{
                    scale: isExpanded ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {/* Image - Clickable */}
                  <motion.div
                    layout
                    className="relative overflow-hidden bg-muted group cursor-pointer h-[280px] flex items-center justify-center"
                    onClick={() => toggleExpand(project.id)}
                  >
                    <motion.img
                      src={project.image}
                      alt={project.title || `Project ${project.number}`}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/600x400?text=Project+Image';
                      }}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Project Number Badge */}
                    <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-lg">
                        {String(project.number).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Click indicator on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="px-4 py-2 bg-background/90 backdrop-blur-sm rounded-full border border-primary">
                        <span className="text-sm font-medium text-primary">
                          {isExpanded ? 'Click to collapse' : 'Click to expand'}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <motion.div layout className="p-6 flex-1 flex flex-col">
                    {project.title && (
                      <motion.h3
                        layout
                        className="text-xl md:text-2xl font-bold text-foreground mb-2"
                      >
                        {project.title}
                      </motion.h3>
                    )}
                    
                    {/* Always show short description */}
                    {project.description && (
                      <p className={`text-muted-foreground text-sm md:text-base mb-2 ${!isExpanded ? 'line-clamp-2' : ''}`}>
                        {project.description}
                      </p>
                    )}

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          {project.detailed_description && (
                            <div className="mt-4 mb-6">
                              <p className="text-muted-foreground text-sm md:text-base leading-relaxed whitespace-pre-line">
                                {project.detailed_description}
                              </p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3 mt-auto">
                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors text-sm"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Visit Project
                              </a>
                            )}
                            
                            <button
                              onClick={() => toggleExpand(project.id)}
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-background border border-border text-foreground rounded-full font-medium hover:border-primary hover:text-primary transition-colors text-sm"
                            >
                              <ChevronDown className="w-4 h-4 rotate-180" />
                              Collapse
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Expand Button (when collapsed) */}
                    {!isExpanded && (
                      <motion.button
                        layout
                        onClick={() => toggleExpand(project.id)}
                        className="mt-auto pt-4 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                      >
                        <span>View details</span>
                        <ChevronDown className="w-4 h-4" />
                      </motion.button>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
