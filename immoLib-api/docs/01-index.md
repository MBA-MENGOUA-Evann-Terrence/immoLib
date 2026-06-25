# 01 - Les index (script createIndexes.js)

## Tes requetes d'origine
```js
// index plein-texte (deja teste, capture index_textuel.png)
db.annonces.createIndex({ "titre": "text", "description": "text" })

// index geospatial (necessaire pour $near)
db.annonces.createIndex({ "localisation": "2dsphere" })
```

## Ce que j'ai code
Le fichier `scripts/createIndexes.js` :
1. liste les index existants sur `annonces` (repond a la question : "le 2dsphere existe-t-il ?") via `annonces.indexes()` ;
2. cree l'index **text** seulement s'il n'existe pas ;
3. cree l'index **2dsphere** seulement s'il n'existe pas.

Lancement : `npm run indexes`

Le script affiche la liste des index puis `[OK]` (deja present) ou `[CREE]` pour chacun.
