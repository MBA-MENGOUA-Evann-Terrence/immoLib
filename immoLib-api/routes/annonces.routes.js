// routes/annonces.routes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/annonces.controller");
const { authentifier, authOptionnel } = require("../middleware/auth.middleware");

// ATTENTION a l'ordre: les routes specifiques AVANT la route /:id
router.get("/recherche", ctrl.rechercheTexte); // recherche par mots-cles
router.get("/proches", ctrl.annoncesProches);  // recherche geo $near
router.get("/carte", ctrl.getCarte);           // GeoJSON pour Leaflet
router.get("/corbeille", authentifier, ctrl.getCorbeille); // annonces supprimees (soft delete)
router.get("/utilisateur/:userId", ctrl.getAnnoncesUtilisateur); // READ par utilisateur
router.get("/", ctrl.getAnnonces);              // filtres combines (liste)
router.get("/:id", authOptionnel, ctrl.getAnnonceParId);       // detail (findOne)

// Routes protegees par JWT (il faut un token valide)
router.post("/", authentifier, ctrl.creerAnnonce);                    // CREATE
router.post("/:id/contact", authentifier, ctrl.contacterAnnonce);       // message au proprietaire
router.put("/:id/restaurer", authentifier, ctrl.restaurerAnnonce);    // RESTORE (avant /:id)
router.put("/:id", authentifier, ctrl.updateAnnonce);                 // UPDATE
router.delete("/:id", authentifier, ctrl.deleteAnnonce);              // DELETE (soft)

module.exports = router;
