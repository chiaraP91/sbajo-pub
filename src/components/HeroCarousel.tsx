'use client';
import { useEffect, useState } from 'react';
import styles from '@/styles/menu.module.scss';

export default function HeroCarousel({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 5000); // cambia ogni 5 secondi

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className={styles.hero}>
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          className={`${styles.bg} ${i === activeIndex ? styles.active : ''}`}
          alt=""
          aria-hidden="true"
        />
      ))}
    </div>
  );
}