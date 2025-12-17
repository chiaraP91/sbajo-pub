import fs from "fs";
import admin from "firebase-admin";

// 🔐 carica la chiave service account (solo locale!)
const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8")
);

// 🔥 init Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// 📦 carica JSON
const items = JSON.parse(
  fs.readFileSync("./scripts/seed-menu-drink.json", "utf8")
);

async function run() {
  console.log(`Importo ${items.length} elementi in menu-drink…`);

  for (const item of items) {
    const docId = String(item.numericId); // id = numericId
    await db.collection("menu-drink").doc(docId).set(item);
    console.log(`✔ inserito ${item.name} (#${docId})`);
  }

  console.log("✅ Import completato");
}

run().catch(console.error);
