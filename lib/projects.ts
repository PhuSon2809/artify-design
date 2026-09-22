import projectsData from "@/data/projects.json";
import allProjectsData from "@/data/all-projects.json";
import teamData from "@/data/team.json";
import siteData from "@/data/site.json";
import type { Project, AllProject, TeamMember, SiteMeta } from "@/types";

const projects = projectsData as Project[];
const allProjects = allProjectsData as AllProject[];
const team = teamData as TeamMember[];
const site = siteData as SiteMeta;

export function cleanTitle(title: string): string {
  return title
    .replace(/\s*\(\s*(?:19|20)\d{2}\s*\)/gi, "")
    .replace(/\s*[-–—]?\s*\b(?:19|20)\d{2}\b/gi, "")
    .trim();
}

export function getSelectedProjects(): Project[] {
  return projects
    .filter((p) => p.order > 0)
    .sort((a, b) => a.order - b.order);
}

const ALL_PROJECT_TO_SELECTED_MAP: Record<string, string> = {
  "graduated-project-cho-du-hi": "cho-du-hi",
  "takahiro-corporation-design": "takahiro-corporation",
};

export function getProjectBySlug(slug: string): Project | undefined {
  const mappedSlug = ALL_PROJECT_TO_SELECTED_MAP[slug] || slug;

  // 1. Check curated projects
  const curated = projects.find((p) => p.id === mappedSlug || p.id === slug);
  if (curated) return curated;

  // 2. Check all-projects
  const fromAll = allProjects.find((p) => p.id === slug || p.id === mappedSlug);
  if (fromAll) {
    return {
      id: fromAll.id,
      title: fromAll.title,
      designer: fromAll.designer,
      designerProfile: fromAll.designerProfile || "",
      projectUrl: fromAll.projectUrl || "",
      category: fromAll.category,
      subcategory: fromAll.subcategory || fromAll.category,
      year: fromAll.year,
      client: fromAll.client ?? fromAll.designer,
      role: fromAll.role || "Design",
      capabilities: fromAll.capabilities || [],
      heroImage: fromAll.heroImage || {
        src: fromAll.coverUrl,
        alt: fromAll.title,
        width: 1600,
        height: 1200,
        aspectRatio: "landscape",
        quality: "high",
        usage: "hero",
      },
      supportingImages: fromAll.supportingImages || [],
      description: fromAll.description || "",
      concept: fromAll.concept || "",
      visualSystem: fromAll.visualSystem || "",
      application: fromAll.application || "",
      order: fromAll.order ?? 0,
    };
  }

  return undefined;
}

export function getAllProjectSlugs(): string[] {
  const slugs = new Set<string>();
  projects.forEach((p) => slugs.add(p.id));
  allProjects.forEach((p) => {
    const slug = ALL_PROJECT_TO_SELECTED_MAP[p.id] || p.id;
    slugs.add(slug);
  });
  return Array.from(slugs);
}

export function getAllProjects(): Project[] {
  const selected = getSelectedProjects();
  const selectedIds = new Set(selected.map((p) => p.id));

  const others = allProjects
    .map((ap) => getProjectBySlug(ap.id))
    .filter((p): p is Project => p !== undefined && !selectedIds.has(p.id));

  return [...selected, ...others];
}

export function getAdjacentProjects(
  slug: string
): { prev: Project | null; next: Project | null } {
  const all = getAllProjects();
  const mappedSlug = ALL_PROJECT_TO_SELECTED_MAP[slug] || slug;
  const index = all.findIndex((p) => p.id === mappedSlug || p.id === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? all[index - 1] : null,
    next: index < all.length - 1 ? all[index + 1] : null,
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

export function getInternalSlugMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const allP of allProjects) {
    map[allP.id] = ALL_PROJECT_TO_SELECTED_MAP[allP.id] || allP.id;
  }
  return map;
}
