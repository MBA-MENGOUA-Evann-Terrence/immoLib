// controllers/auth.controller.js
// Gestion de l'inscription et de la connexion.
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Utilisateur = require("../models/utilisateur.model");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/jwt");

// Retire le mot de passe avant de renvoyer un utilisateur au client.
function sansMotDePasse(user) {
  const { password, ...reste } = user;
  return reste;
}

// Cree un token JWT signe contenant l'id et l'email de l'utilisateur.
function genererToken(user) {
  return jwt.sign(
    { id: user._id.toString(), email: user.email, etat: user.etat || 0 },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// POST /api/auth/inscription
// Body attendu: { nom, email, telephone, password }
async function inscription(req, res) {
  try {
    const { nom, email, telephone, password } = req.body;

    if (!nom || !email || !password) {
      return res.status(400).json({ erreur: "Champs requis: nom, email, password." });
    }

    // Email unique
    const existant = await Utilisateur.trouverParEmail(email);
    if (existant) {
      return res.status(409).json({ erreur: "Un compte existe deja avec cet email." });
    }

    // Hash du mot de passe (jamais stocke en clair)
    const hash = await bcrypt.hash(password, 10);

    const nouvelUtilisateur = {
      nom,
      email,
      telephone: telephone || null,
      password: hash,
      etat: 0, // 0 = utilisateur normal, 1 = admin
      photo_profil: `https://ui-avatars.com/api/?name=${encodeURIComponent(nom)}&background=random`,
      createdAt: new Date(),
    };

    const cree = await Utilisateur.creer(nouvelUtilisateur);
    const token = genererToken(cree);
    res.status(201).json({ message: "Inscription reussie", token, utilisateur: sansMotDePasse(cree) });
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
}

// POST /api/auth/connexion
// Body attendu: { email, password }
async function connexion(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ erreur: "Champs requis: email, password." });
    }

    const utilisateur = await Utilisateur.trouverParEmail(email);
    if (!utilisateur || !utilisateur.password) {
      return res.status(401).json({ erreur: "Email ou mot de passe incorrect." });
    }

    const motDePasseOk = await bcrypt.compare(password, utilisateur.password);
    if (!motDePasseOk) {
      return res.status(401).json({ erreur: "Email ou mot de passe incorrect." });
    }

    const token = genererToken(utilisateur);
    res.json({ message: "Connexion reussie", token, utilisateur: sansMotDePasse(utilisateur) });
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
}

module.exports = { inscription, connexion };
