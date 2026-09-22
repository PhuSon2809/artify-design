import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { TeamProjectsGrid } from "@/components/sections/TeamProjectsGrid";
import {
  getTeam,
  getTeamMemberById,
  getProjectsByDesigner,
  getAllProjectsByDesigner,
  getInternalSlugMap,
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
  const internalSlugMap = getInternalSlugMap();

  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <Navigation />
      <main className="flex-1">
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
                    {allProjects.length} dự án hoàn thành
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Selected Works */}
        {selectedProjects.length > 0 && (
          <section className="border-t border-border px-6 pt-16 pb-12 lg:px-8 lg:pt-20 lg:pb-14">
            <div className="mx-auto max-w-7xl">
              <h2 className="mb-8 font-serif text-3xl tracking-tight sm:text-4xl lg:mb-10">
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

              {/* Continuation hint linking to All Projects */}
              <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border/40 pt-6">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  {selectedProjects.length} dự án tiêu biểu được chọn lọc
                </span>
                <a
                  href="#all-projects"
                  className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-foreground transition-opacity hover:opacity-70"
                >
                  <span>Xem toàn bộ {allProjects.length} dự án bên dưới</span>
                  <ArrowDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
                </a>
              </div>
            </div>
          </section>
        )}

        {/* All Projects */}
        <section
          id="all-projects"
          className="border-t border-border px-6 pt-12 pb-24 lg:px-8 lg:pt-16 lg:pb-32 scroll-mt-20"
        >
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-3 font-serif text-3xl tracking-tight sm:text-4xl">
              Tất cả dự án
            </h2>
            <p className="mb-8 max-w-2xl text-muted-foreground sm:mb-10">
              Toàn bộ các dự án thiết kế thực hiện bởi {member.name} tại Artify Design.
            </p>

            <TeamProjectsGrid
              projects={allProjects}
              member={member}
              internalSlugMap={internalSlugMap}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
