// controllers/quartiers.controller.js
const Quartier = require("../models/quartier.model");
const Annonce = require("../models/annonce.model");

// GET /api/quartiers
async function getQuartiers(req, res) {
  try {
    const resultats = await Quartier.tous();
    res.json({ total: resultats.length, quartiers: resultats });
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
}

// GET /api/quartiers/prix-moyen-m2?type=&disponible=
async function prixMoyenM2(req, res) {
  try {
    const { type, disponible } = req.query;
    const resultats = await Annonce.prixMoyenM2ParQuartier({ type, disponible });
    res.json({ total: resultats.length, statistiques: resultats });
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
}

module.exports = { getQuartiers, prixMoyenM2 };
