import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { WorksGridSection } from "@/components/sections/WorksGridSection";
import { getSelectedProjects } from "@/lib/projects";

export default function WorkPage() {
  const projects = getSelectedProjects();

  return (
    <>
      <Navigation />
      <main>
        <WorksGridSection projects={projects} />
      </main>
      <Footer />
    </>
  );
}
