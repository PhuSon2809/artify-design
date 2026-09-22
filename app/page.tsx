import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { CoverSection } from "@/components/sections/CoverSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { WorksGridSection } from "@/components/sections/WorksGridSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { getAllProjects } from "@/lib/projects";

export default function HomePage() {
  const projects = getAllProjects();

  return (
    <>
      <Navigation />
      <main className="flex-1">
        <CoverSection projects={projects} />
        <AboutSection />
        <WorksGridSection projects={projects} />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
