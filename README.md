# Gestion de Joutes - Application Web
Ce projet est une application fullstack permettant de gérer des joutes. Il utilise un backend Node.js et un frontend React (joutes-app), avec une base de données MySQL gérée via HeidiSQL.


**Voir wiki pour modification de branche**
# Installation 
**Prérequis**

Avant de commencer, assurez-vous d'avoir installé :

- Node.js (version LTS recommandée)

- HeidiSQL ou un autre gestionnaire de base de données MySQL.

**Installation de la Base de Données**

1. Ouvrez HeidiSQL et connectez-vous à votre instance locale.

2. Créez une nouvelle base de données (ex: joutes_db).

3. Chargez et exécutez les fichiers SQL       dans l'ordre suivant :

- TableJoutes.sql (Structure de la base)

- insertion.sql (Données initiales)



# Configuration et Lancement

**1. Cloner le projet**

git clone https://github.com/riffuu1/Joutes_vue.git

Le projet est divisé en deux parties. Vous devrez ouvrir deux terminaux distincts.

**2. Configuration du Backend**

```bash 
# Accéder au dossier backend
cd backend
# Installation des dépendances
npm install
npm install dotenv
```

**Configuration de l'environnement**
- Copiez le fichier .env.example et Collez-le au même endroit puis renommez-le en .env

- Ouvrez le fichier .env et ajouter la variable suivante pour autoriser le CORS :
**FRONTEND_URL= http://localhost:5173**


**Démarrage**

```bash 
node index.js
```

**3. Configuration du Frontend**
```bash 
# Accéder au dossier frontend
cd joutes-app
# Installation des dépendances
npm install
npm install axios
```

**Démarrage**

```bash 
npm run dev
```


# Utilisation 
Une fois les deux serveurs lancés :

Le frontend est généralement accessible sur : http://localhost:5173

Le backend tourne sur le port configuré : 3006.


