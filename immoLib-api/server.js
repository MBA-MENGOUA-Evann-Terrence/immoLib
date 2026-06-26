// server.js
// Point d'entree: connecte la base puis demarre le serveur Express.
require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");

const { connectDB } = require("./config/db");
const { ensureAnnonceIndexes } = require("./config/indexes");
const annoncesRoutes = require("./routes/annonces.routes");
const quartiersRoutes = require("./routes/quartiers.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

// Sert les pages statiques du dossier "public" (ex: la carte Leaflet sur /carte.html)
app.use(express.static(path.join(__dirname, "public")));

// Ajoutez ceci juste AVANT vos routes
app.use((err, req, res, next) => {
  console.error("ERREUR GLOBALE CAPTURÉE :", err);
  res.status(500).json({ 
    message: "Erreur serveur interne", 
    detail: err.message 
  });
});

// Routes de l'API
app.use("/api/auth", authRoutes);
app.use("/api/annonces", annoncesRoutes);
app.use("/api/quartiers", quartiersRoutes);

// Petite route racine pour verifier que l'API tourne
app.get("/", (req, res) => {
  res.json({
    message: "API immoLib operationnelle",
    endpoints: [
      "POST /api/auth/inscription                  (nom, email, telephone, password)",
      "POST /api/auth/connexion                     (email, password)",
      "GET /api/annonces        (filtres: type, prixMin, prixMax, piecesMin, quartiers, avecPhotos, tri, page, limit)",
      "GET /api/annonces/recherche?q=Studio       (recherche texte)",
      "GET /api/annonces/proches?lng=&lat=&rayon= (geo $near)",
      "GET /api/annonces/carte?lng=&lat=&rayon=&bbox=&type=  (GeoJSON pour Leaflet)",
      "GET /api/annonces/utilisateur/:userId       (annonces d'un utilisateur)",
      "GET /api/annonces/corbeille                  (annonces supprimees, token requis)",
      "GET /api/annonces/:id                       (detail)",
      "POST /api/annonces        (CREATE, token requis)",
      "PUT /api/annonces/:id     (UPDATE, token requis; admin = toutes)",
      "PUT /api/annonces/:id/restaurer  (RESTORE soft delete, token requis)",
      "DELETE /api/annonces/:id  (DELETE soft, token requis; admin = toutes)",
      "GET /api/quartiers                          (liste)",
      "GET /api/quartiers/prix-moyen-m2?type=&disponible=  (agregation, $match optionnel)"
    ]
  });
});

// Demarrage: on attend la connexion DB avant d'ecouter
connectDB()
  .then(() => ensureAnnonceIndexes())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Serveur lance sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Impossible de demarrer le serveur:", err.message);
    process.exit(1);
  });
