"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { TeamMember } from "@/types";
import { getAllProjectsByDesigner } from "@/lib/projects";

interface TeamSectionProps {
  members: TeamMember[];
}

function MemberAvatar({ member }: { member: TeamMember }) {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (member.avatarUrl) {
    return (
      <div className="relative aspect-3/4 overflow-hidden bg-muted">
        <Image
          src={member.avatarUrl}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
    );
  }

  return (
    <div className="flex aspect-3/4 items-center justify-center bg-muted text-5xl font-medium tracking-tight text-muted-foreground transition-colors group-hover:bg-secondary">
      {initials}
    </div>
  );
}

export function TeamSection({ members }: TeamSectionProps) {
  return (
    <section className="px-6 py-32 lg:px-8 lg:py-48">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 grid gap-8 lg:grid-cols-12"
        >
          <div className="lg:col-span-4">
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              The Team
            </p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-serif text-4xl tracking-tight sm:text-5xl lg:text-6xl">
              Những người
              <br />
              <span className="italic text-muted-foreground">
                đứng sau Artify
              </span>
            </h2>
          </div>
        </motion.div>

        <div className="grid border-t border-l border-border sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member, index) => {
            const projectCount = getAllProjectsByDesigner(member.name).length;

            return (
              <motion.article
                key={member.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group flex flex-col border-b border-r border-border bg-background p-6 transition-colors hover:bg-secondary/30"
              >
                <Link href={`/team/${member.id}`} className="block">
                  <MemberAvatar member={member} />
                  <div className="mt-6">
                    <h3 className="font-serif text-2xl font-normal transition-colors group-hover:text-muted-foreground">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </Link>

                {member.bio && (
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {member.bio}
                  </p>
                )}

                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <Link
                    href={`/team/${member.id}`}
                    className="text-xs uppercase tracking-widest transition-opacity hover:opacity-70"
                  >
                    {projectCount} project
                    {projectCount !== 1 ? "s" : ""}
                  </Link>

                  {member.behanceUrl && (
                    <a
                      href={member.behanceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Behance
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
