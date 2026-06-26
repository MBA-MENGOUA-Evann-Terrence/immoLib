Voici le contenu complet, prêt à être copié-collé directement dans l'interface de création de votre fichier `README.md` sur GitHub.

```markdown
# immoLib - Plateforme d'Annonces Immobilières

**immoLib** est une plateforme web dédiée à la centralisation et à la consultation d'annonces immobilières sur le marché de Libreville (Akanda, Glass, Nzeng-Ayong). Ce projet a été développé dans le cadre du cours de **NoSQL** pour démontrer la maîtrise de la modélisation documentaire, de l'indexation géospatiale et de l'analyse de données.

---

## 👥 Membres du Groupe
* **MBA MENGOUA Evann Terrence**
* **AYONGA TOUGANDE Noëlle-Wilda**
* **BIAKBA Yvette**

---

## 🏢 Contexte Métier
Le marché immobilier à Libreville souffre d'une fragmentation de l'offre entre particuliers et agences. **immoLib** répond à ce besoin en offrant un outil centralisé permettant aux utilisateurs de publier des biens, de les rechercher par mots-clés et de les localiser précisément via une interface cartographique interactive.

---

## 🛠️ Prérequis
* [Node.js](https://nodejs.org/) (v18+)
* [MongoDB](https://www.mongodb.com/) (Atlas ou instance locale)
* [npm](https://www.npmjs.com/)

---

## ⚙️ Configuration
1. **Cloner le projet** : `git clone <votre-url>`
2. **Installer les dépendances** : 
   ```bash
   npm install
   cd client && npm install && cd ..

```

3. **Configurer l'environnement** :
Créez un fichier `.env` à la racine avec le contenu suivant :
```env
MONGODB_URI=mongodb+srv://ayongawilda_db_user:GCBaeOzaQQksykor@cluster0.iylak6k.mongodb.net/immoLib?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=change_moi_par_une_longue_chaine_secrete

```



---

## 🚀 Lancement de l'application

Pour lancer simultanément le backend et le frontend en mode développement, utilisez la commande suivante à la racine :

```bash
npm run dev

```

*(Nécessite le package `concurrently` : `npm install concurrently --save-dev`)*

---

## 🗄️ Peuplement de la base de données

Vous avez deux options pour initialiser vos données :

### Option A : Via le script automatique

```bash
npm run seed

```

### Option B : Via le Shell MongoDB

1. Ouvrez le shell MongoDB :
```bash
npm run mongo:shell

```


2. Une fois connecté, chargez vos données :
```javascript
load("seed.js");

```



---

## 🛠️ Scripts disponibles

* `npm start` : Lance uniquement le serveur backend.
* `npm run dev` : Lance le backend et le frontend simultanément.
* `npm run seed` : Exécute le script `seed.js` pour peupler la base.
* `npm run mongo:shell` : Connexion directe au cluster via le terminal.

---



*Projet réalisé pour le cours de NoSQL - 2026*

```

```
