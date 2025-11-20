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

  //ref è un prop da usare al posto dello useEffect

  //useState per rendere le variabili modificabili senza perderle al render

  //prop. oggetto che passi al compenente (ad es. images è un prop)

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