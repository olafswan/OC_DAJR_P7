class Recipe {
  constructor(recipes) {
    this._id = recipes.id;
    this._image = recipes.image;
    this._name = recipes.name;
    this._servings = recipes.servings;
    this._ingredients = recipes.ingredients;
    this._time = recipes.time;
    this._description = recipes.description;
    this._appliance = recipes.appliance;
    this._ustensils = recipes.ustensils;
  }

  get id() {
    return this._id;
  }

  get image() {
    return `/assets/recipes/${this._image}`;
  }

  get name() {
    return this._name;
  }

  get servings() {
    return this._servings;
  }

  get ingredients() {
    return this._ingredients;
  }

  get time() {
    return this._time;
  }

  get description() {
    return this._description;
  }

  get appliance() {
    return this._appliance;
  }

  get ustensils() {
    return this._ustensils;
  }
}
