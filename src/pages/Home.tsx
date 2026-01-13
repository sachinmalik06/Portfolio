import { lazy, Suspense } from "react";
import Navigation from "@/components/home/Navigation";
import Hero from "@/components/home/Hero";

// Lazy load sections below the fold for faster initial load
const About = lazy(() => import("@/components/home/About"));
const Expertise = lazy(() => import("@/components/home/Expertise"));
const Projects = lazy(() => import("@/components/home/Projects"));
const Contact = lazy(() => import("@/components/home/Contact"));

const Home = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <Suspense fallback={<div className="min-h-screen" />}>
        <About />
        <Expertise />
        <Projects />
        <Contact />
      </Suspense>
    </main>
  );
};

export default Home;
