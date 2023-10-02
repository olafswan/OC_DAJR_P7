class App {
  constructor() {
    // fetch les données json du fichier recipes.json
    this.recipesApi = new RecipesApi(
      "https://olafswan.github.io/OC_DAJR_P7/data/recipes.json"
    );

    // emplacement pour l'injection des recettes
    this.$recipesWrapper = document.querySelector(".result-container");

    // données fetchées
    this.fetchedRecipesData;
  }

  async main() {
    // --- GESTION DES 3 MENUS DE SELECTION DE TAGS ---

    // Sélection de tous les éléments de classe ".select-header (titres des menus)"
    const selectHeaders = document.querySelectorAll(".select-header");

    // Boucle sur chaque élément ".select-header" pour ajouter un écouteur d'événement "click"
    selectHeaders.forEach((header) => {
      header.addEventListener("click", () => {
        // Récupérer l'élément parent ".select-container" de l'élément ".select-header" cliqué
        const selectContainer = header.parentElement;

        // Récupérer l'élément ".select-search-container" enfant de l'élément parent
        const selectSearchContainer = selectContainer.querySelector(
          ".select-search-container"
        );
        // icone ˄
        const up = selectContainer.querySelector(".fa-angle-up");
        // icone ˅
        const down = selectContainer.querySelector(".fa-angle-down");

        // toggle la classe ".show" de l'élément ".select-search-container" le corps du menu
        selectSearchContainer.classList.toggle("show");
        // toggle la classe ".close" de l'élément ".select-container" l'entête du menu
        selectContainer.classList.toggle("close");

        // up affiché menu ouvert ˄
        up.classList.toggle("hide");
        // down affiché menu fermé ˅
        down.classList.toggle("hide");

        // TODO implémenter la fermeture des menus à la perte de focus
      });
    });

    // INITIALISATION DE LA PAGE

    // récupére les données sous forme d'array
    this.fetchedRecipesData = await this.recipesApi.getRecipes();

    // lancement d'une recherche initiale
    this.globalSearch();

    // DECLENCHEMENT DE RECHERCHE VIA LA SEARCHBAR

    // ciblage de la barre de recherche
    const searchBar = document.querySelector("#search");

    // observation de la barre de recherche
    searchBar.addEventListener("input", () => {
      // cible le bouton d'effacement du champ de recherche
      const deleteButton = document.querySelector(
        "div.search-bar .delete-button"
      );
      // ajout du bouton d'effacement si le champ n'est pas vide
      if (searchBar.value != "") {
        // appelle la method pour permettre l'effacement
        this.deleteInput(deleteButton);
      } else {
        // masque le bouton d'effacement si le champ est vide
        console.log("la barre est vide");
        deleteButton.classList.add("hide");
      }

      // lancement d'une recherche
      this.globalSearch();
    });

    // // utilisation de la method optionSelection pour rendre possible la sélection des tags
    // this.optionSelection();

    // FONCTION DE RECHERCHE DE TAGS

    // ciblage des containers des search bars
    const ingredientsSearch = document.querySelector("#ingredientsSearch");
    const appliancesSearch = document.querySelector("#appliancesSearch");
    const ustensilsSearch = document.querySelector("#ustensilsSearch");
    const searchOptions = [
      ingredientsSearch,
      appliancesSearch,
      ustensilsSearch,
    ];
    // sur chaque champs de recherche
    searchOptions.forEach((tagSearchBar) => {
      // cible l'element de classe .selectSearchContainer
      const selectSearchContainer = tagSearchBar.parentElement;
      // cible le bouton d'effacement du champ de recherche
      const deleteButton =
        selectSearchContainer.querySelector(".delete-button");

      tagSearchBar.addEventListener("input", () => {
        // ajout du bouton d'effacement si le champ n'est pas vide
        if (tagSearchBar.value != "") {
          // appelle la method pour permettre l'effacement
          this.deleteInput(deleteButton, tagSearchBar);
        } else {
          // masque le bouton d'effacement si le champ est vide
          deleteButton.classList.add("hide");
        }

        // filtre la liste de tag en fonction de l'input
        this.optionTrimmer(tagSearchBar, this.normalize(tagSearchBar.value));
      });
      // à la perte de focus vider le champ et masquer le bouton d'effacement
      tagSearchBar.addEventListener("blur", () => {
        console.log("perte de focus, effacement de la recherche");
        tagSearchBar.value = "";
        deleteButton.classList.add("hide");
        this.optionTrimmer(tagSearchBar, "");
      });
    });
  }

  // METHOD POUR INITIER UNE RECHERCHE
  globalSearch() {
    console.log("--------------------");
    // 1 RÉCUPÉRER LE CONTENU DE LA SEARCH BAR

    // ciblage de la barre de recherche
    const searchBar = document.querySelector("#search");

    // récupération de la valeur dans la barre de recherche
    let searchString = searchBar.value;

    // prévention des vulérabilités XSS
    if (!(searchString === undefined)) {
      searchString = this.escape(searchString);
    }

    // transforme le string en un array
    const searchArray = this.stringToArray(searchString);

    console.log(
      "🚀 \n file: App.js:120 \n CRITERE 1 \n searchArray\n",
      searchArray
    );

    // 2 RÉCUPÉRER LES TAGS SÉLÉCTIONNÉS

    // ciblage du container de tags sélectionnés
    const tagsContainer = document.querySelector(".tag-container");

    // ciblage des tags sélectionnés
    const tagsNodeList = tagsContainer.querySelectorAll(".tag");

    // création de la liste des tags sélectionnés
    let tagArray = [];

    // ajout de chaque tag à la liste
    tagsNodeList.forEach((tagElement) => {
      // supression des caractères accentués
      const tag = this.normalize(tagElement.innerText);

      // ajout des mots de plus de 3 caractères à la liste des tags
      tagArray = tagArray.concat(tag.match(/\b([A-zÀ-ú]{3,})\b/g));
    });

    console.log("🚀 \n file: App.js:143 \n CRITERE 2 \n tagArray\n", tagArray);

    // EFFECTUER LA RECHERCHE AVEC LES CRITÈRES 1 ET 2
    const resultArray = this.trimRecipeList(searchArray, tagArray);

    // en fonction des résultats

    // console.log("variables CAS 1");

    // console.log(
    //   "🚀 \n la search bar est vide ? \n typeof searchString === undefined\n",
    //   typeof searchString === "undefined"
    // );
    // console.log(
    //   "🚀 \n la search bar contient moins de 3 caractères ? \n searchString.length < 3\n",
    //   searchString.length < 3
    // );
    // console.log(
    //   "🚀 \n pas de tags sélectionnés ?\n tagArray.length == 0\n",
    //   tagArray.length == 0
    // );

    // console.log("variables CAS 2");

    // console.log(
    //   "🚀 \n la search bar n'est pas vide ? \n !(typeof searchString === undefined)\n",
    //   !(typeof searchString === "undefined")
    // );

    // console.log(
    //   "🚀 \n la search bar contient plus de 2 caractères ? \n searchString.length > 2\n",
    //   searchString.length > 2
    // );

    // console.log(
    //   "🚀 \n tags sélectionnés \n tagArray.length > 1 ?\n",
    //   tagArray.length > 0
    // );

    if (
      // CAS N°1 : la search bar est vide ou contient moins de 3 caractères ou contient uniquement des caractères spéciaux ET pas de tags
      // => affichage de l'ensemble des recettes
      (typeof searchString === "undefined" ||
        searchString.length < 3 ||
        this.stringToArray(searchString) == null) &&
      tagArray.length == 0
    ) {
      console.log(
        "CAS N°1 : la search bar est vide ou contient moins de 3 caractères ou contient uniquement des caractères spéciaux ET pas de tags"
      );
      // utilisation de la method showRecipes pour afficher les recettes
      this.showRecipes(this.fetchedRecipesData);
      // utilisation de la method fillFiltersLists pour afficher les tags correspondants aux recettes affichées
      this.fillFiltersLists(this.fetchedRecipesData);
      // utilisation de la method optionSelection pour rendre possible la séléction des tags précédements affichés
      this.optionSelection();
    } else if (
      // CAS N°2 : la search bar contient plus de 2 caractères OU un/plusieurs tag(s)
      // => affichage des recettes triées
      (!(typeof searchString === "undefined") && searchString.length > 2) ||
      tagArray.length > 0
    ) {
      console.log(
        "CAS N°2 : la search bar contient plus de 2 caractères OU un/plusieurs tag(s)"
      );

      if (resultArray.length > 0) {
        console.log("CAS N°2.1 : des résultats sont trouvés");
        // cas où des résultats sont trouvés
        // => affichage des résultats
        // utilisation de la method showRecipes pour afficher les recettes
        this.showRecipes(resultArray);
        // utilisation de la method fillFiltersLists pour afficher les tags correspondants aux recettes affichées
        this.fillFiltersLists(resultArray);
        // utilisation de la method optionSelection pour rendre possible la séléction des tags précédements affichés
        this.optionSelection();
      } else {
        console.log("CAS N°2.2 : pas de résultats");
        // cas où aucun résultat ou moins de 3 caractères
        // => affichage du message d'erreur
        if (resultArray.length === 0) {
          // affiche le message d'erreur
          this.$recipesWrapper.innerHTML = `<p class="search-error">« Aucune recette ne contient ‘${searchString}’ vous pouvez chercher ‘tarte aux pommes’, ‘poisson’ etc...</p>`;
          // efface le compteur de recettes
          document.querySelector(".results-number").innerHTML = "";
          // // masque les sélécteur de tags
          // mainHeader.classList.add("hide");

          // // ferme les listes de tags ouvertes
          // const selectSearchContainers = document.querySelectorAll(
          //   ".select-search-container"
          // );

          // selectSearchContainers.forEach((selectSearchContainer) => {
          //   // suppression de la classe ".show" de l'élément ".select-search-container"
          //   selectSearchContainer.classList.remove("show");
          // });

          // ----------
          // ----------
          // ----------

          // // TODO chercher dans les 3 menu si l'un n'est pas close auquel cas faire le toggle sur les 4 elements en modifiant le code suivant

          // // Récupérer l'élément parent ".select-container" de l'élément ".select-header" cliqué
          // const selectContainer = header.parentElement;

          // // Récupérer l'élément ".select-search-container" enfant de l'élément parent
          // const selectSearchContainer = selectContainer.querySelector(
          //   ".select-search-container"
          // );
          // // icone ˄
          // const up = selectContainer.querySelector(".fa-angle-up");
          // // icone ˅
          // const down = selectContainer.querySelector(".fa-angle-down");

          // // toggle la classe ".show" de l'élément ".select-search-container" le corps du menu
          // selectSearchContainer.classList.toggle("show");
          // // toggle la classe ".close" de l'élément ".select-container" l'entête du menu
          // selectContainer.classList.toggle("close");

          // // up affiché menu ouvert ˄
          // up.classList.toggle("hide");
          // // down affiché menu fermé ˅
          // down.classList.toggle("hide");
        }
      }
    }
  }

  // METHOD POUR TRIER LES RECETTES
  trimRecipeList(searchArray, tagArray) {
    // copie de toutes les recettes  dans la liste de résultat
    let resultArray = [...this.fetchedRecipesData];

    // itéartion sur la liste des recettes
    this.fetchedRecipesData.forEach((recipe) => {
      // 1) INGREDIENTS - variable pour stocker la liste des ingredients
      let ingredientsString = "";
      // itération sur chaque ingrédient pour créer un sting de la liste des ingredients séparées par un espace
      recipe.ingredients.forEach((ingredient) => {
        const thisIngredient = ingredient.ingredient.toLowerCase();
        ingredientsString = ingredientsString.concat(" ", thisIngredient);
      });
      // création de l'array listant les mots des ingredients de la recette
      const recipeIngredientsArray = this.stringToArray(ingredientsString);

      // 2) APPAREILS - variable pour stocker la liste des appareils
      const appliancesArray = this.stringToArray(recipe.appliance);

      // 3) USTENSILES - variable pour stocker la liste des ustensiles
      const ustensilsArray = this.stringToArray(recipe.ustensils.join(" "));

      // 4) TITRE - création de l'array listant les mots du titre de la recette
      const recipeNameArray = this.stringToArray(recipe.name);

      // 5) DESCRIPTION - création de l'array listant les mots de la description de la recette
      const recipeDescriptionArray = this.stringToArray(recipe.description);

      // concaténation de tous les mots à vérifier (ingrédients, appareils, ustensiles, titre, description) pour valider la recette dans un seul tableau
      const recipeArray = recipeIngredientsArray.concat(
        appliancesArray,
        ustensilsArray,
        recipeNameArray,
        recipeDescriptionArray
      );

      // concaténation des mots de la barre de recherche et des tags
      const searchTerms = searchArray.concat(tagArray);

      // vérification que CHAQUE mot de la recherche est inclus dans la liste de mot de la recette
      searchTerms.forEach((term) => {
        if (
          // si l'un des mots est absent, la recette doit être supprimée du tableau des résultats
          !recipeArray.includes(term)
        ) {
          // recherche de l'index de la recette à supprimer
          const index = resultArray.indexOf(recipe);

          // supression de la recette via son index
          if (index != -1) {
            resultArray.splice(index, 1);
          }
        }
        // si le mot est présent la recette doit être conservée dans le tabelau des résultats
      });
    });

    console.log(
      "🚀 \n file: App.js:270 \n trimRecipeList \n resultArray\n",
      resultArray
    );

    // retourne un tableau des résultats
    return resultArray;
  }

  // METHOD POUR AFFICHER LES RECETTES
  showRecipes(recipeData) {
    // vide le champs des résultats
    this.$recipesWrapper.innerHTML = "";

    // map de chaque recette pour appliquer la classe Recipe
    const Recipes = recipeData.map((recipe) => new Recipe(recipe));

    // itération sur chaque recette
    Recipes.forEach((recipe) => {
      // pour chaque recette ajout de la classe RecipeCard
      const Template = new RecipeCard(recipe);
      // création de chaque card via la method createRecipeCard et l'ajouter au parent $recipesWrapper
      this.$recipesWrapper.appendChild(Template.createRecipeCard());
    });

    //affichage du nombre de recettes
    const resultsNumberWrapper = document.querySelector(".results-number");

    if (
      // si 1 seule recette, singulier
      recipeData.length === 1
    ) {
      resultsNumberWrapper.innerHTML = `1 recette`;
    } else if (
      // si plusieur recettes, pluriel
      recipeData.length > 1
    ) {
      resultsNumberWrapper.innerHTML = `${recipeData.length} recettes`;
    }
  }

  // METHOD POUR AFFICHER LES TAGS CORRESPONDANT A UNE LISTE DE RECETTES
  fillFiltersLists(recipeData) {
    // applique la classe RecipesData à la liste de recette
    const EnhancedRecipes = new RecipesData(recipeData);

    // création des 3 listes de tags et ajout de la classe ListBuilder
    const ListBuilder = new FilterList(
      EnhancedRecipes.getIngredientsList(),
      EnhancedRecipes.getAppliancesList(),
      EnhancedRecipes.getUstensilsList()
    );

    // Création des des tags grace à la method fillFiltersLists
    ListBuilder.fillFiltersLists();
  }

  // METHOD POUR LA SUPPRESSION DES MAJUSCULES ET DES CARACTERES ACCENTUES
  normalize(string) {
    // si le string n'est pas vide
    if (string.length > 0) {
      // supression des caractères accentués
      string = string.normalize("NFD").replace(/\p{Diacritic}/gu, "");
      return string.toLowerCase();
    } else {
      // si le string est vide
      return string;
    }
  }

  // METHOD POUR TRANSFORMER UN STRING EN ARRAY
  stringToArray(string) {
    // supression des caractères accentués
    string = this.normalize(string);

    // ajout des mots de plus de 3 caractères à un array
    string = string.match(/\b([A-zÀ-ú]{3,})\b/g);

    if (string === null) {
      // retourne un array vide si pas de mots de plus de 3 caractères
      return [];
    } else {
      return string;
    }
  }

  // METHOD POUR LIMITER LES VUNLERABILITES XSS
  escape(string) {
    return string
      .replace(/&/g, "")
      .replace(/</g, "")
      .replace(/>/g, "")
      .replace(/"/g, "")
      .replace(/'/g, "&#39;");
    // remplace les "&", "<", ">", """, "'" par leur codes unicode
  }

  // METHOD POUR LA GESTION DES INTERACTIONS SUR LES TAGS
  optionSelection() {
    // ciblage du container des tags ingrédients
    const ingredientsOptionsContainer = document.querySelector(
      "#ingredientsOptions"
    );
    // ciblage du container des tags appareils
    const appliancesOptionsContainer =
      document.querySelector("#appliancesOptions");
    // ciblage du container des tags ustensils
    const ustensilsOptionsContainer =
      document.querySelector("#ustensilsOptions");
    // tableau des 3 container des 3 types de tags
    const filterOptionsContainer = [
      ingredientsOptionsContainer,
      appliancesOptionsContainer,
      ustensilsOptionsContainer,
    ];

    // itéaration sur chacun des 3 containers de tags
    filterOptionsContainer.forEach((optionContainer) => {
      //node list de tous les tags
      const filterOptions = optionContainer.querySelectorAll(".select-option");

      // itération sur chaque tag
      filterOptions.forEach((option) => {
        // ajout d'un écouteur de click
        option.addEventListener("click", (e) => {
          // tag clické
          const selectOptions = e.target;
          // zone d'affichage des tags séléctionné
          const $wrapper = optionContainer.parentNode.querySelector(
            ".selected-container"
          );

          // // ajout du string du tag séléctionné à la liste des tags séléctionnés
          // this.selectedTags = this.selectedTags.concat(
          //   " ",
          //   selectOptions.innerText
          // );

          // 1) afficher du tag en tête de liste

          // création  du container du tag
          const selectedWrapper = document.createElement("div");
          selectedWrapper.classList.add("select-wrapper");
          // création de l'element p du tag
          const selectedOption = document.createElement("p");
          selectedOption.innerText = selectOptions.innerText;
          selectedOption.classList.add("select-option", "selected-option");
          // création de l'element i du tag
          const close = document.createElement("i");
          close.classList.add("fa-solid", "fa-x");
          // ajout des elements à leur container
          selectedWrapper.appendChild(selectedOption);
          selectedWrapper.appendChild(close);
          $wrapper.appendChild(selectedWrapper);

          // 2) afficher du tag en dessous des listes
          // zone d'affichage des tags séléctionnés
          const tagContainer = document.querySelector(".tag-container");
          // création  du tag
          const tagWrapper = document.createElement("div");
          tagWrapper.classList.add("tag-card");
          const tag = document.createElement("p");
          tag.classList.add("tag");
          tag.innerText = selectOptions.innerText;
          const closeTag = document.createElement("i");
          closeTag.classList.add("fa-solid", "fa-x");
          tagWrapper.appendChild(tag);
          tagWrapper.appendChild(closeTag);
          tagContainer.appendChild(tagWrapper);

          // // 3) lancement d'une recherche

          console.log("nouvelle recherche inité par ajout d'un tag");
          this.globalSearch();

          // // utilisation de la method mainSearch sur la liste de recette en cours avec la liste de tags et actualisation de la liste de recette
          // this.currentRecipesList = this.mainSearch(
          //   this.currentRecipesList,
          //   this.selectedTags
          // );

          // // utilisation de la method showRecipes pour afficher les recettes
          // this.showRecipes(this.currentRecipesList);
          // // utilisation de la method fillFiltersLists pour afficher les tags correspondants aux recettes affichées
          // this.fillFiltersLists(this.currentRecipesList);
          // // utilisation de la method optionSelection pour rendre possible la séléction des tags précédements affichés
          // this.optionSelection();

          // 4) suppression de la / des option(s) séléctionnées de la liste des tags

          // a) lister les tags à masquer
          // liste des tags séléctionnés
          const tagsToHide = $wrapper.querySelectorAll(".select-wrapper");

          // b) masquer les tags de la liste tagsToHide
          // itération sur les tags
          tagsToHide.forEach((tag) => {
            // string du tag à masquer
            const tagName = tag.querySelector("p").innerText;

            // liste des tags disponibles à vérifier
            const tagToCheck = $wrapper.parentElement.querySelectorAll(
              ".select-option:not(.selected-option)"
            );

            tagToCheck.forEach((tag) => {
              // si le nom du tag correspond au tag à masquer
              if (tagName == tag.innerText) {
                // appliquer la classe hide pour masquer le tag
                tag.classList.add("hide");
              }
            });
          });

          // 5) gérer la supression de l'option

          //nodeList des tags haut
          const tagCardList2 = document.querySelectorAll(".select-wrapper i");

          // au click sur chaque tag de la liste jouer la method deleteTag
          tagCardList2.forEach((tag) => {
            tag.addEventListener("click", (e) => {
              this.deleteTag(e);
            });
          });

          //nodeList des tags bas
          const tagCardList = document.querySelectorAll(".tag-card i");

          // au click sur chaque tag de la liste jouer la method deleteTag
          tagCardList.forEach((tag) => {
            tag.addEventListener("click", (e) => {
              this.deleteTag(e);
            });
          });
        });
      });
    });
  }

  // METHOD POUR LA SUPPRESSION D'UN TAG SELECTIONNE [appliqué via la method optionSelection()]
  deleteTag(e) {
    // container du tag clické
    const tagContainer = e.target.parentElement;
    // string du tag clické
    const tagName = tagContainer.querySelector("p").innerText;

    // // supprime le tag de la liste de tags
    // this.selectedTags = this.selectedTags.replace(tagName, "");

    // // comportement suivant le nombre de tags

    // if (
    //   // CAS 1 : s'il reste des tags après suppression du tag à supprimer
    //   this.selectedTags.replace(/\s/g, "").length > 1
    // ) {
    //   // utilisation de la method mainSearch sur la liste de recette en cours avec la liste de tags préalablement actualisée et actualisation de la liste de recette
    //   this.currentRecipesList = this.mainSearch(
    //     this.fetchedRecipesData,
    //     this.selectedTags
    //   );
    //   // utilisation de la method showRecipes pour afficher les recettes
    //   this.showRecipes(this.currentRecipesList);
    //   // utilisation de la method fillFiltersLists pour afficher les tags correspondants aux recettes affichées
    //   this.fillFiltersLists(this.currentRecipesList);
    //   // utilisation de la method optionSelection pour rendre possible la séléction des tags précédements affichés
    //   this.optionSelection();
    // }
    // // CAS 2 : absence de tags après suppression du tag à supprimer
    // else {
    //   // reset de la liste de recette en cours
    //   this.currentRecipesList = this.fetchedRecipesData;
    //   // utilisation de la method launchStringSearch pour lancer une recherche en fonction du contenu de la barre de recherche
    //   this.launchStringSearch(this.searchString);
    // }

    // suppression visuelle du tag supprimé

    // selection des zone de tags haut
    const tagTopContainer = document.querySelectorAll(".selected-container");
    // itération sur les zones de tags haut
    tagTopContainer.forEach((container) => {
      // selection des tags séléctionés
      const topP = container.querySelectorAll("p");
      // itération sur les tags séléctionés
      topP.forEach((p) => {
        // vérification de la correspondance avec le tag clické (à supprimer)
        if (p.innerText == tagName) {
          // suppression du container du tag
          p.parentElement.remove();
        }
      });
    });

    // selection de la zone de tag bas
    const tagBottomContainer = document.querySelector(".tag-container");
    // selection des tags séléctionés
    const bottomP = tagBottomContainer.querySelectorAll("p");
    bottomP.forEach((p) => {
      // vérification de la correspondance avec le tag clické (à supprimer)
      if (p.innerText == tagName) {
        // suppression du container du tag
        p.parentElement.remove();
      }
    });

    // lancer une nouvelle recherche et afficher les recettes
    this.globalSearch();
  }

  // METHOD POUR TRIER LES TAGS
  optionTrimmer(option, value) {
    console.log("🚀 \n file: App.js:687 \n optionTrimmer \n option\n", option);
    console.log("🚀 \n file: App.js:687 \n optionTrimmer \n value\n", value);

    const selectOptionsContainer = option.parentNode.parentNode.querySelector(
      ".select-options-container"
    );

    const selectOptions =
      selectOptionsContainer.querySelectorAll(".select-option");

    selectOptions.forEach((option) => {
      option.style.display = "block";
      if (!this.normalize(option.innerText).includes(value)) {
        option.style.display = "none";
      }
    });
  }

  // METHOD POUR PERMETTRE D'EFFACER UNE BARRE DE RECHERCHE
  deleteInput(buttonElement, tagSearchBar) {
    console.log(
      "🚀 \n file: App.js:707 \n deleteInput \n tagSearchBar\n",
      tagSearchBar
    );

    // affiche le bouton d'action
    buttonElement.classList.remove("hide");

    // ajoute l'ecouteur de click
    buttonElement.addEventListener("click", () => {
      // cible la textarea dans l'element parent
      const textarea = buttonElement.parentElement.querySelector("textarea");
      // efface le contenu de la textarea
      textarea.value = "";

      // masque le bouton d'action
      buttonElement.classList.add("hide");

      if (tagSearchBar === undefined) {
        console.log("EFFACEMENT MAIN SEARCH");
        // lancement d'une recherche
        this.globalSearch();
      } else {
        console.log("EFFACEMENT TAG SEARCH");

        // TODO ici les tags doivent tous réapparaître une fois la search bar vidée

        // affiche l'ensemble des tags
        this.optionTrimmer(tagSearchBar, "");
      }
    });
  }
}

const app = new App();
app.main();
