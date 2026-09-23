"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { getSiteMeta } from "@/lib/projects";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "About", href: "/about", number: "01" },
  { label: "Work", href: "/work", number: "02" },
  { label: "Team", href: "/team", number: "03" },
  { label: "Contact", href: "/contact", number: "04" },
];

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {mounted && resolvedTheme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const site = getSiteMeta();

  const clearWorksScrollState = () => {
    try {
      sessionStorage.removeItem("portfolio_last_clicked_id");
      sessionStorage.removeItem("portfolio_works_scroll_y");
    } catch {}
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link
          href="/"
          onClick={clearWorksScrollState}
          className="font-serif text-xl tracking-tight transition-opacity hover:opacity-80 sm:text-2xl"
        >
          {site.name}
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={clearWorksScrollState}
              className={cn(
                "text-sm transition-colors hover:text-foreground",
                isActive(item.href)
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}

          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="h-9 w-9"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <SheetContent
              side="right"
              className="w-[85vw] max-w-[340px] p-6 sm:p-8 flex flex-col justify-between border-l border-border bg-background"
            >
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>

              {/* Header inside Drawer */}
              <div className="flex flex-col gap-1 pr-10 border-b border-border/60 pb-5">
                <Link
                  href="/"
                  onClick={() => {
                    setMobileOpen(false);
                    clearWorksScrollState();
                  }}
                  className="font-serif text-2xl tracking-tight text-foreground transition-opacity hover:opacity-80"
                >
                  {site.name}
                </Link>
                <p className="text-xs text-muted-foreground font-normal tracking-wide">
                  {site.tagline} • {site.location.split(",")[0]}
                </p>
              </div>

              {/* Nav Items List */}
              <nav className="flex flex-col gap-2 my-auto py-6">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        setMobileOpen(false);
                        clearWorksScrollState();
                      }}
                      className={cn(
                        "group flex items-center justify-between rounded-xl px-4 py-3.5 transition-all duration-200",
                        active
                          ? "bg-secondary text-foreground font-medium shadow-xs"
                          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                      )}
                    >
                      <div className="flex items-baseline gap-3.5">
                        <span
                          className={cn(
                            "font-mono text-xs transition-colors",
                            active
                              ? "text-foreground font-semibold"
                              : "text-muted-foreground/50 group-hover:text-muted-foreground"
                          )}
                        >
                          {item.number}
                        </span>
                        <span className="font-serif text-2xl tracking-tight">
                          {item.label}
                        </span>
                      </div>
                      <ArrowRight
                        className={cn(
                          "h-4 w-4 transition-all duration-200",
                          active
                            ? "opacity-100 translate-x-0 text-foreground"
                            : "opacity-0 -translate-x-2 group-hover:opacity-70 group-hover:translate-x-0"
                        )}
                      />
                    </Link>
                  );
                })}
              </nav>

              {/* Bottom / Footer of Drawer */}
              <div className="border-t border-border/60 pt-5 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{site.location}</span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Available
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground/60 pt-1">
                  © {new Date().getFullYear()} {site.name}. All rights reserved.
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
