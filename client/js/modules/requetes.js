export async function obtenirListeCocktails() {
  const reponse = await fetch("/cocktails");

  if (!reponse.ok) {
    throw new Error(
      `Impossible d'obtenir la liste des cocktails (${reponse.status})`,
    );
  }

  return reponse.json();
}
