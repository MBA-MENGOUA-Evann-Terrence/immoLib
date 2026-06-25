// routes/auth.routes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/auth.controller");

router.post("/inscription", ctrl.inscription); // creer un compte
router.post("/connexion", ctrl.connexion);      // se connecter

module.exports = router;
