import BackgroundCarousel from '@/components/BackgroundCarousel';
import Footer from '@/components/Footer';
import styles from '@/styles/home.module.scss';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className={styles.wrapper}>
      <main className={styles.main}>
        <BackgroundCarousel />
        <div className={styles.scrim} aria-hidden="true" />

        <header className={styles.content}>
          <img src="/assets/img/logo3.png" alt="Logo" className={styles.logo} />
        </header>

        <nav className={styles.iconGrid} aria-label="Sezioni principali">
          <Link href="/menu-food" className={styles.appIcon}>
            <img src="/assets/img/foto1.png" alt="Menu food icon" className={styles.iconImage} />
          </Link>

          <Link href="/menu-drink" className={styles.appIcon}>
            <img src="/assets/img/foto2.png" alt="Menu drink icon" className={styles.iconImage} />
          </Link>

          <Link href="/eventi" className={styles.appIcon}>
           <img src="/assets/img/menu3.png" alt="Eventi icon" className={styles.iconImage} />
          </Link>

          <Link href="/chi-siamo" className={styles.appIcon}>
            <img src="/assets/img/menu4.png" alt="Chi siamo icon" className={styles.iconImage} />
          </Link>
        </nav>

      </main>
      <Footer />


    </div>
  );
}