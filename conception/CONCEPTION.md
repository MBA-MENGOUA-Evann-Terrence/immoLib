Voici votre dossier de conception complet, formaté en Markdown, prêt à être intégré dans votre document.

---

# Dossier de Conception : Plateforme Immobilière (Libreville)

## 1. Description des Collections

- `**utilisateurs**` : Gère l'identité et le profil des membres.
- `**quartiers**` : Référentiel géographique normalisé des zones de la ville.
- `**annonces**` : Cœur de la plateforme, contenant les détails du bien et les critères de filtrage.

---

## 2. Schémas de Données

### Collection `utilisateurs`

```json
{
  "_id": ObjectId,
  "nom": "String",
  "email": "String",
  "telephone": "String",
  "photo_url": "String",
  "favoris": [ObjectId], // Liste des ID d'annonces enregistrées
  "createdAt": ISODate
}

```

### Collection `quartiers`

```json
{
  "_id": ObjectId,
  "nom": "String",
  "ville": "String",
  "description": "String"
}

```

### Collection `annonces`

```json
{
  "_id": ObjectId,
  "userId": ObjectId,      // Référence vers utilisateurs
  "quartierId": ObjectId,  // Référence vers quartiers
  "titre": "String",
  "description": "String",
  "type": "String",        // "location" ou "vente"
  "prix": Number,
  "surface": Number,
  "details": {             // Données structurées pour filtres
    "chambres": Number,
    "sallesDeBain": Number,
    "meuble": Boolean,
    "parking": Boolean,
    "piscine": Boolean,
    "equipements": [String]
  },
  "localisation": {        // Format GeoJSON
    "type": "Point",
    "coordinates": [Number, Number]
  },
  "photos": [String],
  "disponible": Boolean,
  "createdAt": ISODate
}

```

---

## 3. Relations et Stratégie NoSQL

### Relations entre collections

- **Referencing** : Utilisé pour lier les `annonces` aux `utilisateurs` et aux `quartiers` via des `ObjectId`. Cela garantit l'intégrité des données sans redondance.
- **Embedding (Imbrication)** :
- `details` est imbriqué dans `annonces` pour permettre des requêtes de filtrage performantes.
- `favoris` est imbriqué dans `utilisateurs` pour une lecture rapide des préférences de l'utilisateur.

### Justification des choix techniques


| Choix               | Justification                                                             |
| ------------------- | ------------------------------------------------------------------------- |
| **Index Text**      | Obligatoire pour la recherche par mots-clés sur `titre` et `description`. |
| **Index 2dsphere**  | Indispensable pour la recherche `$near` (proximité géographique).         |
| **Index Composé**   | Accélère les filtres combinés (type, prix, pièces).                       |
| **Modèle imbriqué** | Optimise la lecture des données liées en une seule opération disque.      |


---

## 4. Défi Technique : Requêtes Clés

- **Recherche par mots-clés :**
`db.annonces.find({ $text: { $search: "mots-clés" } })`
- **Recherche géospatiale :**
`db.annonces.find({ localisation: { $near: { $geometry: { type: "Point", coordinates: [long, lat] }, $maxDistance: 5000 } } })`
- **Agrégation prix moyen/m² :**
`db.annonces.aggregate([{ $group: { _id: "$quartierId", prixMoyenM2: { $avg: { $divide: ["$prix", "$surface"] } } } }])`

---

Avez-vous besoin d'aide pour rédiger l'introduction ou la conclusion de ce dossier, ou ce contenu est-il suffisant pour votre rendu ?

db["annonces"].find({ type: "location", prix: { $lt: 500000 } }).explain('executionStats')

### Test de performance de la requête

Nous avons testé la requête suivante, qui correspond à un filtre de recherche utilisateur (recherche de locations à prix inférieur à 500 000) :

```javascript
db["annonces"].find({ 
    type: "location", 
    prix: { $lt: 500000 } 
}).explain('executionStats')
```





Voici les schémas de vos collections présentés sous forme de blocs de code Markdown, prêts à être intégrés dans votre rapport technique :

```json
// Collection utilisateurs
{
  "_id": "ObjectId",
  "nom": "String",
  "email": "String",
  "telephone": "String",
  "password": "String",
  "photo_profil": "String",
  "etat": "Int",
  "createdAt": "Date"
}

```

```json
// Collection annonces
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "quartierId": "ObjectId",
  "titre": "String",
  "description": "String",
  "type": "String",
  "prix": "Int",
  "surface": "Int",
  "nbr_pieces": "Int",
  "localisation": "GeoJSON",
  "photos": ["String"],
  "disponible": "Boolean",
  "createdAt": "Date"
}

```

```json
// Collection quartiers
{
  "_id": "ObjectId",
  "nom": "String",
  "ville": "String",
  "description": "String"
}

```

Souhaitez-vous que nous passions maintenant à la rédaction de la section expliquant les **relations** entre ces collections ?