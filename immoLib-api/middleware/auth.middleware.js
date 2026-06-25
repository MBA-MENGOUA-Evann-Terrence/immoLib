// middleware/auth.middleware.js
// Protege les routes: verifie le token JWT envoye dans l'en-tete Authorization.
// Format attendu: "Authorization: Bearer <token>"
// Si le token est valide, on attache l'id de l'utilisateur a req.userId.
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");

function authentifier(req, res, next) {
  const entete = req.headers.authorization || "";
  const [schema, token] = entete.split(" ");

  if (schema !== "Bearer" || !token) {
    return res.status(401).json({ erreur: "Token manquant. Connecte-toi d'abord." });
  }

  try {
    const charge = jwt.verify(token, JWT_SECRET); // { id, email, etat, ... }
    req.userId = charge.id;
    req.utilisateur = charge;
    req.estAdmin = charge.etat === 1; // 1 = admin
    next();
  } catch (err) {
    return res.status(401).json({ erreur: "Token invalide ou expire." });
  }
}

// A placer APRES authentifier: bloque l'acces si l'utilisateur n'est pas admin (etat !== 1).
function exigerAdmin(req, res, next) {
  if (!req.estAdmin) {
    return res.status(403).json({ erreur: "Acces reserve aux administrateurs." });
  }
  next();
}

module.exports = { authentifier, exigerAdmin };
