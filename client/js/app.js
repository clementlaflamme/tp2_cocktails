import {
  afficherListeCocktails,
  rechercherCocktails,
  rechercherCocktailsID,
  trierCocktails,
  filtrerParPrix,
  listerSelonIngredient,
} from "./modules/affichage.js";

// Écoute et attends que la page soit complètement chargée avant d'afficher les cocktails
document.addEventListener("DOMContentLoaded", () => {
  afficherListeCocktails();
});

// Revenir à la page d'acceuil
document
  .querySelector("#home-button")
  .addEventListener("click", (e) => afficherListeCocktails());

// Récupère la saisie de la barre de recherche
const searchBar = document.querySelector("input[type='search']");
searchBar.addEventListener("input", (saisie) => {
  rechercherCocktails(saisie.target.value);
});

// Écoute pour un clic dans le menu déroulant "Trier selon" puis renvoie le critère
document.querySelectorAll(".filter").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const critere = e.target.textContent;
    trierCocktails(critere);
  });
});

// Récupère l'ID puis appelle la fonction de recherche par ID
document
  .querySelector("#search-id")
  .addEventListener("input", (e) =>
    rechercherCocktailsID(e.target.valueAsNumber),
  );

// Récupère le prix min et max puis appelle la fonction pour filtrer par prix
document.querySelector("#filter-price").addEventListener("click", (e) => {
  const prixMin = document.querySelector("#price-min").valueAsNumber;
  const prixMax = document.querySelector("#price-max").valueAsNumber;
  filtrerParPrix(prixMin, prixMax);
});

// Écoute pour un clic dans le menu déroulant des ingrédients, 
// puis appelle listerSelonIngredient selon l'ingrédient cliqué
document.querySelector("#list-ingredients").addEventListener("click", (e) => {
  const lien = e.target.closest(".ingredient");

  if (lien) {
    e.preventDefault();
    const categorie = lien.dataset.categorie;
    if (categorie === "Tous") trierCocktails("Nom (a-z)");
    else {
      listerSelonIngredient(categorie);
    }
  }
});
