Voici la version optimisée et corrigée de votre dossier de conception. J'ai intégré les bonnes pratiques de Data Engineering (suppression des données calculées, utilisation des `ObjectId`) pour garantir la cohérence et la performance de votre système.

---

# Dossier de Conception : Modèle de Données NoSQL (Version Optimisée)

## 1. Liste des Collections

* **`utilisateurs`** : Acteurs de la plateforme (particuliers/agents).
* **`quartiers`** : Référentiel des zones géographiques (permet de normaliser les données).
* **`annonces`** : Collection centrale des biens immobiliers.

## 2. Structure des Documents

### Collection `utilisateurs`

```json
{
  "_id": ObjectId,
  "nom": "String",
  "email": "String",
  "telephone": "String",
  "createdAt": ISODate
}

```

### Collection `quartiers`

```json
{
  "_id": ObjectId,
  "nom": "String",
  "ville": "String"
}

```

### Collection `annonces`

```json
{
  "_id": ObjectId,
  "userId": ObjectId,          // Référence vers utilisateurs
  "quartierId": ObjectId,      // Référence vers quartiers
  "titre": "String",
  "description": "String",
  "type": "String",            // "vente" ou "location"
  "prix": Number,
  "surface": Number,           // En m2
  "nbr_pieces": Number,
  "photos": ["String"],
  "localisation": {            // Format GeoJSON pour 2dsphere
    "type": "Point",
    "coordinates": [Number, Number] // [longitude, latitude]
  },
  "disponible": Boolean,
  "createdAt": ISODate
}

```

## 3. Stratégie d'Indexation (Indispensable pour le sujet)

Pour répondre aux exigences de performance, les index suivants doivent être créés :

| Index | Champ(s) | Usage |
| --- | --- | --- |
| **`text`** | `{ "titre": "text", "description": "text" }` | Recherche mots-clés |
| **`2dsphere`** | `{ "localisation": "2dsphere" }` | Requête proximité (N km) |
| **`compound`** | `{ "type": 1, "prix": 1, "nbr_pieces": 1 }` | Filtres combinés |
| **`single`** | `{ "quartierId": 1 }` | Agrégation rapide par quartier |

## 4. Justification des choix techniques

| Relation | Choix | Justification Technique |
| --- | --- | --- |
| **Annonce - Propriétaire** | **Referencing** | Évite la redondance et facilite la gestion des profils utilisateurs. |
| **Annonce - Quartier** | **Referencing** | Assure la qualité des données (pas d'erreurs de saisie) et permet une maintenance centralisée des quartiers. |
| **Géolocalisation** | **GeoJSON** | Autorise l'indexation `2dsphere` native pour des calculs de proximité ultra-rapides. |
| **Données calculées** | **Pipeline** | Le `prix_m2` n'est pas stocké pour éviter les incohérences ; il est calculé à la volée via l'agrégation. |

---

### Pourquoi ce choix pour l'agrégation ?

En utilisant `quartierId` (ObjectId) dans la collection `annonces`, votre pipeline d'agrégation reste extrêmement performant :

```javascript
db.annonces.aggregate([
  {
    $group: {
      _id: "$quartierId", // Regroupement propre par ID
      moyenne_prix_m2: { 
        $avg: { $divide: ["$prix", "$surface"] } 
      }
    }
  }
])

```

Ce dossier est désormais parfaitement aligné avec les exigences de votre projet et les bonnes pratiques du NoSQL. Avez-vous besoin d'aide pour rédiger la partie concernant l'implémentation de la recherche textuelle dans votre code ?