class RecipeCard {
  constructor(recipe) {
    this._recipe = recipe;
  }

  createRecipeCard() {
    console.log("\n", this._recipe.name);

    const ingredients = this._recipe.ingredients;
    // récupère l'array listant les ingrédients

    let ingredientsWrapper = document.createElement("div");
    // création du container pour les ingrédients
    ingredientsWrapper.classList.add("ingredients-wrapper");
    // ajout de la classe CSS à l'element ingredientsWrapper

    // itération sur l'ensemble des ingredients
    ingredients.forEach((recipeIngredient) => {
      console.log(
        "🚀 \n file: RecipeCard.js:20 \n RecipeCard \n ingredients.forEach \n recipeIngredient\n",
        recipeIngredient
      );

      // création d'un element HTML div
      const $container = document.createElement("div");
      // attribution de la classe CSS à l'element
      $container.classList.add("recipe-ingredient-container");

      // création d'un element HTML p
      const ingredientName = document.createElement("p");
      // attribution de la valeur
      ingredientName.textContent = recipeIngredient.ingredient;
      // attribution de la classe CSS à l'element
      ingredientName.classList.add("recipe-ingredient");

      // création d'un element HTML p
      const quantityName = document.createElement("p");

      // attribution de la valeur en fonctione de la présence de quantité ou d'unité
      if (recipeIngredient.quantity === undefined) {
        recipeIngredient.quantity = "-";
      }
      if (recipeIngredient.unit === undefined) {
        quantityName.textContent = recipeIngredient.quantity;
      } else if (recipeIngredient.unit.length < 3) {
        quantityName.textContent =
          recipeIngredient.quantity + recipeIngredient.unit;
      } else {
        quantityName.textContent =
          recipeIngredient.quantity + " " + recipeIngredient.unit;
      }

      // attribution de la classe CSS à l'element
      quantityName.classList.add("recipe-quantity");

      // ajout de l'element ingredientName en tant qu'enfant de l'element $container
      $container.appendChild(ingredientName);
      // ajout de l'element quantityName en tant qu'enfant de l'element $container
      $container.appendChild(quantityName);

      console.log(
        "🚀 \n file: RecipeCard.js:42 \n RecipeCard \n ingredients.forEach \n $container\n",
        $container
      );

      // ajout de l'element $container en tant qu'enfant de l'element ingredientsWrapper
      ingredientsWrapper.appendChild($container);

      // console.log(
      //   "🚀 \n file: RecipeCard.js:71 \n RecipeCard \n ingredients.forEach \n ingredientsWrapper\n",
      //   ingredientsWrapper
      // );
      // console.log(typeof ingredientsWrapper);
      // console.log(ingredientsWrapper.innerHTML);
    });

    const $wrapper = document.createElement("div");
    $wrapper.classList.add("recipe-card-wrapper");

    const recipeCard = `
    <div class="recipe-card-wrapper">
    <img src="${this._recipe.image}" alt="${this._recipe.name}">
    <div class="recipe-information">
    <h2>${this._recipe.name}</h2>
    <h3>Recette</h3>
    <p class="recipe-description">${this._recipe.description}</p>
    <h3>Ingrédients</h3>
    <div class="ingredients-wrapper">

    ${ingredientsWrapper.innerHTML}
    </div>


    <div class="recipe-time-container">
    <p class="recipe-time">${this._recipe.time}min</p>
  </div>

  </div>
        `;

    $wrapper.innerHTML = recipeCard;
    return $wrapper;
  }
}

// console.log("hello world from RecipeCard.js");

// class RecipeCard {
//   constructor(recipe) {
//     this._recipe = recipe;
//   }

//   createRecipeCard() {

//     const ingredients = this._recipe.ingredients;
//     // récupère l'array listant les ingrédients

//     let ingredientsContainer = document.createElement("div");
//     // création du container pour les ingrédients
//     ingredientsContainer.classList.add("recipe-ingredients-container");
//     // ajout de la classe CSS à l'element

//     // itération sur l'ensemble des ingredients
//     ingredients.forEach((recipeIngredient) => {
//       // création d'un element HTML div
//       const $wrapper = document.createElement("div");
//       // attribution de la classe CSS à l'element
//       $wrapper.classList.add("ingredient-wrapper");

//       // création d'un element HTML p
//       const ingredientName = document.createElement("p");
//       // attribution de la valeur city & country à l'element p
//       ingredientName.textContent = recipeIngredient.ingredient;
//       // attribution de la classe CSS à l'element
//       ingredientName.classList.add("recipe-ingredient");

//       // création d'un element HTML p
//       const quantityName = document.createElement("p");
//       // attribution de la valeur city & country à l'element p
//       quantityName.textContent =
//         recipeIngredient.quantity + ", " + recipeIngredient.unit;
//       // attribution de la classe CSS à l'element
//       quantityName.classList.add("recipe-quantity");

//       // ajout de l'element ingredientName en tant qu'enfant de l'element $wrapper
//       $wrapper.appendChild(ingredientName);
//       // ajout de l'element quantityName en tant qu'enfant de l'element $wrapper
//       $wrapper.appendChild(quantityName);

//       // ajout de l'element $wrapper en tant qu'enfant de l'element ingredientsContainer
//       ingredientsContainer.appendChild($wrapper);

//       // // création d'un element HTML a
//       // const divLink = document.createElement("a");
//       // // attribution de la classe CSS à l'element
//       // divLink.href = `photographer.html?id=${this._photographer.id}`;
//       // divLink.classList.add("photographer-link");
//       // divLink.setAttribute("aria-label", `Page de ${this._photographer.name}`);

//       // création d'un element HTML div
//       const divImg = document.createElement("div");
//       // attribution de la classe CSS à l'element
//       divImg.classList.add("img-container");

//       // pour chaque recette ajouter la classe RecipeCard
//       this.$recipesWrapper.appendChild(Template.createRecipeCard());
//       // créer chaque card via la method createRecipeCard et l'ajouter au parent $recipesWrapper
//     });

//     const $wrapper = document.createElement("div");
//     $wrapper.classList.add("recipe-card-wrapper");

//     const recipeCard = `
//     <div class="recipe-card-wrapper">
//     <img src="${this._recipe.image}" alt="${this._recipe.name}">
//     <h2>${this._recipe.name}</h2>
//     <h3>Recette</h3>
//     <p class="recipe-description">${this._recipe.description}</p>
//     <h3>Ingrédients</h3>
//     ${ingredientsContainer}
//     <p class="recipe-time">${this._recipe.time}min</p>
//   </div>
//         `;

//     $wrapper.innerHTML = recipeCard;
//     return $wrapper;
//   }
// }
