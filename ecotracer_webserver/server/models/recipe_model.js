"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecipes = exports.add_test_recipes = void 0;
const DrinkRecipes = require('../schemas/drink_recipe');
// INITIALISE SOME MAIN DRINKS FOR TESTING
const add_test_recipes = () => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield DrinkRecipes.count()) == 0) {
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
        ]);
    }
});
exports.add_test_recipes = add_test_recipes;
function getRecipes() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let recipes = DrinkRecipes.find();
            return recipes[recipes.length - 1];
        }
        catch (error) {
            console.log(error);
            return null;
        }
    });
}
exports.getRecipes = getRecipes;
