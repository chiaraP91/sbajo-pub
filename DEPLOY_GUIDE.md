# Guida Deploy Vercel - Sbajo Cocktail Bar

## Perché Vercel?

- ✅ **Gratuito**: Piano hobby incluso senza costi
- ✅ **Nativo Next.js**: Creato dai creatori di Next.js
- ✅ **Performance**: Ottimizzazioni automatiche, CDN globale
- ✅ **Auto-deploy**: Per ogni commit su GitHub
- ✅ **HTTPS**: Certificato SSL automatico
- ✅ **Analytics**: Metriche di performance incluse

---

## Step 1: Preparare il Repository GitHub

Se non hai già fatto push del codice:

```bash
git init
git add .
git commit -m "Initial commit: Sbajo App with SEO optimizations"
git remote add origin https://github.com/YOUR_USERNAME/sbajo-fe
git branch -M main
git push -u origin main
```

---

## Step 2: Creare Account Vercel

1. Vai su https://vercel.com
2. Clicca **Sign Up**
3. Scegli **Continue with GitHub** (più facile)
4. Autorizza Vercel ad accedere ai tuoi repository

---

## Step 3: Importare Progetto

1. Una volta loggato, clicca **Add New → Project**
2. Seleziona il repository `sbajo-fe` da GitHub
3. Vercel auto-rileva che è un **Next.js project** ✓

### Configurazione Consigliata:

- **Framework**: Next.js (auto-rilevato)
- **Root Directory**: `./` (main)
- **Build Command**: `next build` (default)
- **Output Directory**: `.next` (default)

### Environment Variables (se necessari):

Se hai variabili d'ambiente (Firebase, API keys, ecc.):

```
NEXT_PUBLIC_FIREBASE_API_KEY=xxxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxx
```

Aggiungi in **Vercel Dashboard → Settings → Environment Variables**

---

## Step 4: Deploy Iniziale

1. Clicca **Deploy**
2. Vercel building... (aspetta ~2-3 minuti)
3. ✅ Deploy completato! Riceverai un URL gratis: `sbajo-fe-xxxx.vercel.app`

---

## Step 5: Collegare Dominio Personalizzato

Se vuoi usare `https://sbajococktailbar.it`:

### Opzione A: Gestire DNS su Vercel (Consigliato)

1. Dashboard Vercel → **Settings → Domains**
2. Aggiungi il tuo dominio
3. Segui la procedura per cambiare nameserver nel registrar

### Opzione B: CNAME/Records (Registrar attuale)

Se preferisci tenere il registrar attuale:

1. In Vercel Settings, vedi i **Nameservers**
2. Nel registrar del dominio, aggiungi un record:
   - **Type**: CNAME
   - **Name**: www (o @)
   - **Value**: cname.vercel.app

---

## Step 6: Auto-Deploy da GitHub

Perfetto! Ogni volta che fai:

```bash
git push
```

Vercel automaticamente:

1. Rileva il push
2. Installa dipendenze
3. Build il progetto
4. Deploy in produzione
5. Ti notifica se va in errore

---

## Monitorare Performance & SEO

### Vercel Analytics

- Dashboard Vercel → **Analytics**
- Vedi Core Web Vitals, pagine più visitate, ecc.

### Google Search Console

1. Vai su https://search.google.com/search-console
2. Aggiungi il dominio `sbajococktailbar.it`
3. Verifica proprietà (scegli il metodo DNS)
4. Sottometti sitemap: `https://sbajococktailbar.it/sitemap.xml`

### Google PageSpeed Insights

Controlla performance:

```
https://pagespeed.web.dev
```

---

## Comandi Utili Locali

```bash
# Development (test locale)
npm run dev

# Build (come fa Vercel)
npm run build

# Avvia server di produzione
npm start

# Lint (controlla errori)
npm run lint
```

---

## Troubleshooting

### Build fallisce

1. Leggi i log in **Vercel Dashboard → Deployments**
2. Controlla che `package.json` abbia tutte le dipendenze
3. Se Firebase: verifica che `serviceAccountKey.json` non sia in `.gitignore`

### 404 sulle pagine dinamiche

- Vercel non ha problemi con Next.js routing
- Se accedi da URL diretto (non tramite Link), usa i canonical URLs

### Immagini non ottimizzate

- ✅ Abbiamo configurato `next.config.ts` per ottimizzare automaticamente
- Vercel le servira in WebP/AVIF

---

## SEO Checkup

✅ Metadata implementati in tutte le pagine
✅ Open Graph e Twitter Cards
✅ JSON-LD schema
✅ Sitemap.xml
✅ Robots.txt
✅ Canonical URLs

Per migliorare ancora:

1. **Google Business Profile**: Aggiungi indirizzo completo e orari
2. **Reviews**: Chiedi ai clienti di lasciare recensioni su Google
3. **Backlinks**: Cita Sbajo su siti locali (Yelp, TripAdvisor, ecc.)
4. **Content**: Scrivi blog post su cocktail, ingredienti, events

---

## Costi Aggiuntivi

**Niente!** 🎉

- Vercel Hobby: **GRATUITO**
- Dominio: ~10-15€/anno (registrar, non Vercel)
- Storage dati Firebase: Piano gratuito incluso

---

## Prossimi Step

1. Deploy oggi su Vercel ✅
2. Collega `sbajococktailbar.it` ✅
3. Aggiungi a Google Search Console
4. Monitora analytics per 1-2 settimane
5. Ottimizza based su dati reali

---

**Hai domande? Leggi:** https://vercel.com/docs

**Buon deploy! 🚀**
