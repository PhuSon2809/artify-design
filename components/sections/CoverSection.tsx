"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getSiteMeta } from "@/lib/projects";

const FEATURED_HERO_WORKS = [
  {
    id: "posm-mo-nuong",
    title: "POSM Mơ Nướng",
    shortTitle: "Mơ Nướng",
    category: "POSM & Retail",
    designer: "Ploy Diep",
    image: "/images/projects/posm-mo-nuong/posm-mo-nuong-hero.webp",
    tag: "F&B / Print Design",
  },
  {
    id: "cho-du-hi",
    title: "Chợ Du Hí",
    shortTitle: "Chợ Du Hí",
    category: "Branding",
    designer: "Kiri Thăng Mai",
    image: "/images/projects/cho-du-hi/cho-du-hi-hero.png",
    tag: "Culture / Illustration",
  },
  {
    id: "takahiro-corporation",
    title: "Takahiro Corporation",
    shortTitle: "Takahiro",
    category: "Brand Identity",
    designer: "Kiri Thăng Mai",
    image: "/images/projects/takahiro-corporation/takahiro-hero.jpg",
    tag: "Corporate Identity",
  },
  {
    id: "famiglia-pizza",
    title: "Famiglia Pizza",
    shortTitle: "Famiglia",
    category: "Brand Identity",
    designer: "Trần Bảo",
    image: "/images/projects/famiglia-pizza/famiglia-pizza-hero.png",
    tag: "F&B / Hospitality",
  },
];

export function CoverSection() {
  const site = getSiteMeta();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeWork = FEATURED_HERO_WORKS[activeIndex];

  return (
    <section className="relative flex min-h-screen flex-col justify-between px-6 pb-10 pt-28 sm:pt-32 lg:px-8 2xl:pb-16 2xl:pt-36">
      {/* Top Header Block */}
      <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 2xl:col-span-8"
          >
            <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
              {site.tagline} — {site.location}
            </p>
            <h1 className="font-serif text-6xl font-normal leading-[0.92] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl 2xl:text-[10rem]">
              <span className="block">Artify</span>
              <span className="block italic text-muted-foreground/90">Design</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-end gap-5 lg:col-span-5 2xl:col-span-4"
          >
            <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              Creative team tại {site.location} chuyên về branding, key visual,
              social media, POSM và motion design.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <span className="rounded-full border border-border bg-secondary/40 px-3.5 py-1">
                Branding
              </span>
              <span className="rounded-full border border-border bg-secondary/40 px-3.5 py-1">
                Key Visual
              </span>
              <span className="rounded-full border border-border bg-secondary/40 px-3.5 py-1">
                POSM
              </span>
              <span className="rounded-full border border-border bg-secondary/40 px-3.5 py-1">
                Motion
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured Artwork Showcase Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        className="mx-auto my-8 w-full max-w-7xl 2xl:my-10 2xl:max-w-[1536px]"
      >
        <div className="group relative h-[40vh] sm:h-[46vh] lg:h-[50vh] 2xl:h-[54vh] w-full overflow-hidden rounded-2xl border border-border/80 bg-muted shadow-2xl">
          <Link href={`/work/${activeWork.id}`} className="block h-full w-full">
            <Image
              key={activeWork.id}
              src={activeWork.image}
              alt={activeWork.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              sizes="(max-width: 1536px) 100vw, 1536px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

            {/* Top Badges */}
            <div className="absolute left-4 top-4 sm:left-6 sm:top-6 flex items-center gap-3">
              <span className="rounded-full bg-background/90 px-3.5 py-1 text-[11px] font-medium uppercase tracking-wider text-foreground backdrop-blur-md">
                Featured Work
              </span>
              <span className="hidden sm:inline-block rounded-full bg-white/10 px-3.5 py-1 text-[11px] uppercase tracking-wider text-white/90 backdrop-blur-md">
                {activeWork.category}
              </span>
            </div>

            {/* Bottom Meta Overlay */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/70">
                  {activeWork.designer} — {activeWork.tag}
                </p>
                <h2 className="mt-1 font-serif text-2xl font-normal tracking-tight text-white sm:text-3xl lg:text-4xl">
                  {activeWork.title}
                </h2>
              </div>

              <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-white transition-opacity group-hover:opacity-80">
                <span>Xem chi tiết dự án</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>

        {/* Project Switcher Navigation */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {FEATURED_HERO_WORKS.map((work, idx) => (
              <button
                key={work.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 uppercase tracking-wider transition-all cursor-pointer ${
                  idx === activeIndex
                    ? "bg-foreground text-background font-medium shadow-sm"
                    : "border border-border/80 text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                <span className="font-serif italic">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span>{work.shortTitle}</span>
              </button>
            ))}
          </div>

          <Link
            href="#works"
            className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Khám phá 36 dự án</span>
            <ArrowDown className="h-3.5 w-3.5" />
          </Link>
        </div>
      </motion.div>

      {/* Bottom Status Bar */}
      <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center justify-between border-t border-border/50 pt-5 text-xs text-muted-foreground"
        >
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="uppercase tracking-widest">36 Dự án thiết kế</span>
            <span className="hidden sm:inline-block">/</span>
            <span className="hidden sm:inline-block uppercase tracking-widest">
              3 Thành viên
            </span>
            <span className="hidden md:inline-block">/</span>
            <span className="hidden md:inline-block uppercase tracking-widest">
              Client-Facing Portfolio
            </span>
          </div>

          <Link
            href="#works"
            className="group inline-flex items-center gap-2 uppercase tracking-widest transition-opacity hover:opacity-70"
          >
            <span>Scroll to explore</span>
            <ArrowDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
