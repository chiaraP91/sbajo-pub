import BackgroundCarousel from '@/components/BackgroundCarousel';
import Footer from '@/components/Footer';
import styles from '@/styles/home.module.scss';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className={styles.wrapper}>
      <main className={styles.content}>
        <BackgroundCarousel />
        <div className={styles.scrim} aria-hidden="true" />

        <header className={styles.content}>
          <h1 className={styles.logo}>SbaJo</h1>
          <p className={styles.tagline}>È il posto dove l’errore diventa stile</p>
        </header>

        <nav className={styles.iconGrid} aria-label="Sezioni principali">
          <Link href="/menu-food" className={styles.appIcon}>
            <svg viewBox="0 0 64 64" aria-hidden="true"><g fill="none" strokeWidth="2">
              <rect x="8" y="28" width="48" height="10" rx="4" />
              <path d="M10 26c3-8 41-8 44 0" />
              <path d="M12 40h40M18 48h28" />
            </g></svg>
            <span>Menu food</span>
          </Link>

          <Link href="/menu-drink" className={styles.appIcon}>
            <svg viewBox="0 0 64 64" aria-hidden="true"><g fill="none" strokeWidth="2">
              <path d="M8 12h48L32 36 8 12z" />
              <path d="M32 36v14" />
              <path d="M22 50h20" />
            </g></svg>
            <span>Menu drink</span>
          </Link>

          <Link href="/eventi" className={styles.appIcon}>
            <svg viewBox="0 0 64 64" aria-hidden="true"><g fill="none" strokeWidth="2">
              <rect x="10" y="14" width="44" height="40" rx="4" />
              <path d="M10 24h44" />
              <path d="M20 10v8M44 10v8" />
              <rect x="18" y="30" width="8" height="8" rx="2" />
              <rect x="30" y="30" width="8" height="8" rx="2" />
              <rect x="42" y="30" width="8" height="8" rx="2" />
            </g></svg>
            <span>Eventi</span>
          </Link>

          <Link href="/chi-siamo" className={styles.appIcon}>
            <svg viewBox="0 0 64 64" aria-hidden="true"><g fill="none" strokeWidth="2">
              <path d="M8 44h48" />
              <path d="M14 44c0-10 8-18 18-18s18 8 18 18" />
              <circle cx="32" cy="20" r="3" />
            </g></svg>
            <span>Chi siamo</span>
          </Link>
        </nav>

      </main>
      <Footer />


    </div>
  );
}