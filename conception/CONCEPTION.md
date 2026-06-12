```markdown
```
# Dossier de Conception : Modèle de Données NoSQL

## 1. Liste des Collections

- **utilisateurs** : Stocke les informations des acteurs de la plateforme.
- **quartiers** : Référentiel fixe des zones géographiques disponibles.
- **annonces** : Collection centrale contenant les biens, leurs caractéristiques et leur géolocalisation.

## 2. Structure des Documents

### Collection utilisateurs

```json
{
  "_id": "ObjectId",
  "nom": "String",
  "email": "String",
  "telephone": "String",
  "role": "String",
  "createdAt": "ISODate"
}

```

### Collection quartiers

```json
{
  "_id": "String",
  "nom": "String",
  "ville": "String",
  "description": "String"
}

```

### Collection annonces

```json
{
  "_id": "String",
  "userId": "String",
  "titre": "String",
  "description": "String",
  "type": "String",
  "prix": "Number",
  "surface": "Number",
  "prix_m2": "Number",
  "nbr_pieces": "Number",
  "quartier": "String",
  "photos": ["String"],
  "localisation": {
    "type": "Point",
    "coordinates": [Number, Number]
  },
  "disponible": "Boolean",
  "createdAt": "ISODate"
}

```

## 3. Justification des choix techniques

| Relation | Choix | Justification Technique |
| --- | --- | --- |
| **Annonce - Propriétaire** | **Referencing** | Évite la redondance des données personnelles. Facilite la mise à jour des profils. |
| **Annonce - Quartier** | **Embedding** | Permet des agrégations rapides ($group) sans jointures coûteuses. |
| **Géolocalisation** | **GeoJSON** | Autorise l'indexation `2dsphere` pour les requêtes de proximité ($near). |

