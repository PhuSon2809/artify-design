import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { ContactSection } from "@/components/sections/ContactSection";

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main className="flex-1">
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
