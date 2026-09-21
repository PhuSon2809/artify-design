"use client";

import { motion } from "framer-motion";

const capabilities = [
  { title: "Branding", number: "01" },
  { title: "Key Visual", number: "02" },
  { title: "Social Media", number: "03" },
  { title: "POSM & Retail", number: "04" },
  { title: "Motion", number: "05" },
  { title: "Illustration", number: "06" },
];

export function AboutSection() {
  return (
    <section className="px-6 py-32 lg:px-8 lg:py-48">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4"
          >
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              About
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-8"
          >
            <h2 className="font-serif text-3xl leading-snug tracking-tight sm:text-4xl lg:text-5xl">
              Chúng tôi là một creative studio tin rằng thiết kế đẹp phải đi
              cùng{" "}
              <span className="italic text-muted-foreground">ý nghĩa rõ ràng</span>.
            </h2>
            <div className="mt-10 max-w-2xl space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                Artify Design hợp tác cùng các thương hiệu để tạo ra hệ thống
                nhận diện, chiến dịch truyền thông và trải nghiệm thị giác có
                tính thống nhất — từ concept đến execution.
              </p>
              <p>
                Mỗi project được chọn lọc kỹ lưỡng, với mục tiêu kể một câu
                chuyện thuyết phục về năng lực của cả team.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="mt-32 border-t border-border">
          {capabilities.map((cap, index) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="flex items-center justify-between border-b border-border py-6 transition-colors hover:bg-secondary/30"
            >
              <span className="font-serif text-2xl font-normal sm:text-3xl">
                {cap.title}
              </span>
              <span className="text-sm text-muted-foreground">
                {cap.number}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
