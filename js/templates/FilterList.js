class FilterList {
  constructor(ingredientsList, appliancesList, ustensilsList) {
    this._ingredientsList = ingredientsList.sort();
    this._appliancesList = appliancesList.sort();
    this._ustensilsList = ustensilsList.sort();
  }

  filterFiller(listId, listName) {
    const filterContainer = document.querySelector(`#${listName}`);
    const $wrapper = filterContainer.querySelector(".select-options-container");

    $wrapper.innerHTML = `<div class="selected-container"></div>`;

    listId.forEach((item) => {
      const option = document.createElement("p");
      option.classList.add("select-option");
      option.textContent = item;
      $wrapper.appendChild(option);
    });
  }

  fillFiltersLists() {
    this.filterFiller(this._ingredientsList, "ingredients");
    this.filterFiller(this._appliancesList, "appliances");
    this.filterFiller(this._ustensilsList, "ustensils");
  }
}
