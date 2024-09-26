
# Projet WEB-AI - Évaluation

Ce projet est divisé en deux parties :

1. Un fichier Jupyter Notebook : `notebook.ipynb`
2. Un projet web structuré en trois dossiers : 
   - `frontend` : Contient l'application front-end développée avec Vue.js.
   - `backend` : Contient le serveur back-end développé avec Node.js.
   - `python_api` : Contient une API développée avec FastAPI en Python.

## Structure du projet

```
/frontend       # Application Vue.js (Front-end)
/backend        # Serveur Node.js (Back-end)
/python_api     # API FastAPI (Python)
/notebook.ipynb # Fichier Jupyter Notebook analyse et prédiction de données
/models         # Models générés à partir du code présent sur le notebook
```

### 1. Lancer l'application Frontend

Naviguez dans le dossier `frontend` et exécutez les commandes suivantes pour installer les dépendances et démarrer l'application Vue.js en mode développement :

```bash
cd frontend
npm install
npm run dev
```

L'application sera accessible via le navigateur à l'adresse suivante : `http://localhost:3000`.

### 2. Lancer le serveur Backend

Naviguez dans le dossier `backend` et lancez le serveur Node.js avec la commande suivante :

```bash
cd backend
node server.js
```

Le serveur sera accessible à l'adresse : `http://localhost:4000`.

### 3. Lancer le serveur Python avec FastAPI

Naviguez dans le dossier `python_api` et démarrez le serveur FastAPI sur le port 8000 avec la commande suivante :

```bash
cd python_api
uvicorn main:app --reload --port 8000
```

L'API sera accessible à l'adresse : `http://localhost:8000`.

## Contenu du fichier Jupyter Notebook

Le fichier `notebook.ipynb` contient la premiere partie de l'evaluation avec l'annalyse/visualisationd e données ainsi que les prédictions.
