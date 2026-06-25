// scripts/makeAdmin.js
// Promeut un utilisateur en admin (etat = 1) ou le retrograde (etat = 0).
// Usage:
//   node scripts/makeAdmin.js test@immo.ga         -> passe etat a 1 (admin)
//   node scripts/makeAdmin.js test@immo.ga 0        -> passe etat a 0 (utilisateur normal)
require("dotenv").config();
const { connectDB, closeDB } = require("../config/db");

async function run() {
  const email = process.argv[2];
  const etat = process.argv[3] !== undefined ? Number(process.argv[3]) : 1;

  if (!email) {
    console.error("Usage: node scripts/makeAdmin.js <email> [etat 0|1]");
    process.exit(1);
  }

  const db = await connectDB();
  const r = await db
    .collection("utilisateurs")
    .updateOne({ email }, { $set: { etat } });

  if (r.matchedCount === 0) {
    console.log(`Aucun utilisateur avec l'email "${email}".`);
  } else {
    console.log(`Utilisateur "${email}" -> etat = ${etat} (${etat === 1 ? "ADMIN" : "utilisateur normal"}).`);
    console.log("Important: reconnecte-toi pour obtenir un nouveau token avec le bon etat.");
  }

  await closeDB();
}

run().catch((err) => {
  console.error("Erreur:", err.message);
  process.exit(1);
});
