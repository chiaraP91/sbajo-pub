import Link from 'next/link';
import styles from '@/styles/home.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.footerNav}>
        <Link href="/prenota" className={styles.footerLink}>
          <span>📞 Prenota</span>
        </Link>
        <a
          href="https://maps.google.com/?q=SbaJo+Anzio"
          target="_blank"
          rel="noopener"
          className={styles.footerLink}
        >
          <span>📍 Maps</span>
        </a>
      </nav>
    </footer>
  );
}