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
                        amount: 0.25
                    },
                    {
                        ingredient_name: "Tea",
                        amount: 0.8
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
                        amount: 1.25
                    }
                ]
            }
        ])
    }
}

export { add_test_recipes };