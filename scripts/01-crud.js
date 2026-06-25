// 1. CREATE : Insertion de documents
db.annonces.insertOne({
    titre: "Appartement de luxe",
    prix: 50000000,
    details: { chambres: 3, salons: 1, douches: 2, toilettes: 2, cuisines: 1, options: ["parking"] },
    disponible: true
});

db.annonces.insertMany([
    { titre: "Villa", prix: 80000000, details: { chambres: 5, salons: 2, douches: 4, toilettes: 4, cuisines: 1, options: ["piscine", "jardin"] }, disponible: true },
    { titre: "Studio", prix: 150000, details: { chambres: 1, salons: 1, douches: 1, toilettes: 1, cuisines: 1, options: [] }, disponible: true }
]);


// 2. READ : Filtres et Projections
// On cherche les annonces avec au moins 3 chambres et on n'affiche que le titre et le prix
db.annonces.find(
    { "details.chambres": { $gte: 3 } },
    { projection: { titre: 1, prix: 1, _id: 0 } }
);

// 3. UPDATE : Modifications variées
// $set : Mise à jour standard
db.annonces.updateOne({ titre: "Studio" }, { $set: { disponible: false } });

// $inc : Augmentation numérique (ex: augmentation du prix)
db.annonces.updateOne({ titre: "Studio" }, { $inc: { prix: 5000 } });

// $push : Ajouter un élément au tableau options
db.annonces.updateOne({ titre: "Studio" }, { $push: { "details.options": "wifi" } });

// $pull : Retirer un élément du tableau options
db.annonces.updateOne({ titre: "Studio" }, { $pull: { "details.options": "wifi" } });

// updateMany : Modification de plusieurs documents
db.annonces.updateMany({ "details.chambres": { $lt: 2 } }, { $set: { disponible: false } });

// 4. DELETE : Suppressions
db.annonces.deleteOne({ titre: "Appartement de luxe" });
db.annonces.deleteMany({ disponible: false });