//for opening sidebar
function openNavigation() 
{
    document.getElementById("side").style.width = "500px";
    document.getElementById("main-body").style.marginRight = "500px";
}
  
// for closing sidebar
function closeNavigation() 
{
    document.getElementById("side").style.width = "0";
    document.getElementById("main-body").style.marginRight = "0";
} 

//Making Faorites meal array if its not exits in local storage
if(localStorage.getItem("favouritesList") == null)
{
    localStorage.setItem("favouritesList", JSON.stringify([]));
}

//all global variable

 const MealItem = document.getElementById('meal');
 const mealDetailsContent = document.getElementById('meal-details-content');
 const recipeCloseBtn = document.getElementById('recipe-close-btn');
 
//Event Listener for closing recipe details page
recipeCloseBtn.addEventListener('click',()=>{
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// fetch api will search details from the mealdb api
async function fetchMealDetailsFromApi(url, inputValue)
{
    const show =await fetch(`${url+inputValue}`);
    const meals = await show.json();
    return meals;
}

//get meal list that matches with the mealdb api
function showMealList()
{
    // trim fucntion removes all spaces from text expect for single spaces between words
    let searchInpTxt = document.getElementById('search-input').value;
    
    //for favourite list 
    let arr=JSON.parse(localStorage.getItem("favouritesList"));
    
    let url="https://www.themealdb.com/api/json/v1/1/search.php?s=";

    // calling fetchMealDetailsFromApi function
    let meals=fetchMealDetailsFromApi(url, searchInpTxt); 

    meals.then(data =>
    {
        let html="";
        if(data.meals)
        {
            data.meals.forEach(meal => {
                let fav =false;
                for (let index = 0; index < arr.length; index++) 
                {
                    if(arr[index]==meal.idMeal){
                        fav =true;
                    }
                }
                // if food is present in favourites list then favourite btn will be active
                if(fav)
                {
                    html += `
                    <div class="meal-item">
                        <div class="meal-img">
                            <img src="${meal.strMealThumb}" alt=".........">
                        </div>
                    
                        <div class="meal-name">
                            <h3>${meal.strMeal}</h3>
                            <button id="main${meal.idMeal}" class="recipe-btn" onclick="showMealDetails(${meal.idMeal})">More Details...</button>
                            <button id="main${meal.idMeal}" class="like-btn active-color" onclick="addRemoveToFavList(${meal.idMeal})"><i class="fas fa-duotone fa-heart"></i></button>
                        </div>
                    </div>`;
                }
                // if food is not present in favourites list then favourite btn will be not active
                else
                {
                    html += `
                    <div class="meal-item">
                        <div class="meal-img">
                            <img src="${meal.strMealThumb}" alt=".........">
                        </div>
                    
                        <div class="meal-name">
                            <h3>${meal.strMeal}</h3>
                            <button id="main${meal.idMeal}" class="recipe-btn" onclick="showMealDetails(${meal.idMeal})">More Details...</button>
                            <button id="main${meal.idMeal}" class="like-btn" onclick="addRemoveToFavList(${meal.idMeal})"><i class="fas fa-duotone fa-heart"></i></button>
                        </div>
                    </div>`;
                }
            });
            MealItem.classList.remove('notFound');
        }
        else
        {
            html="Not Available";
            MealItem.classList.add('notFound');
        }
        MealItem.innerHTML = html;
    });
}

// show Mealdetails function
function showMealDetails(id)
{
    let url="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    
    // calling fetchMealDetailsFromApi function
    let details=fetchMealDetailsFromApi(url,id);

    details.then(data => mealRecipeDetails(data.meals));
}

// meal recipe details function
function mealRecipeDetails(meal)
{
    meal=meal[0];

    let html=`
            <h2 class="recipe-title">${meal.strMeal}</h2>
            <p class="recipe-category">Recipe Category: ${meal.strCategory}</p>
            <p class="recipe-category">Area: ${meal.strArea}</p>
            <div class="recipe-instruction">
                <h3>Instructions:</h3>
                <p>${meal.strInstructions}</p>
            </div>`;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}

// add and remove food in favourite list
function addRemoveToFavList(id)
{
    let arr=JSON.parse(localStorage.getItem("favouritesList"));
    let boxContain =false;
    
    for(let index=0; index <arr.length; index++)
    {
        if(id==arr[index])
        {
            boxContain=true;
        }
    }
    if(boxContain)
    {
        let number = arr.indexOf(id);
        arr.splice(number, 1);
        alert("Meal is Removed");
    }
    else
    {
        arr.push(id);
        alert("Meal Added");
    }
    localStorage.setItem("favouritesList", JSON.stringify(arr));
    showMealList();
    FavMeal()
}
 
// show favourite meal list
function FavMeal()
{
    let arr=JSON.parse(localStorage.getItem("favouritesList"));
    let url="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    const favBody=document.getElementById("favourites-body");
    let html="";

    // if food not available in favourites food list
    if (arr.length==0) 
    {
        html += `
            <div class="error-container">
                <span class="display-1 d-block">No Meal Added</span>
                <div class="mb-4 lead">
                    ........
                </div>
            </div>
            `;
        favBody.innerHTML=html;
    } 
    // if food available in favourites food list
    else 
    {
        for (let index = 0; index < arr.length; index++) 
        {
            // calling async function
            let favMeal=fetchMealDetailsFromApi(url,arr[index]);
            favMeal.then(data=>{
                let meal=data.meals[0];
                html += `
                    <div class="fav-meal-item">
                        <div class="fav-meal-img">
                            <img src="${meal.strMealThumb}" alt=".........">
                        </div>
                    
                        <div class="fav-meal-name-details">
                            <h3>${meal.strMeal}</h3>
                            <button id="main${meal.idMeal}" class="recipe-btn" onclick="showMealDetails(${meal.idMeal})">More Details...</button>
                            <button id="main${meal.idMeal}" class="like-btn active-color" onclick="addRemoveToFavList(${meal.idMeal})"><i class="fas fa-duotone fa-heart"></i></button>
                        </div>
                    </div>
                `;
                favBody.innerHTML = html;
            });   
        }
    }
   
}