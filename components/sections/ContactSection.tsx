"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";

import { getSiteMeta } from "@/lib/projects";

export function ContactSection() {
  const site = getSiteMeta();

  return (
    <section className="border-t border-border px-6 py-32 lg:px-8 lg:py-48">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid gap-16 lg:grid-cols-12"
        >
          <div className="lg:col-span-5">
            <p className="mb-6 text-sm uppercase tracking-widest text-muted-foreground">
              Contact
            </p>
            <h2 className="font-serif text-4xl tracking-tight sm:text-5xl lg:text-6xl">
              Cùng nhau
              <br />
              <span className="italic text-muted-foreground">
                tạo nên điều ý nghĩa
              </span>
            </h2>
          </div>

          <div className="flex flex-col justify-end gap-10 lg:col-span-6 lg:col-start-7">
            <p className="text-xl leading-relaxed text-muted-foreground">
              Nếu bạn có một dự án, một ý tưởng hoặc chỉ đơn giản là muốn trao
              đổi, chúng tôi luôn sẵn sàng lắng nghe.
            </p>

            {site.contactEmail && (
              <a
                href={`mailto:${site.contactEmail}`}
                className="group inline-flex items-center gap-4 text-2xl font-medium transition-opacity hover:opacity-70 sm:text-3xl"
              >
                <Mail className="h-6 w-6" />
                {site.contactEmail}
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}

            {site.socialUrls?.behance && (
              <a
                href={site.socialUrls.behance}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
              >
                Behance
                <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
