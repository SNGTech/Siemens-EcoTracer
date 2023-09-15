const DrinkRecipes = require('../schemas/drink_recipe');

// INITIALISE SOME MAIN DRINKS FOR TESTING
const add_test_recipes = async () => { 
    if(await DrinkRecipes.count() == 0) {
        DrinkRecipes.insertMany([
            {
                name: "Black Tea",
                ingredients: [
                    {
                        ingredient_name: "Water",
                        amount: 0.05
                    },
                    {
                        ingredient_name: "Tea",
                        amount: 0.09
                    },
                    {
                        ingredient_name: "Milk",
                        amount: 0
                    }
                ]
            },
            {
                name: "Cow's Milk",
                ingredients: [
                    {
                        ingredient_name: "Water",
                        amount: 0
                    },
                    {
                        ingredient_name: "Tea",
                        amount: 0
                    },
                    {
                        ingredient_name: "Milk",
                        amount: 0.2
                    }
                ]
            }
        ])
    }
}

async function getRecipes() {
    try {
        let recipes = DrinkRecipes.find();
        return recipes[recipes.length - 1];
    } catch (error) {
        console.log(error);
        return null;
    }
}

export { add_test_recipes, getRecipes };