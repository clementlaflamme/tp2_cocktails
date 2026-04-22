import { obtenirListeCocktails } from "./requetes.js";

let tousLesCocktails = [];

// Affiche les cards selon la liste qui lui est passé en paramètre
function genererAffichage(listeAAfficher) {
  const conteneur = document.getElementById("lst_cocktails");

  if (!conteneur) return;

  if (listeAAfficher.length === 0) {
    conteneur.innerHTML =
      "<p>Aucun cocktail ne correspond à votre recherche.</p>";

    return;
  }

  conteneur.innerHTML = listeAAfficher
    .map((cocktail) => {
      const listeIngredients = cocktail.ingredients
        .map((item) => item.ingredient)
        .filter((ing) => ing && ing.trim() !== "")
        .join(", ");

      return `
          <article>
          <div class="card card-cocktail shadow-sm card-hover">
          <img src="${cocktail.image}" onerror="this.onerror=null; this.src='/images/cocktail-default.png';" alt="" class="card-img-top img-card">
          <div class="card-body">
            <h2 class="card-title">${cocktail.name || "N/A"}</h2>
            <p>Catégorie : ${cocktail.category || "N/A"}</p>
            <p>Ingrédients : ${listeIngredients || "N/A"}</p>
            <p>Prix : ${cocktail.price || "N/A"}$</p>
            
            </div>
            </div>
          </article>
        `;
    })
    .join("");
}

// Affiche les cocktails au lancement de la page
export async function afficherListeCocktails() {
  try {
    tousLesCocktails = await obtenirListeCocktails();
    afficherListeIngredients();
    trierCocktails("Nom (a-z)");
  } catch (erreur) {
    const conteneur = document.getElementById("lst_cocktails");
    conteneur.innerHTML = "<p>Erreur de chargement.</p>";
    console.error(erreur);
  }
}

// Rechercher les cocktails avec la barre de recherche
export function rechercherCocktails(texte) {
  const filtre = tousLesCocktails.filter((cocktail) =>
    cocktail.name.toLowerCase().includes(texte.toLowerCase()),
  );
  genererAffichage(filtre);
}

// Rechercher les cocktails par ID
export function rechercherCocktailsID(id) {
  if (!id) return;
  const resultat = tousLesCocktails.find((cocktail) => cocktail.id === id);
  genererAffichage([resultat]);
}

// Trier les cocktails par critère
export function trierCocktails(critere) {
  let copie = [...tousLesCocktails];
  if (critere === "Nom (a-z)") {
    copie.sort((a, b) => a.name.localeCompare(b.name));
  } else if (critere === "Nom (z-a)") {
    copie.sort((a, b) => b.name.localeCompare(a.name));
  } else if (critere === "Prix (croissant)") {
    copie.sort((a, b) => a.price - b.price);
  } else if (critere === "Prix (décroissant)") {
    copie.sort((a, b) => b.price - a.price);
  }
  genererAffichage(copie);
}

// Filtre les cocktails entre deux prix donnés
export function filtrerParPrix(prixMin, prixMax) {
  if (!(prixMin && prixMax)) return;
  if (prixMin > prixMax) {
    alert("Le prix minimum ne peut pas être supérieur au prix maximum");
    return;
  }
  const resultat = tousLesCocktails
    .filter(
      (cocktail) => prixMin <= cocktail.price && cocktail.price <= prixMax,
    )
    .sort((a, b) => a.price - b.price);
  genererAffichage(resultat);
}

// Récupère tous les ingrédients des cocktails
function listerIngredients() {
  const listeIngredients = new Set();

  tousLesCocktails.forEach((cocktail) =>
    cocktail.ingredients.forEach((ing) => {
      if (ing.ingredient.trim() !== "") listeIngredients.add(ing.ingredient);
    }),
  );
  const ingredientsFinal = Array.from(listeIngredients).sort();
  return ingredientsFinal;
}

// Affiche tous les ingrédients dans le menu déroulant
export function afficherListeIngredients() {
  const dropdown = document.querySelector("#list-ingredients");
  const listeIngredients = listerIngredients();

  let totalHtml = `
    <li>
      <a class="ingredient dropdown-item fw-bold border-bottom mb-1 pb-2" href="#" data-categorie="Tous">
        Tous
      </a>
    </li>
  `;

  listeIngredients.forEach((ingredient) => {
    totalHtml += `
      <li>
        <a class="ingredient dropdown-item py-2" href="#" data-categorie="${ingredient}">
          ${ingredient}
        </a>
      </li>`;
  });

  dropdown.innerHTML = totalHtml;
}

// Renvoie la liste des cocktails selon l'ingrédient choisi
export function listerSelonIngredient(ingr) {
  if (!ingr) return;

  const listeCocktailIngredients = tousLesCocktails.filter((cocktail) => {
    return cocktail.ingredients.some((ing) => ing.ingredient === ingr);
  });

  genererAffichage(listeCocktailIngredients);
}
