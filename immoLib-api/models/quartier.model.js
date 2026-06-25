// models/quartier.model.js
// Couche d'acces aux donnees pour la collection "quartiers".
const { getDB } = require("../config/db");

function collection() {
  return getDB().collection("quartiers");
}

// Liste de tous les quartiers (db.quartiers.find({}))
async function tous() {
  return collection().find({}).toArray();
}

module.exports = { tous };
