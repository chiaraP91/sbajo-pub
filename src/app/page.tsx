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

        <nav className={styles.actions} aria-label="Sezioni principali">
          
            <Link href="/menu-drink" className={styles.pillBtn}>Cocktail</Link>
            <Link href="/menu-food" className={styles.pillBtn}>Cucina creativa</Link>
            <Link href="/eventi" className={styles.pillBtn}>Eventi</Link>
            <Link href="/chi-siamo" className={styles.pillBtn}>Chi siamo</Link>
         
        </nav>

      </main>
      <Footer />


    </div>
  );
}