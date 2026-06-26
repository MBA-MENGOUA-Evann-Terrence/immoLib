// controllers/annonces.controller.js
// Recoit les requetes HTTP, appelle le model, renvoie le JSON.
const { ObjectId } = require("mongodb");
const Annonce = require("../models/annonce.model");
const Utilisateur = require("../models/utilisateur.model");
const Message = require("../models/message.model");

// GET /api/annonces?type=&prixMin=&prixMax=&piecesMin=&quartiers=&avecPhotos=&tri=&page=&limit=
async function getAnnonces(req, res) {
  try {
    const { type, prixMin, prixMax, piecesMin, quartiers, avecPhotos, tri, page, limit } = req.query;
    const resultat = await Annonce.rechercheParFiltres({
      type, prixMin, prixMax, piecesMin, quartiers, avecPhotos, tri, page, limit,
    });
    res.json(resultat); // { total, page, limit, annonces }
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
}

// GET /api/annonces/recherche?q=Studio
async function rechercheTexte(req, res) {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ erreur: "Parametre 'q' requis (mots-cles)." });
    const resultats = await Annonce.rechercheTexte(q);
    res.json({ total: resultats.length, annonces: resultats });
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
}

// GET /api/annonces/proches?lng=&lat=&rayon=
async function annoncesProches(req, res) {
  try {
    const { lng, lat, rayon } = req.query;
    if (lng === undefined || lat === undefined) {
      return res.status(400).json({ erreur: "Parametres 'lng' et 'lat' requis." });
    }
    const rayonKm = rayon !== undefined ? rayon : 5; // 5 km par defaut
    const resultats = await Annonce.rechercheProximite(lng, lat, rayonKm);
    res.json({ centre: { lng: Number(lng), lat: Number(lat) }, rayonKm: Number(rayonKm), total: resultats.length, annonces: resultats });
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
}

// GET /api/annonces/:id
async function getAnnonceParId(req, res) {
  try {
    const annonce = await Annonce.parId(req.params.id);
    if (!annonce) return res.status(404).json({ erreur: "Annonce introuvable." });

    let auteur = null;
    if (annonce.userId) {
      const utilisateur = await Utilisateur.trouverParId(annonce.userId);
      if (utilisateur) {
        auteur = {
          _id: utilisateur._id,
          nom: utilisateur.nom,
          email: utilisateur.email,
          telephone: utilisateur.telephone ?? null,
          photo_profil: utilisateur.photo_profil ?? null,
        };
      }
    }

    res.json({ ...annonce, auteur });
  } catch (err) {
    res.status(400).json({ erreur: "Identifiant invalide." });
  }
}

// POST /api/annonces/:id/contact
async function contacterAnnonce(req, res) {
  try {
    const { nom, email, telephone, message } = req.body;

    if (!nom || !email || !message) {
      return res.status(400).json({ erreur: "Champs requis: nom, email, message." });
    }

    const annonce = await Annonce.parId(req.params.id);
    if (!annonce) return res.status(404).json({ erreur: "Annonce introuvable." });
    if (!annonce.userId) {
      return res.status(400).json({ erreur: "Cette annonce n'a pas de proprietaire associe." });
    }

    const doc = {
      annonceId: new ObjectId(req.params.id),
      destinataireId: new ObjectId(annonce.userId),
      expediteur: {
        nom: String(nom).trim(),
        email: String(email).trim(),
        telephone: telephone ? String(telephone).trim() : null,
      },
      message: String(message).trim(),
      lu: false,
      createdAt: new Date(),
    };

    await Message.creer(doc);
    res.status(201).json({ message: "Votre message a ete envoye au proprietaire." });
  } catch (err) {
    res.status(400).json({ erreur: err.message });
  }
}

// --- CREATE: POST /api/annonces (protege par JWT) ---
// userId est pris dans le token (req.userId), jamais dans le body.
async function creerAnnonce(req, res) {
  try {
    const b = req.body;
    if (!b.titre || !b.type || b.prix === undefined) {
      return res.status(400).json({ erreur: "Champs requis: titre, type, prix." });
    }

    const doc = {
      userId: new ObjectId(req.userId),
      titre: b.titre,
      description: b.description || "",
      type: b.type,
      prix: Number(b.prix),
      surface: b.surface !== undefined ? Number(b.surface) : null,
      nbr_pieces: b.nbr_pieces !== undefined ? Number(b.nbr_pieces) : null,
      photos: Array.isArray(b.photos) ? b.photos : [],
      localisation: b.localisation || null,
      disponible: b.disponible !== undefined ? b.disponible : true,
      createdAt: new Date(),
    };
    // Lien vers le quartier (le vrai schema utilise quartierId)
    if (b.quartierId) doc.quartierId = new ObjectId(b.quartierId);

    const cree = await Annonce.creer(doc);
    res.status(201).json({ message: "Annonce creee", annonce: cree });
  } catch (err) {
    res.status(400).json({ erreur: err.message });
  }
}

// --- READ: GET /api/annonces/utilisateur/:userId ---
async function getAnnoncesUtilisateur(req, res) {
  try {
    const resultats = await Annonce.parUtilisateur(req.params.userId);
    res.json({ total: resultats.length, annonces: resultats });
  } catch (err) {
    res.status(400).json({ erreur: "Identifiant utilisateur invalide." });
  }
}

// --- UPDATE: PUT /api/annonces/:id (protege, proprietaire uniquement) ---
async function updateAnnonce(req, res) {
  try {
    // On n'autorise la modification que de certains champs
    const autorises = ["titre", "description", "type", "prix", "surface", "nbr_pieces", "photos", "localisation", "disponible", "quartierId"];
    const champs = {};
    for (const cle of autorises) {
      if (req.body[cle] !== undefined) champs[cle] = req.body[cle];
    }
    if (champs.quartierId) champs.quartierId = new ObjectId(champs.quartierId);
    if (Object.keys(champs).length === 0) {
      return res.status(400).json({ erreur: "Aucun champ a mettre a jour." });
    }

    const r = await Annonce.mettreAJour(req.params.id, req.userId, champs, req.estAdmin);
    if (r.matchedCount === 0) {
      return res.status(404).json({ erreur: "Annonce introuvable ou tu n'en es pas le proprietaire." });
    }
    res.json({ message: "Annonce mise a jour", modifie: r.modifiedCount });
  } catch (err) {
    res.status(400).json({ erreur: err.message });
  }
}

// --- DELETE (soft): DELETE /api/annonces/:id (protege) ---
// Ne supprime pas physiquement: pose supprime=true. Admin peut supprimer n'importe laquelle.
async function deleteAnnonce(req, res) {
  try {
    const r = await Annonce.supprimer(req.params.id, req.userId, req.estAdmin);
    if (r.matchedCount === 0) {
      return res.status(404).json({ erreur: "Annonce introuvable ou tu n'en es pas le proprietaire." });
    }
    res.json({ message: "Annonce supprimee (soft delete, restaurable)" });
  } catch (err) {
    res.status(400).json({ erreur: err.message });
  }
}

// --- RESTORE: PUT /api/annonces/:id/restaurer (protege) ---
async function restaurerAnnonce(req, res) {
  try {
    const r = await Annonce.restaurer(req.params.id, req.userId, req.estAdmin);
    if (r.matchedCount === 0) {
      return res.status(404).json({ erreur: "Annonce introuvable ou tu n'en es pas le proprietaire." });
    }
    res.json({ message: "Annonce restauree", restaure: r.modifiedCount });
  } catch (err) {
    res.status(400).json({ erreur: err.message });
  }
}

// --- CORBEILLE: GET /api/annonces/corbeille (protege) ---
// Admin voit toutes les supprimees; un utilisateur voit seulement les siennes.
async function getCorbeille(req, res) {
  try {
    const resultats = await Annonce.corbeille(req.userId, req.estAdmin);
    res.json({ total: resultats.length, annonces: resultats });
  } catch (err) {
    res.status(400).json({ erreur: err.message });
  }
}

// --- CARTE: GET /api/annonces/carte ---
// Renvoie une FeatureCollection GeoJSON directement consommable par Leaflet (L.geoJSON).
// Params optionnels:
//   - lng,lat (+ rayon en km)   -> autour de la position de l'utilisateur, avec distance
//   - bbox=swLng,swLat,neLng,neLat -> uniquement la zone visible de la carte (perf)
//   - type                       -> filtre location/vente
async function getCarte(req, res) {
  try {
    const { lng, lat, rayon, bbox, type } = req.query;
    const docs = await Annonce.pourCarte({ lng, lat, rayonKm: rayon, bbox, type });

    const features = docs.map((d) => ({
      type: "Feature",
      geometry: d.localisation, // GeoJSON Point: { type: "Point", coordinates: [lng, lat] }
      properties: {
        id: d._id,
        titre: d.titre,
        prix: d.prix,
        type: d.type,
        quartier: d.quartier || null,
        photo: Array.isArray(d.photos) && d.photos.length ? d.photos[0] : null,
        disponible: d.disponible,
        ...(d.distanceM !== undefined ? { distanceM: Math.round(d.distanceM) } : {}),
      },
    }));

    res.json({ type: "FeatureCollection", features });
  } catch (err) {
    res.status(400).json({ erreur: err.message });
  }
}

module.exports = {
  getAnnonces,
  rechercheTexte,
  annoncesProches,
  getCarte,
  getAnnonceParId,
  contacterAnnonce,
  creerAnnonce,
  getAnnoncesUtilisateur,
  updateAnnonce,
  deleteAnnonce,
  restaurerAnnonce,
  getCorbeille,
};
