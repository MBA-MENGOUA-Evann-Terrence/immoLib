// Nettoyage de la base de données
db.utilisateurs.drop();
db.quartiers.drop();
db.annonces.drop();

// 1. Peuplement : Utilisateurs
const nomsUtilisateurs = ["AYONGA Wilda", "MOUSSOUNDA Daniela", "HONDOUM Janvier", "MBA Evann", "BIAKBA Yvette", "NGUEMA Marc", "EYEGHE Stella", "OBIANG Boris", "ABESSOLO Grace", "MBOUMBA Franck"];
const prefixes = ["066", "077", "065", "062", "074"];

db.utilisateurs.insertMany(nomsUtilisateurs.map(nom => {
    const prefixe = prefixes[Math.floor(Math.random() * prefixes.length)];
    const reste = Math.floor(10000 + Math.random() * 90000);
    
    return {
        nom,
        email: nom.toLowerCase().replace(" ", ".") + "@gmail.com",
        telephone: `+241 ${prefixe} ${reste} 55`,
        photo_url: "https://ui-avatars.com/api/?name=" + nom.replace(" ", "+"),
        createdAt: new Date()
    };
}));

// 2. Peuplement : Quartiers
const quartiersData = [
  { nom: "Akanda", desc: "Zone résidentielle en plein essor." },
  { nom: "Glass", desc: "Quartier animé proche du centre-ville." },
  { nom: "Nzeng-Ayong", desc: "Quartier populaire et dynamique." },
];

db.quartiers.insertMany(quartiersData.map(q => ({ 
    nom: q.nom, 
    ville: "Libreville", 
    description: q.desc 
})));

// 3. Peuplement : 50 Annonces
const utilisateurs = db.utilisateurs.find().toArray();
const quartiers = db.quartiers.find().toArray();
const types = ["location", "vente"];
const titres = ["Appartement ", "Villa ", "Studio", "Maison", "Bureau commercial"];

const annoncesData = Array.from({ length: 50 }, (_, i) => {
  const q = quartiers[i % quartiers.length];
  const type = types[i % 2];
  const nbrPieces = (i % 6) + 1;
  


  return {
    userId: utilisateurs[i % utilisateurs.length]._id,
    quartierId: q._id,
    titre: `${titres[i % titres.length]} à ${q.nom}`,
    description: "Bien immobilier moderne et bien situé.",
    type: type,
    prix: type === "location" ? (150000 + (i * 5000)) : (40000000 + (i * 1000000)),
    surface: 40 + (i * 2),
    photos: [`https://picsum.photos/seed/${i}a/400/300`, `https://picsum.photos/seed/${i}b/400/300`],
    localisation: { type: "Point", coordinates: [9.45 + (Math.random() * 0.05), 0.39 + (Math.random() * 0.05)] },
    disponible: true,
    createdAt: new Date()
  };
});

db.annonces.insertMany(annoncesData);

print("Peuplement terminé avec succès : Base de données prête.");