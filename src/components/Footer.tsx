import Link from 'next/link';
import styles from '@/styles/footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.footerNav}>
        <Link href="/prenota" className={styles.footerLink}>
          <img src="/assets/img/icona1.png" alt="Prenota" className={styles.footerIcon} />
          <span>Prenota</span>
        </Link>
        <a
          href="https://maps.google.com/?q=SbaJo+Anzio"
          target="_blank"
          rel="noopener"
          className={styles.footerLink}
        >
          <img src="/assets/img/icona2.png" alt="Maps" className={styles.footerIcon} />
          <span>Maps</span>
        </a>
        <a
          href="https://instagram.com/sbajo.cocktailbar"
          target="_blank"
          rel="noopener"
          className={styles.footerLink}
        >
          <img src="/assets/img/icona3.png" alt="Instagram" className={styles.footerIcon} />
          <span>Instagram</span>
        </a>
      </nav>
    </footer>
  );
}