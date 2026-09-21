import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { CoverSection } from "@/components/sections/CoverSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { WorksGridSection } from "@/components/sections/WorksGridSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { getSelectedProjects } from "@/lib/projects";

export default function HomePage() {
  const projects = getSelectedProjects();

  return (
    <>
      <Navigation />
      <main>
        <CoverSection />
        <AboutSection />
        <WorksGridSection projects={projects} />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
