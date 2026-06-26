// --- 2. Requêtes Avancées ---

// Filtres combinés : type, prix ($gte/$lte), pièces ($gt), tri ($sort)
db.annonces.find({
    type: "location",
    prix: { $gte: 200000, $lte: 800000 }, // Opérateur $gte (>=) et $lte (<=)
    nbr_pieces: { $gt: 3 }               // Opérateur $gt (>)
  }).sort({ prix: -1 });                 // Opérateur $sort (Tri descendant)
  
  // Recherche avec $in et Regex
  db.annonces.find({
    type: { $in: ["location", "vente"] }, // Opérateur $in (liste de valeurs)
    titre: { $regex: "villa", $options: "i" } // Opérateur $regex (expression régulière)
  });
  
  // Pagination : skip() et limit()
  var page = 1;
  var limit = 5;
  db.annonces.find({}).skip((page - 1) * limit).limit(limit); // Opérateurs de pagination