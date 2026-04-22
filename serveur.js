// =============================================================================
// serveur.js - Serveur Node.js avec Express
// Cours : 420-931-MA (Developpement Web)
// Description : Serveur Express qui expose des routes pour les cocktails
//               et sert les fichiers statiques du client.
// =============================================================================

import express from "express";
import { readFile, writeFile } from "node:fs/promises";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const REPERTOIRE_CLIENT = path.join(__dirname, "client");
const FICHIER_COCKTAILS = path.join(
  __dirname,
  "serveur",
  "donnees",
  "cocktails.json",
);

async function lireFichierCocktails() {
  const contenu = await readFile(FICHIER_COCKTAILS, "utf-8");
  return JSON.parse(contenu);
}

async function ecrireFichierCocktails(tabCocktails) {
  const contenu = JSON.stringify(tabCocktails, null, 2);
  await writeFile(FICHIER_FILMS, contenu, "utf-8");
}

app.use(express.json());
app.use(express.static(REPERTOIRE_CLIENT));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(REPERTOIRE_CLIENT, "index.html"));
});

app.get("/cocktails", async (req, res) => {
  try {
    const cocktails = await lireFichierCocktails();
    res.json(cocktails);
  } catch (erreur) {
    console.error("Erreur lors de la lecture des cocktails :", erreur);
    res.status(500).json({ message: "Impossible de charger les cocktails." });
  }
});

app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log("  Serveur demarre avec succes !");
  console.log(`  Adresse : http://localhost:${PORT}`);
  console.log("=".repeat(50));
});
