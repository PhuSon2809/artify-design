"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

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
  const [zoom, setZoom] = React.useState(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);

  const [stageSize, setStageSize] = React.useState({ width: 1200, height: 800 });

  React.useEffect(() => {
    function updateStageSize() {
      if (typeof window !== "undefined") {
        const w = stageRef.current?.offsetWidth || Math.min(window.innerWidth * 0.92, 1280);
        const h = stageRef.current?.offsetHeight || window.innerHeight * 0.82;
        setStageSize({ width: w, height: h });
      }
    }

    updateStageSize();
    window.addEventListener("resize", updateStageSize);
    return () => window.removeEventListener("resize", updateStageSize);
  }, [isOpen, index]);

  const maxDragX = React.useMemo(() => {
    if (zoom <= 1) return 0;
    // Half of zoomed width allows pulling any edge past the center of the viewport
    return Math.round((stageSize.width * zoom) / 2);
  }, [stageSize.width, zoom]);

  const maxDragY = React.useMemo(() => {
    if (zoom <= 1) return 0;
    // Half of zoomed height allows pulling any edge past the center of the viewport
    return Math.round((stageSize.height * zoom) / 2);
  }, [stageSize.height, zoom]);

  React.useEffect(() => {
    if (isOpen) {
      setIndex(initialIndex);
      setZoom(1);
      x.set(0);
      y.set(0);
    }
  }, [isOpen, initialIndex, x, y]);

  // Reset zoom & pan whenever switching images
  React.useEffect(() => {
    setZoom(1);
    x.set(0);
    y.set(0);
  }, [index, x, y]);

  function handleZoomIn() {
    setZoom((prev) => Math.min(Number((prev + 0.5).toFixed(2)), 4));
  }

  function handleZoomOut() {
    setZoom((prev) => {
      const next = Math.max(Number((prev - 0.5).toFixed(2)), 1);
      if (next === 1) {
        animate(x, 0, { duration: 0.2, ease: "easeOut" });
        animate(y, 0, { duration: 0.2, ease: "easeOut" });
      }
      return next;
    });
  }

  function handleResetZoom() {
    setZoom(1);
    animate(x, 0, { duration: 0.2, ease: "easeOut" });
    animate(y, 0, { duration: 0.2, ease: "easeOut" });
  }

  // Keep pan within valid constraints when zoom level changes
  React.useEffect(() => {
    if (zoom === 1) {
      animate(x, 0, { duration: 0.2, ease: "easeOut" });
      animate(y, 0, { duration: 0.2, ease: "easeOut" });
    } else {
      const currentX = x.get();
      const currentY = y.get();
      if (Math.abs(currentX) > maxDragX) {
        x.set(Math.sign(currentX) * maxDragX);
      }
      if (Math.abs(currentY) > maxDragY) {
        y.set(Math.sign(currentY) * maxDragY);
      }
    }
  }, [zoom, maxDragX, maxDragY, x, y]);

  React.useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (zoom > 1) {
          handleResetZoom();
        } else {
          onClose();
        }
      } else if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        handleZoomIn();
      } else if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        handleZoomOut();
      } else if (event.key === "0") {
        event.preventDefault();
        handleResetZoom();
      } else if (event.key === "ArrowLeft") {
        if (zoom === 1) {
          setIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
        } else {
          x.set(Math.min(maxDragX, x.get() + 60));
        }
      } else if (event.key === "ArrowRight") {
        if (zoom === 1) {
          setIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
        } else {
          x.set(Math.max(-maxDragX, x.get() - 60));
        }
      } else if (event.key === "ArrowUp") {
        if (zoom > 1) {
          event.preventDefault();
          y.set(Math.min(maxDragY, y.get() + 60));
        }
      } else if (event.key === "ArrowDown") {
        if (zoom > 1) {
          event.preventDefault();
          y.set(Math.max(-maxDragY, y.get() - 60));
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, images.length, onClose, zoom, maxDragX, maxDragY, x, y]);

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
    setZoom(1);
    x.set(0);
    y.set(0);
    setIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }

  function goToNext(event?: React.MouseEvent) {
    event?.stopPropagation();
    setZoom(1);
    x.set(0);
    y.set(0);
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 select-none overflow-hidden"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          {/* Top Bar: Counter */}
          <div className="absolute top-4 left-4 z-10 text-sm font-mono text-white/70">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(images.length).padStart(2, "0")}
          </div>

          {/* Zoom Controls Toolbar */}
          <div
            className="absolute top-4 right-18 z-20 flex items-center gap-1 rounded-full bg-white/10 p-1 text-white backdrop-blur-md transition-colors hover:bg-white/15"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="Zoom out"
              title="Thu nhỏ (-)"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="min-w-[48px] px-1 text-center font-mono text-xs font-medium tracking-wider text-white/90 hover:text-white"
              aria-label="Reset zoom"
              title="Đặt lại (0)"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 4}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="Zoom in"
              title="Phóng to (+)"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            {zoom > 1 && (
              <button
                type="button"
                onClick={handleResetZoom}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/20"
                aria-label="Reset zoom"
                title="Khôi phục kích thước ban đầu"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close lightbox"
            title="Đóng (Esc)"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Navigation Prev Button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={goToPrev}
              className="absolute left-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
              aria-label="Previous image"
              title="Ảnh trước (←)"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* Image Stage */}
          <div
            ref={containerRef}
            className={cn(
              "relative flex flex-col items-center justify-center w-full h-full transition-all duration-200",
              zoom > 1
                ? "max-w-none max-h-none p-0 overflow-visible"
                : "max-w-[92vw] max-h-screen px-4 sm:px-16 overflow-hidden"
            )}
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => {
              if (e.ctrlKey || e.metaKey) {
                // Trackpad pinch gesture or Ctrl+wheel -> Zoom
                if (e.deltaY < 0) {
                  handleZoomIn();
                } else if (e.deltaY > 0) {
                  handleZoomOut();
                }
              } else if (zoom > 1) {
                // Trackpad scroll / mouse wheel -> Pan
                const currentY = y.get();
                const currentX = x.get();
                const newY = currentY - e.deltaY;
                const newX = currentX - e.deltaX;
                y.set(Math.max(-maxDragY, Math.min(maxDragY, newY)));
                x.set(Math.max(-maxDragX, Math.min(maxDragX, newX)));
              }
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage.src}
                ref={stageRef}
                style={{ x, y }}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{
                  opacity: 1,
                  scale: zoom,
                }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                drag={zoom > 1}
                dragConstraints={{
                  top: -maxDragY,
                  bottom: maxDragY,
                  left: -maxDragX,
                  right: maxDragX,
                }}
                dragElastic={0.1}
                className={cn(
                  "relative flex h-[78vh] sm:h-[82vh] w-full max-w-7xl items-center justify-center touch-none",
                  zoom > 1
                    ? "cursor-grab active:cursor-grabbing"
                    : "cursor-zoom-in"
                )}
                onClick={() => {
                  if (zoom === 1) {
                    setZoom(2);
                  }
                }}
                onDoubleClick={() => {
                  if (zoom > 1) {
                    handleResetZoom();
                  } else {
                    setZoom(2);
                  }
                }}
              >
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt || ""}
                  fill
                  className="object-contain select-none pointer-events-none"
                  sizes="(max-width: 1280px) 92vw, 1400px"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            {currentImage.caption && (
              <p
                className={cn(
                  "text-center text-sm text-white/80 pointer-events-none transition-all duration-200",
                  zoom > 1
                    ? "absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md px-4 py-1.5 rounded-full z-20 max-w-[90vw] truncate border border-white/10 shadow-lg"
                    : "mt-3"
                )}
              >
                {currentImage.caption}
              </p>
            )}
          </div>

          {/* Navigation Next Button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
              aria-label="Next image"
              title="Ảnh tiếp theo (→)"
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
