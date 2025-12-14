import styles from '@/styles/footer.module.scss';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.footerNav}>

      <Link href="/prenota" className={styles.footerLink}>
          <img src="/assets/img/icona1.png" alt="Prenota" className={styles.footerIcon} />
          <span className='flex'>Prenota</span>
        </Link>

        {/* MAPS */}
        <a
          href="https://www.google.com/maps/search/?api=1&query=SbaJo+Pomezia"
          target="_blank"
          rel="noopener"
          className={styles.footerLink}
        >
          <img
            src="/assets/img/icona2.png"
            alt=""
            className={styles.footerIcon}
            aria-hidden="true"
          />
          <span>Maps</span>
        </a>

        {/* INSTAGRAM */}
        <a
          href="https://www.instagram.com/sbajo_cocktail_bar?igsh=ZWs1bTJhN2F0amcz"
          target="_blank"
          rel="noopener"
          className={styles.footerLink}
        >
          <img
            src="/assets/img/icona3.png"
            alt=""
            className={styles.footerIcon}
            aria-hidden="true"
          />
          <span>Instagram</span>
        </a>

      </nav>

      <div className={styles.signature}>
        <span>Spazio web realizzato da: GaIA Software Studio per lo </span>
        <span>
          Sbajo di Silvio Falcone{' '}
          <span style={{ textDecoration: 'underline' }}>
            P. IVA: 18271391007
          </span>
        </span>
      </div>
    </footer>
  );
}
