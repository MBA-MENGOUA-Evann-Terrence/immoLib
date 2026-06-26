// scripts/createIndexes.js
// Verifie les index existants sur "annonces" puis cree ceux qui manquent:
//   - index text sur titre + description (recherche plein-texte)
//   - index 2dsphere sur localisation (recherche geospatiale $near)
// Lance avec: npm run indexes
require("dotenv").config();
const { connectDB, closeDB } = require("../config/db");

async function run() {
  const db = await connectDB();
  const annonces = db.collection("annonces");

  // 1) On liste d'abord les index actuels (ta question: le 2dsphere existe-t-il ?)
  const existants = await annonces.indexes();
  console.log("\n=== Index actuels sur 'annonces' ===");
  existants.forEach((idx) => {
    console.log(`- ${idx.name} : ${JSON.stringify(idx.key)}`);
  });

  const aIndexText = existants.some((i) =>
    Object.values(i.key).includes("text")
  );
  const aIndex2dsphere = existants.some((i) =>
    Object.values(i.key).includes("2dsphere")
  );

  // 2) Index text (equivaut a: db.annonces.createIndex({ titre: "text", description: "text" }))
  if (aIndexText) {
    console.log("\n[OK] Un index 'text' existe deja.");
  } else {
    const nom = await annonces.createIndex(
      { titre: "text", description: "text" },
      { default_language: "french", name: "titre_description_text" }
    );
    console.log(`\n[CREE] Index text -> ${nom}`);
  }

  // 3) Index 2dsphere (equivaut a: db.annonces.createIndex({ localisation: "2dsphere" }))
  if (aIndex2dsphere) {
    console.log("[OK] Un index '2dsphere' existe deja sur 'localisation'.");
  } else {
    const nom = await annonces.createIndex({ localisation: "2dsphere" });
    console.log(`[CREE] Index 2dsphere -> ${nom}`);
  }

  console.log("\nTermine.");
  await closeDB();
}

run().catch((err) => {
  console.error("Erreur lors de la creation des index:", err.message);
  process.exit(1);
});
