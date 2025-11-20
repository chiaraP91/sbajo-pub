import Link from 'next/link';
import styles from '@/styles/header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <img src="/assets/img/logo2.png" alt="Logo" className={styles.logoImage} />
      </Link>
      <nav className={styles.nav}>
        <Link href="/menu-food" className={styles.icon} title="Menu food"><img src="/assets/img/icona6.png" alt="Menu food icon" className={styles.iconImage} /></Link>
        <Link href="/menu-drink" className={styles.icon} title="Menu drink"><img src="/assets/img/icona5.png" alt="Menu food icon" className={styles.iconImage} /></Link>
        <Link href="/eventi" className={styles.icon} title="Eventi"><img src="/assets/img/icona7.png" alt="eventi icon" className={styles.iconImage} /></Link>
        <Link href="/chi-siamo" className={styles.icon} title="Chi siamo"><img src="/assets/img/icona8.png" alt="contatti icon" className={styles.iconImage} /></Link>
      </nav>
    </header>
  );
}