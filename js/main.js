let rowBody = document.getElementById("rowBody");
let dropdownItems = document.querySelectorAll(".dropdown-item");
let loading = document.getElementById("loading");
let recipeDetails = document.getElementById('recipe-details');
let recipeContent = document.getElementById('recipe-content');
let backBtn = document.getElementById('back-btn');


// Function to show loader
function showLoader() {
  loading.classList.remove("d-none");
}

// Function to hide loader
function hideLoader() {
  loading.classList.add("d-none");
}

// Async function to get meals
async function getMeals(query = "pizza") {
  showLoader();
  rowBody.innerHTML = '';
  recipeDetails.classList.add('d-none');

    let data = await fetch(`https://forkify-api.herokuapp.com/api/search?q=${query}`);
    let meals = await data.json();
    let res = meals.recipes;
    console.log(res);
    display(res);
    hideLoader();
}

// Function to display recipes
function display(arr) {
  if (!arr || arr.length === 0) {
    displayError('No recipes found.');
    return;
  }

  let box = '';
  for (let i = 0; i < arr.length; i++) {
    box += `
      <div class="col-md-3 col-sm-6 mb-4">
        <div class="card recipe-card h-100" data-id="${arr[i].recipe_id}">
          <img src="${arr[i].image_url}" class="card-img-top" alt="..." />
          <div class="card-body d-flex flex-column">
            <p class="card-text flex-grow-1">${arr[i].title}</p>
            <button class="btn btn-pastel-purple mt-auto">View Recipe</button>
          </div>
        </div>
      </div>`;
  }
  rowBody.innerHTML = box;

  // Add click handlers to cards
  document.querySelectorAll('.recipe-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      loadRecipeDetails(id);
    });
  });
}

// Function to load recipe details
async function loadRecipeDetails(id) {
  showLoader();
    const response = await fetch(`https://forkify-api.herokuapp.com/api/get?rId=${id}`);
    const data = await response.json();
    const recipe = data.recipe;
    displayRecipeDetails(recipe);
    hideLoader();
}

// Function to display recipe details
function displayRecipeDetails(recipe) {
  recipeContent.innerHTML = `
    <img src="${recipe.image_url}" class="img-fluid rounded mb-3" alt="${recipe.title}" style="max-width: 400px;">
    <h2>${recipe.title}</h2>
    <p><strong>Publisher:</strong> ${recipe.publisher}</p>
    <p><strong>Source:</strong> <a href="${recipe.source_url}" target="_blank">${recipe.source_url}</a></p>
    <h3>Ingredients</h3>
    <ul class="list-group list-group-flush">
      ${recipe.ingredients.map(ing => `<li class="list-group-item">${ing}</li>`).join('')}
    </ul>
  `;
  document.getElementById('x').classList.add('d-none');
  recipeDetails.classList.remove('d-none');
}

// Back to recipes
backBtn.addEventListener('click', () => {
  recipeDetails.classList.add('d-none');
  document.getElementById('x').classList.remove('d-none');
});

// Handle dropdown item clicks
dropdownItems.forEach(function (item) {
  item.addEventListener("click", function (e) {
    e.preventDefault();
    let mealName = e.target.getAttribute('data-query');
    getMeals(mealName);
    // Update active class on dropdown toggle
    document.getElementById('categoriesDropdown').classList.add('active');
  });
});

// Display error
function displayError(message) {
  rowBody.innerHTML = `<div class="col-12"><p class="error">${message}</p></div>`;
  recipeDetails.classList.add('d-none');
}

// Load default recipes
getMeals();