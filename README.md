🎨 Frontend - React

Ce projet est un frontend React entièrement dockerisé.
Il peut être lancé soit via Docker, soit directement en local avec Node.js.

🛠️ Prérequis

Avant de lancer le projet, assure-toi d’avoir installé :

    Node.js (>= 18)
    npm
    ou yarn

    Docker
    Docker Compose

▶️ Lancer le projet avec Docker

Tout est déjà configuré dans le docker-compose.yml.
Tu peux démarrer avec :

docker-compose up --build


👉 Cela va builder et lancer le frontend dans un container Docker.

▶️ Lancer le projet sans Docker (local)

Si tu veux lancer le frontend directement en local :

# Installer les dépendances
npm install
# ou
yarn install

# Lancer le projet
npm run dev
# ou
yarn dev


Par défaut, l’application démarre sur :
👉 http://localhost:5173

⚙️ Configuration

Les variables d’environnement sont définies dans un fichier .env :

VITE_BASE_URL=http://localhost:9090