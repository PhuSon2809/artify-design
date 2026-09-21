import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { TeamSection } from "@/components/sections/TeamSection";
import { getTeam } from "@/lib/projects";

export default function TeamPage() {
  const members = getTeam();

  return (
    <>
      <Navigation />
      <main>
        <TeamSection members={members} />
      </main>
      <Footer />
    </>
  );
}
