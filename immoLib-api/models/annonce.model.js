// models/annonce.model.js
// Couche d'acces aux donnees pour la collection "annonces".
// Chaque fonction reprend EXACTEMENT une de tes requetes testees dans mongosh.
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

function collection() {
  return getDB().collection("annonces");
}

// Resout des noms de quartiers en leurs ObjectId (car les annonces stockent quartierId).
// Sert a reproduire le $in du fichier requetes sur le vrai schema.
async function idsQuartiersParNoms(noms) {
  const docs = await getDB()
    .collection("quartiers")
    .find({ nom: { $in: noms } })
    .project({ _id: 1 })
    .toArray();
  return docs.map((d) => d._id);
}

// --- 1) FILTRES COMBINES + opérateurs avancés du fichier requetes ---
// Regroupe plusieurs de tes requetes:
//   - filtre type / prix {$gte,$lte} / nbr_pieces {$gte}
//   - $in sur quartiers (par nom -> quartierId)
//   - photos: { $exists: true, $not: { $size: 0 } }  (annonces avec photos)
//   - tri (sort), pagination (skip/limit) et comptage (countDocuments)
async function rechercheParFiltres({
  type,
  prixMin,
  prixMax,
  piecesMin,
  quartiers,
  avecPhotos,
  tri,
  page,
  limit,
}) {
  const filtre = { supprime: { $ne: true } }; // soft delete: on ignore les supprimees

  if (type) filtre.type = type;

  if (prixMin !== undefined || prixMax !== undefined) {
    filtre.prix = {};
    if (prixMin !== undefined) filtre.prix.$gte = Number(prixMin);
    if (prixMax !== undefined) filtre.prix.$lte = Number(prixMax);
  }

  if (piecesMin !== undefined) {
    filtre.nbr_pieces = { $gte: Number(piecesMin) };
  }

  // $in sur quartiers (noms separes par des virgules dans l'URL)
  if (quartiers) {
    const noms = String(quartiers).split(",").map((n) => n.trim()).filter(Boolean);
    const ids = await idsQuartiersParNoms(noms);
    filtre.quartierId = { $in: ids };
  }

  // photos existantes et non vides
  if (avecPhotos === "true" || avecPhotos === true) {
    filtre.photos = { $exists: true, $not: { $size: 0 } };
  }

  // Tri: prix_asc | prix_desc | recent
  let sort = {};
  if (tri === "prix_asc") sort = { prix: 1 };
  else if (tri === "prix_desc") sort = { prix: -1 };
  else if (tri === "recent") sort = { createdAt: -1 };

  // Pagination (page commence a 1)
  const limitNum = limit !== undefined ? Number(limit) : 20;
  const pageNum = page !== undefined ? Number(page) : 1;
  const skip = (pageNum - 1) * limitNum;

  const col = collection();
  const total = await col.countDocuments(filtre); // comptage total avant pagination
  const annonces = await col
    .find(filtre)
    .sort(sort)
    .skip(skip)
    .limit(limitNum)
    .toArray();

  return { total, page: pageNum, limit: limitNum, annonces };
}

// --- 2) RECHERCHE TEXTE (index text sur titre + description) ---
// Reprend: db.annonces.find({ $text: { $search: "Studio" } })
// On ajoute le score de pertinence pour trier du plus pertinent au moins pertinent.
async function rechercheTexte(motsCles) {
  return collection()
    .find(
      { $text: { $search: motsCles }, supprime: { $ne: true } },
      { projection: { score: { $meta: "textScore" } } }
    )
    .sort({ score: { $meta: "textScore" } })
    .toArray();
}

// --- 3) RECHERCHE GEOSPATIALE $near (index 2dsphere sur localisation) ---
// Reprend l'esprit de: db.annonces.find({ localisation: { $near: { $geometry, $maxDistance } } })
// rayonKm est converti en metres pour $maxDistance.
async function rechercheProximite(lng, lat, rayonKm) {
  return collection()
    .find({
      localisation: {
        $near: {
          $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
          $maxDistance: Number(rayonKm) * 1000,
        },
      },
      supprime: { $ne: true },
    })
    .toArray();
}

// --- Detail d'une annonce par son _id (READ findOne) ---
// Reprend: db.annonces.findOne({ _id: ... })
async function parId(id) {
  return collection().findOne({ _id: new ObjectId(id), supprime: { $ne: true } });
}

// --- CREATE (insertOne) ---
// Reprend: db.annonces.insertOne({ ... })
// userId vient du token (deja converti en ObjectId par le controller).
async function creer(doc) {
  const resultat = await collection().insertOne(doc);
  return { _id: resultat.insertedId, ...doc };
}

// --- READ: toutes les annonces d'un utilisateur ---
// Reprend: db.annonces.find({ userId: ... })
async function parUtilisateur(userId) {
  return collection()
    .find({ userId: new ObjectId(userId), supprime: { $ne: true } })
    .toArray();
}

// --- UPDATE (updateOne + $set) ---
// Reprend: db.annonces.updateOne({ _id }, { $set: { ... } })
// Un admin (estAdmin) peut modifier n'importe quelle annonce; sinon seulement la sienne.
async function mettreAJour(id, userId, champs, estAdmin) {
  const filtre = estAdmin
    ? { _id: new ObjectId(id) }
    : { _id: new ObjectId(id), userId: new ObjectId(userId) };
  return collection().updateOne(filtre, { $set: champs });
}

// --- SOFT DELETE ---
// On ne supprime PAS physiquement: on pose un drapeau supprime=true (+ deletedAt)
// pour pouvoir restaurer plus tard. Un admin peut supprimer n'importe quelle annonce.
async function supprimer(id, userId, estAdmin) {
  const filtre = estAdmin
    ? { _id: new ObjectId(id) }
    : { _id: new ObjectId(id), userId: new ObjectId(userId) };
  return collection().updateOne(filtre, {
    $set: { supprime: true, deletedAt: new Date() },
  });
}

// --- RESTAURATION (annule le soft delete) ---
async function restaurer(id, userId, estAdmin) {
  const filtre = estAdmin
    ? { _id: new ObjectId(id) }
    : { _id: new ObjectId(id), userId: new ObjectId(userId) };
  return collection().updateOne(filtre, {
    $set: { supprime: false },
    $unset: { deletedAt: "" },
  });
}

// --- CORBEILLE: liste des annonces supprimees ---
// Admin -> toutes les supprimees ; utilisateur -> seulement les siennes.
async function corbeille(userId, estAdmin) {
  const filtre = estAdmin
    ? { supprime: true }
    : { supprime: true, userId: new ObjectId(userId) };
  return collection().find(filtre).toArray();
}

// --- DONNEES POUR LA CARTE (Leaflet) ---
// Renvoie des annonces "legeres" (titre, prix, type, photo, quartier, localisation),
// pretes a etre transformees en GeoJSON par le controller.
// 3 modes:
//   - autour d'une position (lng,lat[,rayonKm]) -> ajoute la distance en metres ($geoNear)
//   - dans une zone visible (bbox = "swLng,swLat,neLng,neLat") -> $geoWithin (perf)
//   - sinon: toutes les annonces non supprimees ayant une localisation
async function pourCarte({ lng, lat, rayonKm, bbox, type } = {}) {
  // On ne montre que les annonces non supprimees et qui ont des coordonnees.
  const query = { supprime: { $ne: true }, localisation: { $exists: true, $ne: null } };
  if (type) query.type = type;

  // Champs renvoyes (legers, pour ne pas surcharger la carte)
  const projection = {
    titre: 1, prix: 1, type: 1, photos: 1, localisation: 1,
    disponible: 1, quartier: "$q.nom",
  };
  const lookupQuartier = [
    { $lookup: { from: "quartiers", localField: "quartierId", foreignField: "_id", as: "q" } },
    { $unwind: { path: "$q", preserveNullAndEmptyArrays: true } },
  ];

  // MODE 1: autour d'une position, avec distance (geoNear doit etre la 1ere etape)
  if (lng !== undefined && lat !== undefined) {
    const geoNear = {
      near: { type: "Point", coordinates: [Number(lng), Number(lat)] },
      distanceField: "distanceM",
      spherical: true,
      query,
    };
    if (rayonKm !== undefined) geoNear.maxDistance = Number(rayonKm) * 1000;
    return collection()
      .aggregate([
        { $geoNear: geoNear },
        ...lookupQuartier,
        { $project: { ...projection, distanceM: 1 } },
      ])
      .toArray();
  }

  // MODE 2: zone visible de la carte (bounding box)
  if (bbox) {
    const [swLng, swLat, neLng, neLat] = String(bbox).split(",").map(Number);
    query.localisation = {
      $geoWithin: {
        $geometry: {
          type: "Polygon",
          coordinates: [[
            [swLng, swLat], [neLng, swLat], [neLng, neLat], [swLng, neLat], [swLng, swLat],
          ]],
        },
      },
    };
  }

  // MODE 2 & 3
  return collection()
    .aggregate([{ $match: query }, ...lookupQuartier, { $project: projection }])
    .toArray();
}

// --- 4) AGREGATION: prix moyen au m2 par quartier (pipeline complet) ---
// Reprend le pipeline du fichier requetes ($match + $lookup + $group + $sort),
// adapte au vrai schema (quartierId + prix/surface).
// Le $match est optionnel: on ne filtre que si type/disponible sont fournis.
async function prixMoyenM2ParQuartier({ type, disponible } = {}) {
  const match = {};
  if (type) match.type = type;
  if (disponible !== undefined) match.disponible = disponible === "true" || disponible === true;

  match.supprime = { $ne: true }; // on exclut les annonces supprimees de l'agregation

  const pipeline = [{ $match: match }];
  pipeline.push(
    {
        $lookup: {
          from: "quartiers",
          localField: "quartierId",
          foreignField: "_id",
          as: "quartier",
        },
      },
      { $unwind: "$quartier" },
      {
        $group: {
          _id: "$quartier.nom",
          prixMoyenM2: { $avg: { $divide: ["$prix", "$surface"] } },
          nombreAnnonces: { $sum: 1 },
        },
      },
      { $sort: { prixMoyenM2: -1 } }
  );

  return collection().aggregate(pipeline).toArray();
}

module.exports = {
  rechercheParFiltres,
  rechercheTexte,
  rechercheProximite,
  parId,
  creer,
  parUtilisateur,
  mettreAJour,
  supprimer,
  restaurer,
  corbeille,
  pourCarte,
  prixMoyenM2ParQuartier,
};
