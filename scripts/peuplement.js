// Nettoyage avant peuplement
db.utilisateurs.drop();
db.quartiers.drop();
db.annonces.drop();

// 1. Peuplement : Création de 10 utilisateurs différents
const utilisateurs = [];
for (let i = 1; i <= 10; i++) {
  const user = {
    "_id": "usr_" + i,
    "nom": "Propriétaire " + i,
    "email": "user" + i + "@immo.ga",
    "telephone": "+241 06 55 55 5" + i,
    "role": "proprietaire",
    "createdAt": new Date()
  };
  utilisateurs.push(user);
  db.utilisateurs.insertOne(user);
}

// 2. Peuplement : Quartiers
const quartiers = ["Akanda", "Owendo", "Okala", "Nzeng-Ayong", "Charbonnages", "Batterie IV", "La Sablière"];
quartiers.forEach((q, index) => {
  db.quartiers.insertOne({
    "_id": "qtr_" + index,
    "nom": q,
    "ville": "Libreville",
    "description": "Zone résidentielle de " + q
  });
});

// 3. Peuplement : 50 Annonces réparties entre les 10 utilisateurs
for (let i = 1; i <= 50; i++) {
  // Attribution aléatoire d'un utilisateur parmi les 10
  const randomUser = utilisateurs[Math.floor(Math.random() * utilisateurs.length)];
  
  // Simulation de photos (URLs factices)
  const photosAnnonce = [
    "https://via.placeholder.com/600x400?text=Bien+" + i + "_1",
    "https://via.placeholder.com/600x400?text=Bien+" + i + "_2"
  ];

  db.annonces.insertOne({
    "_id": "ann_" + i,
    "userId": randomUser._id, // Référence à l'un des utilisateurs créés
    "titre": "Villa de luxe à " + quartiers[i % quartiers.length],
    "description": "Superbe opportunité immobilière à " + quartiers[i % quartiers.length],
    "type": i % 2 === 0 ? "vente" : "location",
    "prix": 50000000 + (i * 1000000),
    "surface": 100 + (i * 5),
    "prix_m2": 500000,
    "nbr_pieces": (i % 5) + 2,
    "quartier": quartiers[i % quartiers.length],
    "photos": photosAnnonce,
    "localisation": { 
      "type": "Point", 
      "coordinates": [9.4 + (i * 0.001), 0.5 + (i * 0.001)] 
    },
    "disponible": true,
    "createdAt": new Date()
  });
}

print("Peuplement terminé : 10 utilisateurs et 50 annonces générées avec succès.");