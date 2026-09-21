"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Link from "next/link";

import { getSiteMeta } from "@/lib/projects";

export function CoverSection() {
  const site = getSiteMeta();

  return (
    <section className="relative flex min-h-screen flex-col justify-between px-6 pb-8 pt-32 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-10"
          >
            <h1 className="font-serif text-6xl font-normal leading-[0.95] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
              <span className="block">Artify</span>
              <span className="block italic">Design</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col justify-end lg:col-span-2"
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {site.tagline}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid items-end gap-8 lg:grid-cols-12"
        >
          <div className="lg:col-span-5">
            <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
              Creative team tại {site.location} chuyên về branding, key
              visual, social media, POSM và motion design.
            </p>
          </div>

          <div className="flex items-end justify-between lg:col-span-7">
            <Link
              href="/work"
              className="group inline-flex items-center gap-3 text-sm uppercase tracking-widest transition-opacity hover:opacity-60"
            >
              Selected Works
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
            </Link>

            <p className="text-sm text-muted-foreground">
              Scroll to explore
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
