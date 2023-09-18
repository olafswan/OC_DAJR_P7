class FilterList {
  constructor(ingredientsList, appliancesList, ustensilsList) {
    this._ingredientsList = ingredientsList.sort();
    this._appliancesList = appliancesList.sort();
    this._ustensilsList = ustensilsList.sort();
  }

  filterFiller(listId, listName) {
    // console.log("modification de la liste de tags", listName);

    // cible la bonne liste de tags via la variable listName
    const filterContainer = document.querySelector(`#${listName}`);
    // cible le container où injecter les tags créés
    const $wrapper = filterContainer.querySelector(".select-options-container");

    // TODO supprimer la ligne suivant entraine des bugs
    $wrapper.innerHTML = ``;

    listId.forEach((item) => {
      const option = document.createElement("p");
      option.classList.add("select-option");
      option.textContent = item;
      $wrapper.appendChild(option);
    });
  }

  // algoV2

  fillFiltersLists() {
    this.filterFiller(this._ingredientsList, "ingredients");
    this.filterFiller(this._appliancesList, "appliances");
    this.filterFiller(this._ustensilsList, "ustensils");
  }
}
