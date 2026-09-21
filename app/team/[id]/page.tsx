import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import {
  getTeam,
  getTeamMemberById,
  getProjectsByDesigner,
  getAllProjectsByDesigner,
} from "@/lib/projects";

interface TeamMemberPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const members = getTeam();
  return members.map((member) => ({ id: member.id }));
}

export async function generateMetadata({ params }: TeamMemberPageProps) {
  const { id } = await params;
  const member = getTeamMemberById(id);
  if (!member) return {};

  return {
    title: `${member.name} — Artify Design`,
    description: member.bio,
  };
}

export default async function TeamMemberPage({
  params,
}: TeamMemberPageProps) {
  const { id } = await params;
  const member = getTeamMemberById(id);

  if (!member) {
    notFound();
  }

  const selectedProjects = getProjectsByDesigner(member.name);
  const allProjects = getAllProjectsByDesigner(member.name);

  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <Navigation />
      <main>
        {/* Header */}
        <section className="px-6 pb-16 pt-36 lg:px-8 lg:pb-24 lg:pt-44">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                {member.avatarUrl ? (
                  <div className="relative aspect-3/4 overflow-hidden bg-muted">
                    <Image
                      src={member.avatarUrl}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      priority
                    />
                  </div>
                ) : (
                  <div className="flex aspect-3/4 items-center justify-center bg-muted text-7xl font-medium tracking-tight text-muted-foreground">
                    {initials}
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-end lg:col-span-7 lg:col-start-6">
                <p className="mb-4 text-sm uppercase tracking-widest text-muted-foreground">
                  {member.role}
                </p>
                <h1 className="font-serif text-5xl font-normal tracking-tight sm:text-6xl lg:text-7xl">
                  {member.name}
                </h1>
                {member.bio && (
                  <p className="mt-8 max-w-2xl text-xl leading-relaxed text-muted-foreground">
                    {member.bio}
                  </p>
                )}
                {member.specialization && (
                  <div className="mt-10">
                    <p className="text-sm uppercase tracking-widest text-muted-foreground">
                      Specialization
                    </p>
                    <p className="mt-3 font-serif text-2xl">
                      {member.specialization.join(" / ")}
                    </p>
                  </div>
                )}
                <div className="mt-10 flex flex-wrap items-center gap-8">
                  <span className="text-sm uppercase tracking-widest text-muted-foreground">
                    {allProjects.length} projects on Behance
                  </span>
                  {member.behanceUrl && (
                    <a
                      href={member.behanceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-sm uppercase tracking-widest transition-opacity hover:opacity-70"
                    >
                      Xem Behance
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Selected Works */}
        {selectedProjects.length > 0 && (
          <section className="border-t border-border px-6 py-24 lg:px-8 lg:py-32">
            <div className="mx-auto max-w-7xl">
              <h2 className="mb-16 font-serif text-3xl tracking-tight sm:text-4xl">
                Selected Works on Artify
              </h2>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {selectedProjects.map((project) => (
                  <article key={project.id}>
                    <Link
                      href={`/work/${project.id}`}
                      className="group block"
                    >
                      <div className="relative aspect-4/3 overflow-hidden bg-muted">
                        <Image
                          src={project.heroImage.src}
                          alt={project.heroImage.alt}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <div className="mt-4">
                        <h3 className="font-serif text-xl font-normal transition-colors group-hover:text-muted-foreground">
                          {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {project.category}
                        </p>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Behance Projects */}
        <section className="border-t border-border px-6 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-4 font-serif text-3xl tracking-tight sm:text-4xl">
              All Behance Projects
            </h2>
            <p className="mb-16 max-w-2xl text-muted-foreground">
              Toàn bộ dự án {member.name} đã đăng tải trên Behance.
            </p>

            <div className="grid border-t border-l border-border sm:grid-cols-2 lg:grid-cols-3">
              {allProjects.map((project) => (
                <a
                  key={project.id}
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col border-b border-r border-border bg-background transition-colors hover:bg-secondary/30"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-muted">
                    <Image
                      src={project.coverUrl}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <span
                        className={`text-xs uppercase tracking-widest ${
                          project.isSelected
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {project.isSelected ? "Selected" : project.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {project.year}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-normal leading-snug transition-colors group-hover:text-muted-foreground">
                      {project.title}
                    </h3>
                    <div className="mt-auto flex items-center gap-2 pt-6 text-sm text-muted-foreground">
                      <span>View on Behance</span>
                      <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
