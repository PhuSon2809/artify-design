import Link from "next/link";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

export default function NotFoundPage() {
  return (
    <>
      <Navigation />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-medium tracking-tight">404</h1>
        <p className="mt-4 text-muted-foreground">
          Trang bạn tìm kiếm không tồn tại.
        </p>
        <Link
          href="/"
          className="mt-8 text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          Quay về trang chủ
        </Link>
      </main>
      <Footer />
    </>
  );
}
