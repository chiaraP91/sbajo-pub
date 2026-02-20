# 🚀 Guida Deployment su Firebase + Cloud Run + Cloudinary

## Architettura

- **Firebase Hosting**: CDN + reverse proxy verso Cloud Run
- **Google Cloud Run**: Esegue l'app Next.js con SSR e API routes dinamiche
- **Firestore**: Database per menu e eventi
- **Cloudinary**: Storage per le immagini (già configurato)

---

## 📋 Prerequisiti

1. **Firebase CLI** installato:

   ```bash
   npm install -g firebase-tools
   ```

2. **Google Cloud SDK** (opzionale ma consigliato):

   ```bash
   # https://cloud.google.com/sdk/docs/install
   ```

3. **Autenticazione Firebase**:

   ```bash
   firebase login
   ```

4. **Docker** installato (per build locale):
   ```bash
   # https://docs.docker.com/get-docker/
   ```

---

## 🔧 Setup Iniziale

### 1. Installare dipendenze

```bash
npm install
```

### 2. Verificare la build locale

```bash
npm run build
npm start
```

Visita http://localhost:3000 per verificare che tutto funziona.

---

## 📦 Deploy a Firebase + Cloud Run

### Opzione A: Deploy automatico con Firebase CLI (CONSIGLIATO)

```bash
# Assicurati di essere nella directory del progetto
cd sbajo-fe

# Deploy su Firebase Hosting + Cloud Run
firebase deploy
```

Firebase CLI:

- ✅ Riconosce il Dockerfile
- ✅ Build il container Docker
- ✅ Deploy su Cloud Run automaticamente
- ✅ Configura Hosting per reindirizzare tutto a Cloud Run

**Tempo stimato**: 5-10 minuti alla prima volta

---

### Opzione B: Deploy manuale (se Firebase CLI fallisce)

#### Step 1: Build l'immagine Docker

```bash
docker build -t sbajo-nextjs:latest .
```

#### Step 2: Taggare per Google Container Registry

```bash
docker tag sbajo-nextjs:latest gcr.io/sbajopub/sbajo-nextjs:latest
```

#### Step 3: Push a Container Registry

```bash
docker push gcr.io/sbajopub/sbajo-nextjs:latest
```

#### Step 4: Creare Cloud Run Service

```bash
gcloud run deploy sbajo-nextjs \
  --image gcr.io/sbajopub/sbajo-nextjs:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Step 5: Aggiornare firebase.json con l'URL del Cloud Run

Dopo il deploy di Cloud Run, aggiungi l'URL nel campo `run.serviceId`.

---

## 🌍 Variabili di Ambiente

### Aggiungerle a Cloud Run

```bash
# Firebase Config (client-side, public)
gcloud run services update sbajo-nextjs \
  --set-env-vars=\
NEXT_PUBLIC_FIREBASE_API_KEY=xxx,\
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx,\
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sbajopub,\
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx,\
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx,\
NEXT_PUBLIC_FIREBASE_APP_ID=xxx,\
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dkoqtcyvi,\
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=sbajo_eventi

# Firebase Admin (server-side, secret)
gcloud run services update sbajo-nextjs \
  --set-env-vars=\
FIREBASE_PROJECT_ID=sbajopub,\
FIREBASE_CLIENT_EMAIL=xxx@xxx.iam.gserviceaccount.com,\
FIREBASE_PRIVATE_KEY=<chiave-privata>
```

Oppure aggiungerle via Google Cloud Console:

1. Vai a https://console.cloud.google.com/run
2. Seleziona il servizio `sbajo-nextjs`
3. Clicca "Edit & Deploy"
4. Scorri a "Environment variables"
5. Aggiungi le variabili

---

## ✅ Verifica Deployment

Dopo il deploy:

```bash
# Ottenere l'URL pubblico
firebase hosting:channel:list

# O via Cloud Run
gcloud run services describe sbajo-nextjs --region us-central1
```

Visita il link e verifica:

- ✅ Homepage carica
- ✅ `/eventi` mostra gli eventi
- ✅ `/admin/login-page` permette login
- ✅ `/admin/nuovo` permette creare evento
- ✅ Cloudinary uploader funziona
- ✅ API routes rispondono

---

## 🔄 Aggiornamenti Futuri

Per deployare nuove versioni:

```bash
# Opzione rapida
firebase deploy

# Opzione manuale (rebuild)
npm run build
docker build -t sbajo-nextjs:latest .
docker tag sbajo-nextjs:latest gcr.io/sbajopub/sbajo-nextjs:latest
docker push gcr.io/sbajopub/sbajo-nextjs:latest
```

---

## 🐛 Troubleshooting

### Cloud Run timeout

Se le richieste timeout (>9 minuti), aumenta il timeout:

```bash
gcloud run services update sbajo-nextjs \
  --timeout 3600 \
  --region us-central1
```

### Errori di build Docker

Assicurati che:

- ✅ Il file .dockerignore non esclude file essenziali
- ✅ Il Dockerfile usa la variabile `PORT` correttamente
- ✅ `npm run build` funziona localmente

### Firestore rules

Se le API responses falliscono:

- Controlla `firestore.rules` su Firebase Console
- Assicurati che Cloud Run abbia accesso (usa Firebase Admin SDK)

### Variabili di ambiente non caricate

- Verifica con: `gcloud run services describe sbajo-nextjs`
- Se mancano, aggiungile di nuovo
- Aspetta 30 secondi prima di testare

---

## 📊 Costi Stimati

**Tier gratuito incluye**:

- Firebase Hosting: 1GB storage, 10GB bandwidth/mese
- Cloud Run: 2M richieste/mese, 360K GB-secondi/mese
- Firestore: 50K read, 20K write, 1GB storage/giorno
- Cloudinary: 25GB storage, CDN illimitato

**Per un'app small-medium**: Probabilmente rimarrai sempre nel tier gratuito ✅

---

## 🎯 Cosa è Cambiato

### Prima (Vercel)

```
Vercel Hosting → Next.js + API Routes σr tutto
```

### Dopo (Firebase)

```
Firebase Hosting (CDN) → Cloud Run (Next.js server) → API Routes
                      ↓
         Firestore (database) + Cloudinary (images)
```

**Vantaggi**:

- ✅ Tutto su Google Cloud (integrazione nativa)
- ✅ Stessa banca dati Firestore
- ✅ Cloudinary per immagini (cost-effective)
- ✅ Scale automatico con Cloud Run
- ✅ Tier gratuito generoso

---

## 📞 Supporto

Se hai problemi:

1. Controlla i log di Cloud Run:

   ```bash
   gcloud run services logs read sbajo-nextjs --region us-central1 --limit 50
   ```

2. Controlla firebase.json è corretto
3. Verifica le variabili di ambiente sono settate
4. Prova `firebase serve` localmente per simulare il deployment

---

**Good luck! 🚀**
