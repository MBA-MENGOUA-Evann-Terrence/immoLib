// --- 1. Opérations CRUD ---

// Insérer un utilisateur (Collection: utilisateurs)
db.utilisateurs.insertOne({
    nom: "Jean Dupont",
    email: "jean.dupont@email.com",
    telephone: "066000000",
    createdAt: new Date(),
    etat: 1
  });
  
  // Récupérer l'ID de l'utilisateur et du quartier
  var uId = db.utilisateurs.findOne({ nom: "Jean Dupont" })._id;
  db.quartiers.insertOne({ nom: "Akanda", ville: "Libreville", description: "Zone résidentielle" });
  var qId = db.quartiers.findOne({ nom: "Akanda" })._id;
  
  // Insérer une annonce
  db.annonces.insertMany([{
    titre: "Villa Moderne", description: "Superbe villa", prix: 500000, surface: 200, 
    nbr_pieces: 5, type: "location", disponible: true, supprime: false, 
    localisation: { type: "Point", coordinates: [9.45, 0.39] },
    userId: uId, quartierId: qId, createdAt: new Date(), photos: ["photo1.jpg"]
  }]);
  
  // Update : $set modifie une valeur
  db.annonces.updateOne({ titre: "Villa Moderne" }, { $set: { prix: 550000 } });
  // Update : $push ajoute dans un tableau
  db.annonces.updateOne({ titre: "Villa Moderne" }, { $push: { photos: "photo2.jpg" } });
  // Update : $pull retire d'un tableau
  db.annonces.updateOne({ titre: "Villa Moderne" }, { $pull: { photos: "photo1.jpg" } });
  // Update : $inc incrémente une valeur numérique
  db.annonces.updateMany({ type: "location" }, { $inc: { prix: 10000 } });
  
  // Delete
  db.annonces.deleteOne({ titre: "Villa Moderne" });