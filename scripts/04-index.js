// --- 4. Indexation et Performance ---

// 1. Stratégie d'indexation (Optimisation)
// Justification : Création d'un index textuel pour permettre une recherche par mots-clés performante 
// dans le titre et la description, évitant un parcours complet de la collection (COLLSCAN).
db.annonces.createIndex({ titre: "text", description: "text" }); 

// Justification : L'index 2dsphere est indispensable pour supporter les requêtes géospatiales 
// et offrir des fonctionnalités de proximité (biens autour de l'utilisateur).
db.annonces.createIndex({ localisation: "2dsphere" }); 

// Justification : Index composé sur les trois critères de filtrage les plus fréquents de l'application 
// (type, prix, nombre de pièces) pour garantir une réponse quasi instantanée sur les recherches complexes.
db.annonces.createIndex({ type: 1, prix: 1, nbr_pieces: 1 }); 

// 2. Analyse des performances (Preuve d'optimisation)
// Justification : Utilisation de explain('executionStats') pour démontrer au jury que l'index réduit 
// drastiquement le nombre de documents examinés (totalDocsExamined) lors d'une requête de filtrage.
db.annonces.find({ type: "location", prix: { $lt: 500000 } }).explain('executionStats');

// 3. Recherche par mots-clés (Usage métier)
// Justification : Requête utilisant l'index textuel pour trouver rapidement des annonces 
// correspondant à une recherche intuitive utilisateur ("villa luxe").
db.annonces.find({ $text: { $search: "villa luxe" } });

// 4. Requête géospatiale (Fonctionnalité avancée)
// Justification : Utilisation de l'opérateur $near avec $geometry pour limiter la recherche 
// à un rayon de 5km, illustrant la valeur ajoutée de l'indexation géospatiale pour la mobilité.
db.annonces.find({
  localisation: {
    $near: {
      $geometry: { type: "Point", coordinates: [9.45, 0.39] },
      $maxDistance: 5000 
    }
  }
});