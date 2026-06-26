// --- 3. Pipeline d'Agrégation ---

db.annonces.aggregate([
    // Filtrage avancé (Match)
    { $match: { 
        disponible: true, 
        prix: { $lt: 1000000 },           // Opérateur $lt (plus petit que)
        titre: { $regex: "villa", $options: "i" } // Opérateur $regex
    }},
  
    // Jointure (Lookup)
    { $lookup: {
        from: "quartiers", localField: "quartierId", foreignField: "_id", as: "info_quartier"
    }},
    { $unwind: "$info_quartier" }, // Opérateur $unwind (aplatit le tableau en objet)
  
    // Agrégation et calcul du prix au m² (Group)
    { $group: { 
        _id: "$info_quartier.nom",
        prixMoyenM2: { $avg: { $divide: ["$prix", "$surface"] } }, // Opérateurs $avg et $divide
        total: { $sum: 1 }                                         // Opérateur $sum
    }},
  
    // Tri final
    { $sort: { prixMoyenM2: -1 } },                                // Opérateur $sort
    
    // Pagination dans l'agrégation
    { $skip: 0 },                                                  // Opérateur $skip
    { $limit: 10 }                                                 // Opérateur $limit
  ]);