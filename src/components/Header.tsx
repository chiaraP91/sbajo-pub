import Link from 'next/link';
import styles from '@/styles/header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <img src="/assets/img/logo2.png" alt="Logo" />
      </Link>
      <nav className={styles.nav}>
        <Link href="/menu-food" className={styles.icon} title="Menu food">🍔</Link>
        <Link href="/menu-drink" className={styles.icon} title="Menu drink">🍸</Link>
        <Link href="/eventi" className={styles.icon} title="Eventi">📅</Link>
        <Link href="/chi-siamo" className={styles.icon} title="Chi siamo">👤</Link>
      </nav>
    </header>
  );
}