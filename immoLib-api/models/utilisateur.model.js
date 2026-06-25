// models/utilisateur.model.js
// Acces aux donnees pour la collection "utilisateurs".
const { getDB } = require("../config/db");

function collection() {
  return getDB().collection("utilisateurs");
}

// Cherche un utilisateur par son email (sert a l'inscription ET a la connexion).
async function trouverParEmail(email) {
  return collection().findOne({ email });
}

// Cree un utilisateur. "doc" contient deja le mot de passe HASHE.
async function creer(doc) {
  const resultat = await collection().insertOne(doc);
  return { _id: resultat.insertedId, ...doc };
}

module.exports = { trouverParEmail, creer };
