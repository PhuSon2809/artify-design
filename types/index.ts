export type ImageQuality = "high" | "medium" | "low";
export type ImageAspect = "landscape" | "portrait" | "square";
export type ImageUsage = "hero" | "supporting" | "detail" | "thumbnail";

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  aspectRatio: ImageAspect;
  quality: ImageQuality;
  usage: ImageUsage;
  caption?: string;
}

export interface Project {
  id: string;
  title: string;
  designer: string;
  designerProfile: string;
  projectUrl: string;
  category: string;
  subcategory?: string;
  year: string;
  client?: string | null;
  role?: string;
  capabilities: string[];
  heroImage: ImageAsset;
  supportingImages: ImageAsset[];
  description?: string;
  concept?: string;
  visualSystem?: string;
  application?: string;
  order: number;
}

export interface AllProject {
  id: string;
  title: string;
  designer: string;
  designerProfile?: string;
  projectUrl?: string;
  category: string;
  subcategory?: string;
  year: string;
  coverUrl: string;
  isSelected: boolean;
  client?: string | null;
  role?: string;
  capabilities?: string[];
  heroImage?: ImageAsset;
  supportingImages?: ImageAsset[];
  description?: string;
  concept?: string;
  visualSystem?: string;
  application?: string;
  order?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  behanceUrl?: string;
  avatarUrl?: string;
  bio?: string;
  specialization?: string[];
}

export interface SiteMeta {
  name: string;
  tagline: string;
  location: string;
  language: string;
  contactEmail?: string;
  socialUrls?: Record<string, string>;
}
