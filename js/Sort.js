class RecipesData {
  constructor(recipes) {
    this._recipes = recipes;
  }

  getIngredientsList() {
    let ingredientsList = [];

    this._recipes.forEach((recipe) => {
      //   console.log(
      //     "🧑‍🍳 \n file: App.js:1900 \n Recipes.forEach \n recipe\n",
      //     recipe
      //   );

      // récupère l'array listant les ingrédients
      const ingredients = recipe.ingredients;

      // itération sur l'ensemble des ingredients
      ingredients.forEach((recipeIngredient) => {
        // uniformisation du formatage du nom de l'ingredient (1st letter upperCase)
        const formatedIngredient = this.formatName(recipeIngredient.ingredient);

        if (!ingredientsList.includes(formatedIngredient)) {
          ingredientsList.push(formatedIngredient);
        }
      });

      //   // itération sur l'ensemble des ingredients
      //   ingredients.forEach((recipeIngredient) => {
      //     if (!ingredientsList.includes(recipeIngredient.ingredient)) {
      //       ingredientsList.push(recipeIngredient.ingredient);
      //     }
      //   });
    });

    return ingredientsList;
  }

  searchItem(itemType, itemList) {
    if (typeof itemType === "string") {
      itemType = this.formatName(itemType);
      if (!itemList.includes(itemType)) {
        itemList.push(itemType);
      }
    } else if (typeof itemType === "object") {
      itemType.forEach((item) => {
        item = this.formatName(item);
        if (!itemList.includes(item)) {
          itemList.push(item);
        }
      });
    }
  }

  getAppliancesList() {
    let appliancesList = [];

    this._recipes.forEach((recipe) => {
      // récupère l'array ou le string du/des appareills
      const appliances = recipe.appliance;

      this.searchItem(appliances, appliancesList);
    });

    return appliancesList;
  }

  getUstensilsList() {
    let ustensilsList = [];

    this._recipes.forEach((recipe) => {
      // récupère l'array ou le string du/des ustensiles
      const ustensils = recipe.ustensils;

      this.searchItem(ustensils, ustensilsList);
    });

    return ustensilsList;
  }

  formatName(rawName) {
    return rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
  }
}
