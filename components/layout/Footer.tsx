import { getSiteMeta } from "@/lib/projects";

export function Footer() {
  const site = getSiteMeta();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 lg:flex-row lg:px-8">
        <p className="text-sm text-muted-foreground">
          © {year} {site.name}. All rights reserved.
        </p>
        <p className="text-sm text-muted-foreground">
          {site.location}
        </p>
      </div>
    </footer>
  );
}
