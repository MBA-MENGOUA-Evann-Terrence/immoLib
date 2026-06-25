# immoLib API

API REST (Node.js + Express, architecture MVC) pour la plateforme d'annonces immobilieres
**immoLib** (Libreville). Base MongoDB Atlas `immoLib` : collections `annonces`, `quartiers`, `utilisateurs`.

## Installation

```bash
cd immoLib-api
npm install
# copier .env.example en .env et coller la chaine Atlas
npm run indexes   # verifie/cree les index (text + 2dsphere)
npm run dev       # lance le serveur sur http://localhost:3000
```

## Endpoints

| Methode | URL | Description |
|---|---|---|
| GET | `/api/annonces` | Filtres combines + tri + pagination (voir `docs/06`) |
| GET | `/api/annonces/recherche?q=` | Recherche plein-texte (`$text`) |
| GET | `/api/annonces/proches?lng=&lat=&rayon=` | **Recherche par rayon de N km (`$near`)** |
| GET | `/api/annonces/:id` | Detail d'une annonce |
| GET | `/api/quartiers` | Liste des quartiers |
| GET | `/api/quartiers/prix-moyen-m2` | Prix moyen au m2 par quartier (agregation) |

---

## Recherche des biens dans un rayon de N kilometres (`$near`)

### Reponse courte
**Oui, c'est implemente** : endpoint `GET /api/annonces/proches`.

### Comment ca marche

1. **L'index geospatial.** MongoDB ne peut faire des calculs de distance que si le champ
   `localisation` (au format GeoJSON `Point`) possede un index **`2dsphere`**. Il est cree par
   `npm run indexes` :
   ```js
   db.annonces.createIndex({ localisation: "2dsphere" })
   ```

2. **L'operateur `$near`.** Il trie automatiquement les resultats du plus proche au plus
   eloigne, et `$maxDistance` limite la recherche a un rayon donne (en **metres**) :
   ```js
   db.annonces.find({
     localisation: {
       $near: {
         $geometry: { type: "Point", coordinates: [lng, lat] },
         $maxDistance: rayonKm * 1000   // km -> metres
       }
     }
   })
   ```

3. **Conversion km -> metres.** L'URL recoit le rayon en **kilometres** ; le model multiplie
   par 1000 pour `$maxDistance`.

> Attention GeoJSON : l'ordre des coordonnees est **[longitude, latitude]** (et non l'inverse).

### Utilisation

```
GET /api/annonces/proches?lng=9.4990&lat=0.4222&rayon=5
```
- `lng` : longitude du point de reference
- `lat` : latitude du point de reference
- `rayon` : rayon de recherche en km (defaut : 5)

Reponse :
```json
{
  "centre": { "lng": 9.499, "lat": 0.4222 },
  "rayonKm": 5,
  "total": 44,
  "annonces": [ /* triees de la plus proche a la plus loin */ ]
}
```

### Ou est le code (MVC)
- **Route** : `routes/annonces.routes.js` -> `GET /proches`
- **Controller** : `controllers/annonces.controller.js` -> `annoncesProches()` (lit `lng`, `lat`, `rayon`)
- **Model** : `models/annonce.model.js` -> `rechercheProximite()` (execute le `$near`)

## Documentation detaillee
Chaque fonctionnalite est expliquee dans `docs/` :
`00-structure`, `01-index`, `02-filtres`, `03-recherche-texte`, `04-geo-near`, `05-agregation`, `06-requetes-avancees`.
