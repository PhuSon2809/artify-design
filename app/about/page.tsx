import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { AboutSection } from "@/components/sections/AboutSection";

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="flex-1">
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
