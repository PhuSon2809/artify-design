import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { WorksGridSection } from "@/components/sections/WorksGridSection";
import { getAllProjects } from "@/lib/projects";

export default function WorkPage() {
  const projects = getAllProjects();

  return (
    <>
      <Navigation />
      <main className="flex-1">
        <WorksGridSection projects={projects} />
      </main>
      <Footer />
    </>
  );
}
