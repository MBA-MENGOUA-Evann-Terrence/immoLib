// config/indexes.js
// Crée les index MongoDB manquants au démarrage (texte + géospatial).
const { getDB } = require("./db");

async function ensureAnnonceIndexes() {
  const annonces = getDB().collection("annonces");
  const existants = await annonces.indexes();

  const aIndexText = existants.some((i) => Object.values(i.key).includes("text"));
  const aIndex2dsphere = existants.some((i) =>
    Object.values(i.key).includes("2dsphere")
  );

  if (!aIndexText) {
    const nom = await annonces.createIndex(
      { titre: "text", description: "text" },
      { default_language: "french", name: "titre_description_text" }
    );
    console.log(`[indexes] Index text créé : ${nom}`);
  } else {
    console.log("[indexes] Index text déjà présent.");
  }

  if (!aIndex2dsphere) {
    const nom = await annonces.createIndex(
      { localisation: "2dsphere" },
      { name: "localisation_2dsphere" }
    );
    console.log(`[indexes] Index 2dsphere créé : ${nom}`);
  } else {
    console.log("[indexes] Index 2dsphere déjà présent.");
  }
}

module.exports = { ensureAnnonceIndexes };
