// config/db.js
// Gestion de la connexion unique a MongoDB Atlas (driver natif).
require("dotenv").config();
const { MongoClient } = require("mongodb");

const dbName = process.env.DB_NAME || "immoLib";
const SHARD_TIMEOUT_MS = 20000;

/**
 * @param {string} credentials
 * @param {string} host
 */
function buildDirectUri(credentials, host) {
  const base = host.includes(":") ? host : `${host}:27017`;
  return `mongodb://${credentials}@${base}/${dbName}?ssl=true&authSource=admin&directConnection=true&retryWrites=true&w=majority`;
}

/** @param {string} uri */
function extractCredentials(uri) {
  const match = uri.match(/\/\/([^@]+)@/);
  if (!match) throw new Error("URI MongoDB invalide : identifiants introuvables");
  return match[1];
}

/**
 * Teste tous les shards en parallele et retourne l'URI du primaire.
 * @param {string} credentials
 * @param {string[]} hosts
 */
async function resolvePrimaryUri(credentials, hosts) {
  const probes = await Promise.all(
    hosts.map(async (host) => {
      const uri = buildDirectUri(credentials, host);
      const probe = new MongoClient(uri, { serverSelectionTimeoutMS: SHARD_TIMEOUT_MS });
      try {
        await probe.connect();
        const hello = await probe.db("admin").command({ hello: 1 });
        await probe.close();
        return { uri, host, isPrimary: Boolean(hello.isWritablePrimary) };
      } catch (err) {
        await probe.close().catch(() => {});
        console.warn(`  - ${host} : ${err.message}`);
        return null;
      }
    })
  );

  const primary = probes.find((p) => p?.isPrimary);
  if (primary) {
    console.log(`Noeud primaire trouve : ${primary.host}`);
    return primary.uri;
  }

  throw new Error(
    "Aucun noeud primaire MongoDB accessible. Verifiez MONGODB_SHARD_HOSTS ou definissez MONGODB_URI_DIRECT."
  );
}

async function resolveMongoUri() {
  if (process.env.MONGODB_URI_DIRECT) {
    return process.env.MONGODB_URI_DIRECT;
  }

  const srvUri = process.env.MONGODB_URI;
  if (!srvUri) {
    throw new Error("MONGODB_URI (ou MONGODB_URI_DIRECT) absent du fichier .env");
  }

  const shardHosts = process.env.MONGODB_SHARD_HOSTS;
  if (srvUri.startsWith("mongodb+srv://") && shardHosts) {
    const credentials = extractCredentials(srvUri);
    const hosts = shardHosts.split(",").map((h) => h.trim()).filter(Boolean);
    console.log("Recherche du noeud primaire MongoDB...");
    return resolvePrimaryUri(credentials, hosts);
  }

  return srvUri;
}

let client = null;
let db = null;

async function connectDB() {
  if (db) return db;

  const uri = await resolveMongoUri();

  if (uri.startsWith("mongodb+srv://")) {
    console.warn(
      "Attention: mongodb+srv:// peut echouer sous Node.js/Windows (querySrv ECONNREFUSED)."
    );
  }

  client = new MongoClient(uri, { serverSelectionTimeoutMS: SHARD_TIMEOUT_MS });

  try {
    await client.connect();
  } catch (err) {
    if (err.message?.includes("querySrv") && !process.env.MONGODB_URI_DIRECT) {
      throw new Error(
        `${err.message}\n→ Definissez MONGODB_URI_DIRECT ou MONGODB_SHARD_HOSTS dans .env.`
      );
    }
    throw err;
  }

  if (uri.includes("directConnection=true")) {
    const hello = await client.db("admin").command({ hello: 1 });
    if (!hello.isWritablePrimary) {
      throw new Error(
        "Connexion MongoDB sur un noeud secondaire. Mettez a jour MONGODB_URI_DIRECT vers le shard primaire."
      );
    }
  }

  db = client.db(dbName);
  console.log(`Connecte a la base "${dbName}" sur Atlas`);
  return db;
}

function getDB() {
  if (!db) {
    throw new Error("La base n'est pas encore connectee. Appelle connectDB() d'abord.");
  }
  return db;
}

async function closeDB() {
  if (client) {
    await client.close();
    client = null;
  }
  db = null;
}

module.exports = { connectDB, getDB, closeDB, get client() { return client; } };
