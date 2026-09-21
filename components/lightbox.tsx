"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types";

interface LightboxProps {
  images: ImageAsset[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function Lightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}: LightboxProps) {
  const [index, setIndex] = React.useState(initialIndex);

  React.useEffect(() => {
    if (isOpen) {
      setIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  React.useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft") {
        setIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (event.key === "ArrowRight") {
        setIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, images.length, onClose]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const currentImage = images[index];
  if (!currentImage) return null;

  function goToPrev(event?: React.MouseEvent) {
    event?.stopPropagation();
    setIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }

  function goToNext(event?: React.MouseEvent) {
    event?.stopPropagation();
    setIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute top-4 left-4 z-10 text-sm text-white/70">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(images.length).padStart(2, "0")}
          </div>

          {images.length > 1 && (
            <button
              onClick={goToPrev}
              className="absolute left-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          <div
            className="relative max-h-screen w-full max-w-[90vw] px-16 sm:max-w-[92vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage.src}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="relative flex max-h-screen items-center justify-center"
              >
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt}
                  width={currentImage.width}
                  height={currentImage.height}
                  className="max-h-[85vh] w-auto object-contain"
                  sizes="90vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            {currentImage.caption && (
              <p className="absolute bottom-4 left-16 right-16 text-center text-sm text-white/70">
                {currentImage.caption}
              </p>
            )}
          </div>

          {images.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface LightboxTriggerProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function LightboxTrigger({
  children,
  className,
  onClick,
}: LightboxTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("cursor-zoom-in", className)}
    >
      {children}
    </button>
  );
}
