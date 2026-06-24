use("immoLib");

const annonces = db.annonces;

/* =========================
   CREATE
   ========================= */

// Insérer un document
const insertOneResult = annonces.insertOne({
  userId: ObjectId("64f000000000000000000001"),
  titre: "Appartement moderne à louer",
  description: "Bel appartement spacieux avec balcon et parking.",
  type: "location",
  prix: 350000,
  surface: 80,
  prix_m2: 4375,
  nbr_pieces: 3,
  quartier: "Bonapriso",
  photos: [
    "photo1.jpg",
    "photo2.jpg"
  ],
  localisation: {
    type: "Point",
    coordinates: [9.7000, 4.0500]
  },
  disponible: true,
  createdAt: new Date()
});

print("insertOne:");
printjson(insertOneResult);

// Insérer plusieurs documents
const insertManyResult = annonces.insertMany([
  {
    userId: ObjectId("64f000000000000000000001"),
    titre: "Studio à vendre",
    description: "Studio lumineux bien situé.",
    type: "vente",
    prix: 120000,
    surface: 30,
    prix_m2: 4000,
    nbr_pieces: 1,
    quartier: "Akwa",
    photos: ["studio1.jpg"],
    localisation: {
      type: "Point",
      coordinates: [9.7100, 4.0600]
    },
    disponible: true,
    createdAt: new Date()
  },
  {
    userId: ObjectId("64f000000000000000000002"),
    titre: "Maison familiale",
    description: "Grande maison avec jardin.",
    type: "vente",
    prix: 500000,
    surface: 200,
    prix_m2: 2500,
    nbr_pieces: 6,
    quartier: "Bonamoussadi",
    photos: ["maison1.jpg", "maison2.jpg"],
    localisation: {
      type: "Point",
      coordinates: [9.6800, 4.0700]
    },
    disponible: false,
    createdAt: new Date()
  }
]);

print("insertMany:");
printjson(insertManyResult);

/* =========================
   READ
   ========================= */

// Lire tous les documents
print("\nTous les documents de annonces:");
printjson(annonces.find().toArray());

// Lire un document précis
print("\nUne annonce par titre:");
printjson(
  annonces.findOne({ titre: "Appartement moderne à louer" })
);

// Lire plusieurs documents avec filtre
print("\nAnnonces à Bonapriso:");
printjson(
  annonces.find({ quartier: "Bonapriso" }).toArray()
);

// Lire avec projection
print("\nAnnonces disponibles avec projection:");
printjson(
  annonces.find(
    { disponible: true },
    { _id: 0, titre: 1, prix: 1, quartier: 1, type: 1, surface: 1 }
  ).toArray()
);

// Lire avec tri
print("\nAnnonces triées par prix croissant:");
printjson(
  annonces.find(
    {},
    { _id: 0, titre: 1, prix: 1, quartier: 1 }
  ).sort({ prix: 1 }).toArray()
);

/* =========================
   UPDATE
   ========================= */

// Modifier un document
const updateOneResult = annonces.updateOne(
  { titre: "Appartement moderne à louer" },
  {
    $set: {
      prix: 375000,
      description: "Bel appartement spacieux avec balcon, parking et sécurité 24h/24.",
      disponible: true
    }
  }
);

print("\nupdateOne:");
printjson(updateOneResult);

// Modifier plusieurs documents
const updateManyResult = annonces.updateMany(
  { type: "location" },
  {
    $set: {
      disponible: true
    }
  }
);

print("\nupdateMany:");
printjson(updateManyResult);

// Mettre à jour des champs spécifiques
const updateFieldsResult = annonces.updateOne(
  { titre: "Studio à vendre" },
  {
    $set: {
      nbr_pieces: 2,
      surface: 35,
      prix_m2: 3428
    }
  }
);

print("\nupdate fields:");
printjson(updateFieldsResult);

// Augmenter le prix de toutes les annonces de Bonapriso de 10%
const increasePriceResult = annonces.updateMany(
  { quartier: "Bonapriso" },
  {
    $mul: {
      prix: 1.1
    }
  }
);

print("\nAugmentation des prix à Bonapriso:");
printjson(increasePriceResult);

/* =========================
   DELETE
   ========================= */

// Supprimer un document
const deleteOneResult = annonces.deleteOne({
  titre: "Maison familiale"
});

print("\ndeleteOne:");
printjson(deleteOneResult);

// Supprimer plusieurs documents
const deleteManyResult = annonces.deleteMany({
  disponible: false
});

print("\ndeleteMany:");
printjson(deleteManyResult);

/* =========================
   QUERIES UTILES
   ========================= */

// Prix supérieur à 200000
print("\nAnnonces avec prix > 200000:");
printjson(
  annonces.find({ prix: { $gt: 200000 } }).toArray()
);

// Au moins 3 pièces
print("\nAnnonces avec au moins 3 pièces:");
printjson(
  annonces.find({ nbr_pieces: { $gte: 3 } }).toArray()
);

// Nombre total d'annonces disponibles
print("\nNombre total d'annonces disponibles:");
print(
  annonces.countDocuments({ disponible: true })
);

// Regrouper par quartier
print("\nNombre d'annonces par quartier:");
printjson(
  annonces.aggregate([
    {
      $group: {
        _id: "$quartier",
        total: { $sum: 1 }
      }
    },
    {
      $sort: { total: -1 }
    }
  ]).toArray()
);
