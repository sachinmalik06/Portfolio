import Navigation from "@/components/home/Navigation";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Expertise from "@/components/home/Expertise";
import Projects from "@/components/home/Projects";
import Contact from "@/components/home/Contact";

const Home = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <About />
      <Expertise />
      <Projects />
      <Contact />
    </main>
  );
};

export default Home;
