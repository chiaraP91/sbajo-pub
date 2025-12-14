'use client';
import { useEffect, useState } from 'react';
import styles from '@/styles/home.module.scss';

const slides = [
  '/assets/img/sfondo1.png',
  '/assets/img/sfondo2.png',
  '/assets/img/sfondo3.png',
];

export default function BackgroundCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.bgLayer} aria-hidden="true">
      {slides.map((src, i) => (
        <img
          key={i}
          src={src}
          className={`${styles.bg} ${i === current ? styles.active : ''}`}
          alt=""
        />
      ))}
    </div>
  );
}