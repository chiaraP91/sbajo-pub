# SEO Setup & Ottimizzazione - Sbajo Cocktail Bar

## ✅ Ottimizzazioni Implementate

### 1. **Sitemap XML Migliorata**

- ✅ Priority per ogni pagina (1.0 per home, 0.9 per menu)
- ✅ Change frequency (daily per eventi, weekly per menu)
- ✅ Last modified timestamp
- 📍 URL: `https://sbajococktailbar.it/sitemap.xml`

### 2. **Metadata SEO Avanzate**

- ✅ Viewport ottimizzato per mobile-first indexing
- ✅ Meta robots completi con direttive per Googlebot
- ✅ Format detection (telefono, email, indirizzo)
- ✅ Metadata base URL per canonical
- ✅ OpenGraph e Twitter Cards
- ✅ Authors, creator, publisher

### 3. **Schema.org JSON-LD Arricchito**

- ✅ Tipo: `Restaurant` (più specifico di LocalBusiness)
- ✅ Coordinate GPS (lat/long)
- ✅ Orari di apertura strutturati
- ✅ Prezzo range (€€)
- ✅ Tipo di cucina
- ✅ Accepts reservations: true
- ✅ Social media links

### 4. **PWA & Mobile**

- ✅ manifest.json completo
- ✅ Icons e shortcuts per app menu
- ✅ Theme colors
- ✅ Standalone display mode

### 5. **Performance**

- ✅ Preconnect a Google Fonts
- ✅ Headers di cache (31536000s per assets statici)
- ✅ Security headers (X-Frame-Options, CSP, etc.)
- ✅ Output statico per velocità massima

---

## 🚀 Passi per Accelerare l'Indicizzazione

### **1. Google Search Console** (PRIORITÀ MASSIMA)

#### Registrazione:

1. Vai su: https://search.google.com/search-console
2. Clicca "Aggiungi proprietà"
3. Scegli "Proprietà URL-prefix"
4. Inserisci: `https://sbajococktailbar.it`

#### Metodi di verifica (scegli uno):

**Opzione A - File HTML** (più semplice):

1. Google ti darà un file tipo `google1234567890.html`
2. Salvalo in `public/google1234567890.html`
3. Deploy il sito
4. Clicca "Verifica" su Search Console

**Opzione B - Meta tag** (alternativa):

1. Google ti darà un tag tipo: `<meta name="google-site-verification" content="ABC123..."/>`
2. Aggiungilo in `src/app/layout.tsx` dentro la sezione `<head>`
3. Deploy il sito
4. Clicca "Verifica"

**Opzione C - DNS TXT Record**:

1. Aggiungi un record TXT al tuo dominio con il codice fornito
2. Clicca "Verifica"

#### Dopo la verifica:

1. **Submit Sitemap:**
   - Nel menu laterale: "Sitemap"
   - Aggiungi: `https://sbajococktailbar.it/sitemap.xml`
   - Clicca "Invia"
2. **Request Indexing per pagine importanti:**
   - Vai su "Controllo URL"
   - Inserisci URL (es: `https://sbajococktailbar.it/`)
   - Clicca "Richiedi indicizzazione"
   - Ripeti per: `/menu-drink`, `/menu-food`, `/eventi`, `/prenota`, `/chi-siamo`

---

### **2. Google Business Profile** (per Google Maps)

#### Setup:

1. Vai su: https://business.google.com
2. Clicca "Gestisci ora"
3. Cerca "Sbajo Cocktail Bar, Aprilia"
4. Se esiste già, rivendica l'attività
5. Se non esiste, creala inserendo:
   - Nome: Sbajo Cocktail Bar
   - Categoria: Cocktail bar / Ristorante
   - Indirizzo: [Inserisci indirizzo completo con CAP]
   - Telefono: +39 333 380 7934
   - Sito web: https://sbajococktailbar.it
   - Orari: Mar-Dom 18:00-02:00, Lun chiuso

#### Verifica:

- Google manderà una cartolina postale con codice PIN
- Inserisci il codice per verificare l'attività

#### Ottimizza il profilo:

- Aggiungi foto del locale, cocktail, piatti
- Inserisci descrizione dettagliata
- Collega i social (Instagram, Facebook)
- Abilita "Prenotazioni" con link al sito
- Aggiungi menu (PDF o link esterno)

---

### **3. Bing Webmaster Tools**

1. Vai su: https://www.bing.com/webmasters
2. Aggiungi il sito: `https://sbajococktailbar.it`
3. Verifica (puoi importare da Google Search Console)
4. Submit sitemap: `https://sbajococktailbar.it/sitemap.xml`

---

### **4. Social Media Optimization**

#### Instagram & Facebook:

- ✅ Aggiungi link al sito nel profilo
- ✅ Usa l'indirizzo completo nel profilo business
- ✅ Condividi link alle pagine del sito nei post
- ✅ Usa hashtag localizzati: #Aprilia #LazioFood #CocktailBarAprilia

#### Story & Post con link:

- Link diretto alle pagine: `/menu-drink`, `/eventi`, `/prenota`
- Google indicizza contenuti linkati dai social con engagement alto

---

### **5. Backlink Locali**

Registra l'attività su:

- **TripAdvisor**: https://www.tripadvisor.it/Owners
- **TheFork** (per prenotazioni)
- **Google Maps** (automatico con Business Profile)
- **Directory locali** (PagineGialle, Virgilio, etc.)
- **Blog food locali** del Lazio

---

### **6. Contenuto Fresco**

Per velocizzare l'indicizzazione:

- Aggiorna sezione "Eventi" regolarmente
- Blog post su cocktail, ricette, eventi passati
- Aggiungi pagina "News" o "Blog"
- Ogni nuovo contenuto viene indicizzato più velocemente

---

## 📊 Monitoring & Metriche

### Google Search Console (verifica dopo 7-14 giorni):

- **Copertura**: tutte le 6 pagine devono essere "Valide"
- **Prestazioni**: impressions, click, CTR, posizione media
- **Core Web Vitals**: LCP, FID, CLS devono essere "Buoni"

### Google Analytics 4 (opzionale ma consigliato):

1. Crea proprietà GA4: https://analytics.google.com
2. Aggiungi tracking code in `layout.tsx`:

```tsx
<Script
  strategy="afterInteractive"
  src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

---

## ⏱️ Tempi di Indicizzazione

### Realistici:

- **Sitemap submitted**: 1-3 giorni per prima scansione
- **Indicizzazione completa**: 7-14 giorni
- **Rankings**: 4-8 settimane per posizionamento

### Acceleratori:

- ✅ Request indexing manuale: 24-48 ore
- ✅ Backlink da siti autorevoli: 3-7 giorni
- ✅ Social signals (condivisioni): immediato
- ✅ Contenuto fresco: 1-3 giorni

---

## 🔍 Test Immediati

### Verifica che tutto funzioni:

1. **robots.txt**:

   ```
   https://sbajococktailbar.it/robots.txt
   ```

   Deve mostrare: `Allow: /` e link alla sitemap

2. **Sitemap XML**:

   ```
   https://sbajococktailbar.it/sitemap.xml
   ```

   Deve mostrare tutte le 6 pagine con priority e changeFrequency

3. **Manifest.json**:

   ```
   https://sbajococktailbar.it/manifest.json
   ```

   Deve mostrare il manifest PWA

4. **Rich Results Test**:
   - Vai su: https://search.google.com/test/rich-results
   - Inserisci: `https://sbajococktailbar.it`
   - Deve rilevare lo Schema.org Restaurant

5. **Lighthouse SEO** (Chrome DevTools):
   - F12 > Lighthouse > SEO
   - Target: 90-100/100

---

## 📝 Checklist Post-Deploy

- [ ] Deploy del sito con le nuove ottimizzazioni
- [ ] Verifica robots.txt è accessibile
- [ ] Verifica sitemap.xml è accessibile
- [ ] Verifica manifest.json è accessibile
- [ ] Registra dominio su Google Search Console
- [ ] Submit sitemap su Search Console
- [ ] Request indexing per pagine principali (6 URL)
- [ ] Registra Google Business Profile
- [ ] Aggiungi link al sito su Instagram/Facebook
- [ ] Test con Rich Results Tool
- [ ] Test con Lighthouse (score SEO > 90)
- [ ] Registra su Bing Webmaster Tools
- [ ] Setup Google Analytics (opzionale)

---

## 🎯 Keyword Target (per contenuti futuri)

### Primarie:

- cocktail bar aprilia
- aperitivo aprilia
- ristorante aprilia
- eventi aprilia

### Secondarie:

- cucina creativa lazio
- dove mangiare aprilia
- locali aprilia
- cocktail artigianali
- burger gourmet aprilia

### Long-tail:

- "migliori cocktail bar vicino aprilia"
- "dove fare aperitivo ad aprilia"
- "ristoranti con eventi aprilia"
- "cocktail bar con cucina aprilia"

---

## 💡 Tips Finali

1. **Consistenza NAP**: Nome, Indirizzo, Telefono devono essere identici ovunque (sito, Google Maps, social, directory)

2. **Review**: Chiedi ai clienti di lasciare recensioni su Google Maps. Le recensioni migliorano ranking locale.

3. **Foto**: Google ama i siti con molte immagini ottimizzate. Usa alt text descrittivi.

4. **Mobile**: 60% del traffico è mobile. Il tuo sito è già ottimizzato.

5. **Velocità**: Sito statico = velocità massima = SEO boost.

---

**Domande?** Chiedi pure per approfondimenti su qualsiasi punto! 🚀
