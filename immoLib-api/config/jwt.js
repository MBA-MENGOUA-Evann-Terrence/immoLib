// config/jwt.js
// Cle secrete utilisee pour signer ET verifier les tokens JWT.
// On lit JWT_SECRET dans .env ; une valeur de repli evite de bloquer en dev.
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_immoLib_change_me";
const JWT_EXPIRES_IN = "7d"; // duree de validite du token

module.exports = { JWT_SECRET, JWT_EXPIRES_IN };
