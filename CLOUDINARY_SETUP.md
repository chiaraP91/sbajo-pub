# 📸 Setup Upload Immagini Eventi con Cloudinary

## ✅ Cosa Hai Già Fatto

- [x] Cloud Name: `dkoqtcyvi`
- [x] Codice implementato
- [x] Push su GitHub
- [ ] Upload preset configurato (lo fai ora)
- [ ] Variabili aggiunte su Vercel

---

## 🔧 STEP 1: Completa Setup Cloudinary (2 minuti)

### 1.1 Crea Upload Preset

1. Vai su: https://console.cloudinary.com/settings/upload
2. Scroll down → **Upload presets**
3. Clicca **Add upload preset**
4. Configurazione:
   - **Upload preset name**: `sbajo_eventi`
   - **Signing Mode**: **Unsigned** ⚠️ (IMPORTANTE!)
   - **Folder**: `eventi` (opzionale ma consigliato)
   - Nella sezione "Generated public ID":
     - Lascia selezionato **"Auto-generate an unguessable public ID value"** ✅
5. Clicca **Save**

### 1.2 Verifica le Credenziali

Dashboard Cloudinary → https://console.cloudinary.com/

- **Cloud Name**: `dkoqtcyvi` ✅
- **Upload Preset**: `sbajo_eventi` ✅

---

## 🚀 STEP 2: Aggiungi Variabili su Vercel

1. Vai su **Vercel Dashboard**: https://vercel.com
2. Apri il progetto **sbajo-pub**
3. **Settings** → **Environment Variables**
4. Aggiungi queste 2 variabili:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dkoqtcyvi
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=sbajo_eventi
```

Per ognuna:

- **Name**: Nome variabile
- **Value**: Valore
- **Environments**: Seleziona **Production, Preview, Development** (tutte)
- Clicca **Save**

5. Vai su **Deployments** → clicca sul deploy più recente → **Redeploy**

---

## 🎯 Come Funziona Ora

### Flow Upload Immagini:

```
Admin Panel → Carica Immagine → Cloudinary ☁️ → URL Restituito → Salva su Firestore
```

### Flow Visualizzazione Eventi:

```
Pagina Eventi → Legge da Firestore → Mostra Immagine da Cloudinary CDN
```

---

## 📝 Come Usarlo

1. Vai su: `/admin/nuovo` (interfaccia admin)
2. Compila:
   - **Titolo**: "Serata Jazz"
   - **Descrizione**: "Live music con..."
   - **Data e ora**: scegli data evento
   - **Immagine**: clicca "📷 Carica Immagine"
   - **CTA**: "Prenota il tuo posto"
   - **Link**: "/prenota"
3. Clicca **Salva evento**

L'immagine viene:

- ✅ Caricata su Cloudinary (gratis, CDN globale)
- ✅ Ottimizzata automaticamente (WebP/AVIF)
- ✅ L'URL viene salvato su Firestore nel campo `imageUrl`
- ✅ Mostrata nella pagina `/eventi`

---

## 🎁 Vantaggi Cloudinary vs Firebase

| Feature            | Firebase Storage          | Cloudinary                 |
| ------------------ | ------------------------- | -------------------------- |
| **Storage**        | 5GB gratis                | **25GB gratis** ✅         |
| **Bandwidth**      | 1GB/giorno                | **25GB/mese** ✅           |
| **CDN**            | Sì                        | Sì, più veloce ✅          |
| **Ottimizzazione** | Manuale                   | **Automatica** ✅          |
| **Trasformazioni** | No                        | Sì (resize, crop, ecc.) ✅ |
| **Costo**          | Può diventare a pagamento | Completamente gratis ✅    |

---

## 🧪 Test

Dopo il redeploy su Vercel:

1. Vai su `https://tuo-progetto.vercel.app/admin/nuovo`
2. Carica un'immagine di test
3. Se funziona, vedrai:
   - Progress bar durante upload
   - Anteprima immagine
   - URL Cloudinary copiato automaticamente
4. Salva l'evento
5. Vai su `/eventi` e verifica che l'immagine si veda

---

## ❓ Troubleshooting

### "Invalid upload preset"

- ✅ Verifica che l'upload preset sia **Unsigned**
- ✅ Controlla che il nome sia esattamente `sbajo_eventi`
- ✅ Verifica le variabili su Vercel

### "Upload failed"

- ✅ Dimensione immagine max 10MB
- ✅ Formato immagine (JPG, PNG, WebP, ecc.)
- ✅ Connessione internet funzionante

### Non vedo l'immagine su /eventi

- ✅ Controlla che l'evento sia `disponibile: true`
- ✅ Verifica che l'URL sia stato salvato su Firestore
- ✅ Console browser per errori

---

## 🔐 Sicurezza

Le immagini su Cloudinary sono:

- ✅ Pubblicamente accessibili (giusto per un sito web)
- ✅ Protette da upload non autorizzato (solo admin loggato può caricare)
- ✅ Ottimizzate e servite su CDN velocissimo

---

Buon lavoro! 🚀
