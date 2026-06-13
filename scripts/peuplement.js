// Nettoyage avant peuplement
db.utilisateurs.drop();
db.quartiers.drop();
db.annonces.drop();

// 1. Peuplement : Utilisateurs (Noms gabonais et ajout de photo_profil)
const nomsUtilisateurs = [
    "AYONGA Wilda", "MOUSSOUNDA Daniela", "HONDOUM Janvier", "MBA Evann", 
    "BIAKBA Yvette", "NGUEMA Marc", "EYEGHE Stella", "OBIANG Boris", 
    "ABESSOLO Grace", "MBOUMBA Franck"
];

const utilisateurs = [];
nomsUtilisateurs.forEach((nom) => {
  const user = {
    "nom": nom,
    "email": nom.toLowerCase().replace(" ", ".") + "@immo.ga",
    "telephone": "+241 06 " + Math.floor(Math.random() * 900000) + " 55",
    "photo_profil": "https://ui-avatars.com/api/?name=" + nom.replace(" ", "+") + "&background=random",
    "createdAt": new Date()
  };
  // Insertion et récupération de l'ID généré automatiquement
  const result = db.utilisateurs.insertOne(user);
  user._id = result.insertedId; 
  utilisateurs.push(user);
});

// 2. Peuplement : Quartiers de Libreville/Akanda
const quartiers = [
  { nom: "Akanda", desc: "Quartier résidentiel calme avec vue sur mer" },
  { nom: "Glass", desc: "Zone historique et commerçante" },
  { nom: "Nzeng-Ayong", desc: "Quartier dynamique et très peuplé" },
  { nom: "Charbonnages", desc: "Zone chic et prisée" },
  { nom: "La Sablière", desc: "Quartier résidentiel haut de gamme" },
  { nom: "Okala", desc: "Zone en pleine expansion" },
  { nom: "Owendo", desc: "Zone industrielle et portuaire" }
];

quartiers.forEach((q) => {
  db.quartiers.insertOne({
    "nom": q.nom,
    "ville": "Libreville",
    "description": q.desc
  });
});

// 3. Peuplement : 50 Annonces avec données diversifiées
const types = ["location", "vente"];
const titres = ["Appartement spacieux", "Villa moderne", "Studio meublé", "Maison de ville", "Bureau commercial"];

for (let i = 1; i <= 50; i++) {
  const randomUser = utilisateurs[Math.floor(Math.random() * utilisateurs.length)];
  const q = quartiers[i % quartiers.length];
  const type = types[i % 2];
  
  const prix = type === "location" ? (150000 + (i * 5000)) : (40000000 + (i * 1000000));
  const surface = 40 + (i * 2);

  // Génération d'URLs de photos aléatoires pour l'annonce
  const photoUrl1 = `https://picsum.photos/seed/${i}a/400/300`;
  const photoUrl2 = `https://picsum.photos/seed/${i}b/400/300`;

  // Insertion sans _id explicite (génération automatique par MongoDB)
  db.annonces.insertOne({
    "userId": randomUser._id, // Référence vers l'ObjectId de l'utilisateur
    "titre": titres[i % titres.length] + " à " + q.nom,
    "description": "Logement idéal situé à " + q.nom + ". " + q.desc + ". Proche de toutes commodités.",
    "type": type,
    "prix": prix,
    "surface": surface,
    "prix_m2": Math.round(prix / surface),
    "nbr_pieces": (i % 6) + 1,
    "quartier": q.nom,
    "photos": [photoUrl1, photoUrl2],
    "localisation": { 
      "type": "Point", 
      "coordinates": [9.45 + (Math.random() * 0.05), 0.39 + (Math.random() * 0.05)] 
    },
    "disponible": true,
    "createdAt": new Date()
  });
}

print("Peuplement terminé : IDs automatiques générés pour 10 utilisateurs et 50 annonces.");