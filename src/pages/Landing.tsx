import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Footer } from "@/components/ui/footer";
import { Github, Instagram, Linkedin, Mail, Twitter, MousePointer2 } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router";
import PillNav from "@/components/PillNav";
import { usePage, useSiteSettings, useFooterSettings } from "@/hooks/use-cms";

gsap.registerPlugin(ScrollTrigger);

// Footer Content Component
function FooterContent({ footerData }: { footerData: any }) {
  // Default footer data
  const defaultFooter = {
    brandName: "Cinematic Strategy",
    logoText: "CS",
    socialLinks: [
      { platform: "twitter", href: "https://twitter.com", label: "Twitter" },
      { platform: "instagram", href: "https://instagram.com", label: "Instagram" },
      { platform: "linkedin", href: "https://linkedin.com", label: "LinkedIn" },
    ],
    mainLinks: [
      { href: "#", label: "Expertise" },
      { href: "#", label: "Work" },
      { href: "#", label: "Contact" },
    ],
    legalLinks: [
      { href: "#", label: "Privacy Policy" },
      { href: "#", label: "Terms of Service" },
    ],
    copyright: {
      text: "© 2024 Cinematic Strategy. All rights reserved.",
      license: "",
    },
  };

  const footer = footerData || defaultFooter;

  // Map platform names to icons
  const getIcon = (platform: string) => {
    const normalized = platform.toLowerCase();
    if (normalized.includes("twitter") || normalized === "x") {
      return <Twitter className="h-5 w-5" />;
    }
    if (normalized.includes("instagram")) {
      return <Instagram className="h-5 w-5" />;
    }
    if (normalized.includes("linkedin")) {
      return <Linkedin className="h-5 w-5" />;
    }
    return <Twitter className="h-5 w-5" />;
  };

  return (
    <Footer
      logo={
        <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
          {footer.logoText || "CS"}
        </div>
      }
      brandName={footer.brandName || "Cinematic Strategy"}
      socialLinks={footer.socialLinks?.map((link: any) => ({
        icon: getIcon(link.platform),
        href: link.href,
        label: link.label,
      })) || []}
      mainLinks={footer.mainLinks || []}
      legalLinks={footer.legalLinks || []}
      copyright={footer.copyright || { text: "" }}
    />
  );
}

// Helper to split text into characters for animation
const CharSplitter = ({ text, className }: { text: string; className?: string }) => {
  return (
    <div className={`inline-flex ${className}`}>
      {text.split("").map((char, index) => (
        <span key={index} className="char inline-block will-change-transform">
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
};

export default function Landing() {
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const horizontalTextRef = useRef<HTMLDivElement>(null);
  const finalVideoRef = useRef<HTMLDivElement>(null);
  const finalVideoElementRef = useRef<HTMLVideoElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const pillNavRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [hasScrolled, setHasScrolled] = useState(false);

  const { data: pageData } = usePage("home");
  const { data: siteSettings } = useSiteSettings();
  const { data: footerData } = useFooterSettings();
  
  const content = (pageData as any)?.content || {
    heroTitle1: "PORT",
    heroTitle2: "FOLIO",
    videoUrl: "https://videos.pexels.com/video-files/5377684/5377684-uhd_2560_1440_25fps.mp4",
    bottomTextLeftTitle: "CINEMATIC",
    bottomTextLeftSubtitle: "Showreel 2024",
    bottomTextRightTitle: "STRATEGY",
    bottomTextRightSubtitle: "Creative Direction"
  };

  const headerTitle = siteSettings?.headerTitle || "CINEMATIC STRATEGY";

  useGSAP(() => {
    if (!wrapperRef.current || !headerRef.current || !heroRef.current || !videoRef.current || !horizontalTextRef.current || !finalVideoRef.current || !footerRef.current || !pillNavRef.current) return;

    // Set initial state for pillNav (hidden and positioned below)
    if (pillNavRef.current) {
      gsap.set(pillNavRef.current, {
        y: 150,
        opacity: 0,
        autoAlpha: 0,
        visibility: 'hidden',
        display: 'none',
        pointerEvents: 'none'
      });
    }


    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: "top top",
        end: "+=10000", // Increased duration for footer sequence
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Hide scroll indicator when scrolling starts
          if (self.progress > 0.01 && scrollIndicatorRef.current && !hasScrolled) {
            setHasScrolled(true);
            gsap.to(scrollIndicatorRef.current, {
              opacity: 0,
              autoAlpha: 0,
              duration: 0.5,
              ease: "power2.out",
              onComplete: () => {
                if (scrollIndicatorRef.current) {
                  scrollIndicatorRef.current.style.display = 'none';
                }
              }
            });
          }
        }
      }
    });

    // --- HERO PHASE ---
    
    // Header Animation (Moves up slowly as scroll starts)
    tl.to(headerRef.current, { yPercent: -100, duration: 3, ease: "power3.inOut" }, "start");

    // 1. Split Text & Video Appear (Scale 0 -> 1)
    tl.to(".port-text", { x: -250, duration: 2, ease: "power3.out" }, "start")
      .to(".folio-text", { x: 250, duration: 2, ease: "power3.out" }, "start")
      .fromTo(videoRef.current, 
        { scale: 0, autoAlpha: 0, width: "20rem", height: "11.25rem", borderRadius: "1rem" },
        { scale: 1, autoAlpha: 1, duration: 2, ease: "power3.out" },
        "start"
      );

    // 2. Video Fullscreen & Text Exit
    tl.to(videoRef.current, {
      width: "100vw",
      height: "100vh",
      borderRadius: "0rem",
      duration: 4,
      ease: "expo.inOut",
      onComplete: () => {
        videoElementRef.current?.play().catch(() => {});
      },
      onReverseComplete: () => {
        videoElementRef.current?.pause();
      }
    }, "fullscreen")
    .to(".port-text", { x: -800, autoAlpha: 0, duration: 4, ease: "expo.inOut" }, "fullscreen")
    .to(".folio-text", { x: 800, autoAlpha: 0, duration: 4, ease: "expo.inOut" }, "fullscreen")
    .to(".bottom-text", { autoAlpha: 1, duration: 2 }, "fullscreen+=2"); // Reveal bottom text as video becomes fullscreen

    // 3. Hold / Pin Video (Simulated Pin)
    // This creates the "pin for 2 seconds" feel before fading
    tl.to({}, { duration: 4 });

    // 4. Fade Out Video & Hero Background
    // This reveals the horizontal section which is sitting behind (z-0)
    tl.to([videoRef.current, ".bottom-text", ".hero-bg"], { autoAlpha: 0, duration: 2 }, "fade");

    // --- HORIZONTAL PHASE ---
    
    // Re-select chars to include new subtext characters
    const chars = horizontalTextRef.current.querySelectorAll(".char");
    
    // Calculate scroll distance to center the final video card
    // The container has pl-[100vw] and pr-[calc(50vw-10rem)]
    // We want to scroll to the very end to center the last element
    const getScrollDist = () => {
      if (!horizontalTextRef.current) return 0;
      return -(horizontalTextRef.current.scrollWidth - window.innerWidth);
    };

    // Horizontal Scroll
    // Moves the text from right to left until the video card is centered
    tl.to(horizontalTextRef.current, {
      x: getScrollDist,
      ease: "none",
      duration: 10 
    }, "horizontal");

    // Character Animations (Linked to horizontal scroll timing)
    // Simulating the "random" effect as they appear
    tl.from(chars, {
      yPercent: () => gsap.utils.random(-200, 200),
      rotation: () => gsap.utils.random(-20, 20),
      opacity: 0,
      duration: 2,
      ease: "back.out(1.2)",
      stagger: {
        amount: 8, // Spread the animation across the scroll duration
        from: "start"
      }
    }, "horizontal");

    // --- FINAL VIDEO EXPANSION PHASE ---
    
    // Upscale the final video card to cover the screen
    tl.to(finalVideoRef.current, {
      scale: () => {
        // Calculate scale to cover the viewport
        // Base size: 20rem (320px) x 11.25rem (180px)
        const videoWidth = 320; 
        const videoHeight = 180;
        const scaleX = window.innerWidth / videoWidth;
        const scaleY = window.innerHeight / videoHeight;
        return Math.max(scaleX, scaleY) * 1.1; // 1.1 for safety margin
      },
      borderRadius: 0,
      duration: 3,
      ease: "expo.inOut",
      onComplete: () => {
        finalVideoElementRef.current?.play().catch(() => {});
      },
      onReverseComplete: () => {
        finalVideoElementRef.current?.pause();
      }
    }, "finalScale");

    // --- FOOTER REVEAL PHASE ---
    
    // 1. Hold the fullscreen video for 2 seconds
    tl.to({}, { duration: 2 });

    // 2. Vertical Scroll Effect
    // Bring the footer up from the bottom overlaying the video
    tl.to(footerRef.current, {
      yPercent: -100, // Move up by its own height (it's placed at top: 100%)
      duration: 4,
      ease: "power2.inOut"
    }, "footerReveal");

    // 3. PillNav appears after footer animation completes
    tl.to(pillNavRef.current, {
      y: 0,
      opacity: 1,
      autoAlpha: 1,
      duration: 0.6,
      ease: "back.out(1.2)",
      onStart: () => {
        if (pillNavRef.current) {
          gsap.set(pillNavRef.current, {
            visibility: 'visible',
            display: 'block',
            pointerEvents: 'auto'
          });
        }
      },
      onReverseComplete: () => {
        if (pillNavRef.current) {
          gsap.set(pillNavRef.current, {
            visibility: 'hidden',
            display: 'none',
            y: 150,
            opacity: 0,
            autoAlpha: 0,
            pointerEvents: 'none'
          });
        }
      }
    }, "footerReveal+=4"); // Start after footer animation completes (duration: 4)

  }, { scope: wrapperRef });

  // Cleanup ScrollTrigger when navigating away to prevent reverse animations
  useEffect(() => {
    // Only cleanup if we're navigating away from the landing page
    if (location.pathname !== '/') {
      // Kill all ScrollTrigger instances immediately
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars?.trigger === wrapperRef.current) {
          st.kill();
        }
      });
      // Also kill any GSAP timelines
      gsap.killTweensOf([wrapperRef.current, headerRef.current, heroRef.current, videoRef.current, horizontalTextRef.current, finalVideoRef.current, footerRef.current, pillNavRef.current]);
    }
    
    return () => {
      // Cleanup on unmount
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars?.trigger === wrapperRef.current) {
          st.kill();
        }
      });
      gsap.killTweensOf([wrapperRef.current, headerRef.current, heroRef.current, videoRef.current, horizontalTextRef.current, finalVideoRef.current, footerRef.current, pillNavRef.current]);
    };
  }, [location.pathname]);

  // Animate scroll indicator (bouncing mouse animation)
  useEffect(() => {
    if (scrollIndicatorRef.current && !hasScrolled) {
      const scrollDot = scrollIndicatorRef.current.querySelector('.scroll-dot');
      if (scrollDot) {
        const animation = gsap.to(scrollDot, {
          y: 8,
          duration: 1.5,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true
        });

        return () => {
          animation.kill();
        };
      }
    }
  }, [hasScrolled]);

  // Also listen to wheel and touch events as fallback
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasScrolled && scrollIndicatorRef.current) {
        setHasScrolled(true);
        gsap.to(scrollIndicatorRef.current, {
          opacity: 0,
          autoAlpha: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            if (scrollIndicatorRef.current) {
              scrollIndicatorRef.current.style.display = 'none';
            }
          }
        });
      }
    };

    window.addEventListener('wheel', handleInteraction, { passive: true, once: true });
    window.addEventListener('touchstart', handleInteraction, { passive: true, once: true });

    return () => {
      window.removeEventListener('wheel', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [hasScrolled]);

  return (
    <div className="bg-background min-h-screen text-foreground overflow-x-hidden">
      {/* Header */}
      <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 mix-blend-difference text-white pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="text-lg font-bold" style={{ fontFamily: "'Kola-Regular', sans-serif", letterSpacing: '0.15em' }}>{headerTitle}</span>
        </div>

        <nav className="flex items-center gap-6 md:gap-8 pointer-events-auto">
          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-gray-300">
            <Link to="/about" className="hover:text-white transition-colors">ABOUT</Link>
            <Link to="/expertise" className="hover:text-white transition-colors">EXPERTISE</Link>
            <Link to="/contact" className="hover:text-white transition-colors">CONTACT</Link>
          </div>
        </nav>
      </header>

      {/* MAIN PINNED WRAPPER */}
      <div ref={wrapperRef} className="relative w-full h-screen overflow-hidden">
        
        {/* HORIZONTAL SECTION (Behind Hero) */}
        <div className="absolute inset-0 z-0 flex items-center bg-background">
           <div ref={horizontalTextRef} className="flex gap-[15vw] pl-[100vw] pr-[calc(50vw-10rem)] w-max items-center will-change-transform">
             
             <div className="flex flex-col gap-4">
               <CharSplitter text="STRATEGY" className="text-[8vw] font-bold leading-none text-foreground/90" />
               <CharSplitter text="Defining the path forward" className="text-xl md:text-3xl text-muted-foreground tracking-widest uppercase font-light" />
             </div>

             <div className="flex flex-col gap-4">
               <CharSplitter text="LEADERSHIP" className="text-[8vw] font-bold leading-none text-foreground/90" />
               <CharSplitter text="Guiding with vision" className="text-xl md:text-3xl text-muted-foreground tracking-widest uppercase font-light" />
             </div>

             <div className="flex flex-col gap-4">
               <CharSplitter text="EXECUTION" className="text-[8vw] font-bold leading-none text-foreground/90" />
               <CharSplitter text="Delivering results" className="text-xl md:text-3xl text-muted-foreground tracking-widest uppercase font-light" />
             </div>

             <div 
               ref={finalVideoRef}
               className="relative w-[20rem] h-[11.25rem] bg-black rounded-xl overflow-hidden shadow-2xl shrink-0 origin-center will-change-transform"
             >
               <video
                 ref={finalVideoElementRef}
                 src="https://videos.pexels.com/video-files/3222356/3222356-hd_1920_1080_25fps.mp4"
                 className="w-full h-full object-cover opacity-90"
                 muted
                 playsInline
                 loop
                 autoPlay
                 preload="auto"
                 onError={(e) => {
                   console.warn('Video failed to load, using fallback:', e);
                   // Fallback to a different video or hide the video element
                   if (finalVideoElementRef.current) {
                     finalVideoElementRef.current.style.display = 'none';
                   }
                 }}
               />
             </div>

           </div>
        </div>

        {/* HERO SECTION (Front) */}
        <div ref={heroRef} className="absolute inset-0 z-10 flex items-center justify-center">
          {/* Hero Background - Fades out to reveal horizontal section */}
          <div className="hero-bg absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 z-0" />
          <div className="hero-bg absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0 pointer-events-none" />

          {/* Video Container */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div
              ref={videoRef}
              className="video-container bg-black overflow-hidden shadow-2xl opacity-0 will-change-[width,height,transform,opacity]"
            >
              <video
                ref={videoElementRef}
                src={content.videoUrl}
                className="w-full h-full object-cover opacity-80"
                onError={(e) => {
                  console.warn('Hero video failed to load:', e);
                  if (videoElementRef.current) {
                    videoElementRef.current.style.display = 'none';
                  }
                }}
                muted
                playsInline
                loop
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex items-center justify-center gap-4 z-20 mix-blend-difference">
            <h1 className="port-text text-6xl md:text-9xl font-bold tracking-tighter text-foreground will-change-transform" style={{ fontFamily: "'Striper-Regular', sans-serif" }}>
              {content.heroTitle1}
            </h1>
            <h1 className="folio-text text-6xl md:text-9xl font-bold tracking-tighter text-foreground will-change-transform" style={{ fontFamily: "'Striper-Regular', sans-serif" }}>
              {content.heroTitle2}
            </h1>
          </div>

          {/* Bottom Text Overlays */}
          <div className="bottom-text opacity-0 absolute bottom-12 left-6 md:left-12 z-[50] pointer-events-none">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white" style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)' }}>{content.bottomTextLeftTitle}</h3>
            <p className="text-sm text-gray-200 tracking-widest uppercase mt-1" style={{ textShadow: '1px 1px 6px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 0, 0, 0.5)' }}>{content.bottomTextLeftSubtitle}</p>
          </div>
          <div className="bottom-text opacity-0 absolute bottom-12 right-6 md:right-12 z-[50] text-right pointer-events-none">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white" style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)' }}>{content.bottomTextRightTitle}</h3>
            <p className="text-sm text-gray-200 tracking-widest uppercase mt-1" style={{ textShadow: '1px 1px 6px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 0, 0, 0.5)' }}>{content.bottomTextRightSubtitle}</p>
          </div>

          {/* Scroll Indicator */}
          {!hasScrolled && (
            <div 
              ref={scrollIndicatorRef}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2 pointer-events-none mix-blend-difference"
            >
              <MousePointer2 className="w-6 h-6 text-white/80" />
              <div className="w-6 h-10 border-2 border-white/60 rounded-full flex items-start justify-center p-1.5">
                <div className="scroll-dot w-1.5 h-1.5 bg-white/80 rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* FOOTER SECTION */}
        <div ref={footerRef} className="absolute top-full left-0 right-0 w-full z-20 bg-background">
          <FooterContent footerData={footerData} />
        </div>

        {/* PILL NAV - Appears after footer */}
        <div ref={pillNavRef} className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-fit px-4">
          <PillNav
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: 'Expertise', href: '/expertise' },
              { label: 'Contact', href: '/contact' }
            ]}
            activeHref={location.pathname}
            baseColor="hsl(20 8% 6%)"
            pillColor="hsl(34 36% 91%)"
            hoveredPillTextColor="hsl(34 36% 91%)"
            pillTextColor="hsl(20 8% 6%)"
            initialLoadAnimation={false}
          />
        </div>

      </div>
    </div>
  );
}