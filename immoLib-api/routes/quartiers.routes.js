// routes/quartiers.routes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/quartiers.controller");

router.get("/prix-moyen-m2", ctrl.prixMoyenM2); // agregation
router.get("/", ctrl.getQuartiers);              // liste des quartiers

module.exports = router;
