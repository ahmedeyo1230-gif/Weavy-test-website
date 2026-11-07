'use client';
import React, { useState, useEffect, useImperativeHandle, useRef } from 'react';
import type { HTMLAttributes } from 'react';

const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(' ');

export interface GalleryItem {
  common: string;
  binomial: string;
  photo: {
    url: string;
    text: string;
    pos?: string;
    by: string;
  };
}

interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  radius?: number;
  autoRotateSpeed?: number;
  /** Card size in px (defaults keep the original 270×360). */
  cardWidth?: number;
  cardHeight?: number;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 600, autoRotateSpeed = 0.02, cardWidth = 270, cardHeight = 360, ...props }, ref) => {
    const [rotation, setRotation] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);
    // Nearby: the photos can start loading, and it keeps turning. Off screen it
    // would otherwise re-render every card on every frame for nothing.
    const [isNear, setIsNear] = useState(false);
    const [photosRequested, setPhotosRequested] = useState(false);

    useEffect(() => {
      const el = rootRef.current;
      if (!el) return;
      const observer = new IntersectionObserver(([entry]) => {
        setIsNear(entry.isIntersecting);
        if (entry.isIntersecting) setPhotosRequested(true);
      }, { rootMargin: '300px 0px' });
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    useEffect(() => {
      if (!isNear) return;
      const handleScroll = () => {
        setIsScrolling(true);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        const scrollableHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress =
          scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        setRotation(scrollProgress * 360);
        scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150);
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      };
    }, [isNear]);

    useEffect(() => {
      if (!isNear) return;
      const autoRotate = () => {
        if (!isScrolling) setRotation(prev => prev + autoRotateSpeed);
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };
      animationFrameRef.current = requestAnimationFrame(autoRotate);
      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }, [isNear, isScrolling, autoRotateSpeed]);

    const anglePerItem = 360 / items.length;

    return (
      <div
        ref={rootRef}
        role="region"
        aria-label="Circular 3D Gallery"
        className={cn('relative w-full h-full flex items-center justify-center', className)}
        style={{ perspective: '2000px' }}
        {...props}
      >
        <div
          className="relative w-full h-full"
          style={{ transform: `rotateY(${rotation}deg)`, transformStyle: 'preserve-3d' }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(
              relativeAngle > 180 ? 360 - relativeAngle : relativeAngle
            );
            const opacity = Math.max(0.25, 1 - normalizedAngle / 180);

            return (
              <div
                key={item.photo.url}
                role="group"
                aria-label={item.common}
                className="absolute"
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: '50%',
                  top: '50%',
                  marginLeft: -cardWidth / 2,
                  marginTop: -cardHeight / 2,
                  opacity,
                  transition: 'opacity 0.3s linear',
                }}
              >
                <div
                  className="relative w-full h-full overflow-hidden"
                  style={{
                    borderRadius: '14px',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    background: '#0a0f12',
                  }}
                >
                  <img
                    loading="lazy"
                    decoding="async"
                    src={photosRequested ? item.photo.url : undefined}
                    alt={item.photo.text}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: item.photo.pos ?? 'center' }}
                  />
                  <div
                    className="absolute bottom-0 left-0 w-full p-4 text-white"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                    }}
                  >
                    <p className="text-sm font-medium" style={{ letterSpacing: '0.01em', color: 'rgba(255,255,255,0.9)' }}>
                      {item.common}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-description)', letterSpacing: '0.04em', marginTop: '2px' }}>
                      {item.binomial}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = 'CircularGallery';
export { CircularGallery };
