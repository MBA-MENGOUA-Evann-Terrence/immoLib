// config/db.js
// Gestion de la connexion unique a MongoDB Atlas (driver natif).
require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "immoLib";

if (!uri) {
  console.error("Erreur: la variable MONGODB_URI est absente du fichier .env");
  process.exit(1);
}

const client = new MongoClient(uri);

let db = null;

// Ouvre la connexion une seule fois et garde l'instance de la base.
async function connectDB() {
  if (db) return db;
  await client.connect();
  db = client.db(dbName);
  console.log(`Connecte a la base "${dbName}" sur Atlas`);
  return db;
}

// Renvoie l'instance de base deja connectee (utilisee par les models).
function getDB() {
  if (!db) {
    throw new Error("La base n'est pas encore connectee. Appelle connectDB() d'abord.");
  }
  return db;
}

async function closeDB() {
  await client.close();
  db = null;
}

module.exports = { connectDB, getDB, closeDB, client };
