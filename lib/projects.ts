import projectsData from "@/data/projects.json";
import allProjectsData from "@/data/all-projects.json";
import teamData from "@/data/team.json";
import siteData from "@/data/site.json";
import type { Project, AllProject, TeamMember, SiteMeta } from "@/types";

const projects = projectsData as Project[];
const allProjects = allProjectsData as AllProject[];
const team = teamData as TeamMember[];
const site = siteData as SiteMeta;

export function getSelectedProjects(): Project[] {
  return projects
    .filter((p) => p.order > 0)
    .sort((a, b) => a.order - b.order);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.id === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.filter((p) => p.order > 0).map((p) => p.id);
}

export function getAdjacentProjects(
  slug: string
): { prev: Project | null; next: Project | null } {
  const selected = getSelectedProjects();
  const index = selected.findIndex((p) => p.id === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: selected[index - 1] || null,
    next: selected[index + 1] || null,
  };
}

export function getTeam(): TeamMember[] {
  return team;
}

export function getTeamMemberById(id: string): TeamMember | undefined {
  return team.find((m) => m.id === id);
}

export function getProjectsByDesigner(designerName: string): Project[] {
  return getSelectedProjects().filter((p) =>
    p.designer.toLowerCase().includes(designerName.toLowerCase())
  );
}

export function getAllProjectsByDesigner(
  designerName: string
): AllProject[] {
  return allProjects.filter((p) =>
    p.designer.toLowerCase().includes(designerName.toLowerCase())
  );
}

export function getSiteMeta(): SiteMeta {
  return site;
}
