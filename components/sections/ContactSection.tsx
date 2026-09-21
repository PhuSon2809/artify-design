"use client";

import { motion } from "framer-motion";

export function ContactSection() {
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
