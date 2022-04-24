import dotenv from "dotenv"
dotenv.config()

import {MongoClient} from "mongodb"

let client
let clientPromise

if(!process.env["MONGODB_URI"]) {
    throw new Error("Please add MongoDB URI to your .env configuration")
}

if(process.env["NODE_ENV"] === "development") {
    if(!global._mongoCLientPromise) {
        client = new MongoClient(process.env["MONGODB_URI"])
        global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
} else {
    client = new MongoClient(process.env["MONGODB_URI"])
    clientPromise = client.connect()
}

export default clientPromise

const countIngredients = (recipes) => {
    // Create a list of unique ingredients with their frequency
    let ingredients = {}
    for(const r of recipes) {
        for(const i of r["ingredients"]) {
            if(i in ingredients) {
                ingredients[i]++
            } else {
                ingredients[i] = 1
            }
        }
    }

    // Convert into array in order to sort by frequency (descending)
    let frequencies = []
    for(var key in ingredients) {
        frequencies.push([key, ingredients[key]])
    }
    frequencies.sort((a, b) => {
        return a[1] < b[1] ? 1 : -1
    })

    return frequencies
}

export const retrievePopularIngredients = async () => {
    const dbConnection = await clientPromise
    const db = await dbConnection.db()
    const collection = await db.collection("recipes_ingredients")
    let recipes = await collection.find({}).toArray()

    if(recipes.length === 0) {
        return {status: 500, body: {}}
    }

    return {
        status: 200,
        body: {rec_popular: countIngredients(recipes).slice(0, 10), rec_nn: []}
    }
}

export const retrievePopularRecommendations = async (query) => {
    let ingredients = query.split("+")
    
    const dbConnection = await clientPromise
    const db = await dbConnection.db()
    const collection = await db.collection("recipes_ingredients")
    let recipes = await collection.find({ingredients: {$all: ingredients}}).toArray()

    // Remove the query ingredients from the returned recommendations
    let recommendations = countIngredients(recipes)
    recommendations = recommendations.filter(r => !ingredients.includes(r[0]))

    return recommendations.slice(0, 10)
}

export const retrieveNNRecommendations = async (query) => {
    let ingredients = query.split("+")

    const dbConnection = await clientPromise
    const db = await dbConnection.db()
    const collection = await db.collection("recipes_ingredients")
    let recipes = await collection.find({ingredients: {$all: ingredients}}).toArray()

    // If there is no recipe that has this combination of ingredients, randomly remove an ingredient and try again
    let idx = ingredients.length - 1
    while(recipes.length == 0 && idx > 0) {
        console.log("Trying with less ingredients")
        recipes = await collection.find({ingredients: {$all: ingredients.slice(0, idx)}}).toArray()
        idx--
    }

    // Pick a random recipe and retrieve similar recipes to this one
    let recipe_ids = recipes[Math.floor(Math.random() * recipes.length)]["similar_recipes"]
    recipes = await collection.find({id: {$in: recipe_ids}}).toArray()
    
    // Remove the query ingredients from the returned recommendations
    let recommendations = countIngredients(recipes)
    recommendations = recommendations.filter(r => !ingredients.includes(r[0]))

    return recommendations.slice(0, 10)
}

export const retrieveRecommendations = async (query) => {
    let rec_1 = await retrievePopularRecommendations(query)
    let rec_2 = await retrieveNNRecommendations(query)
    
    return {
        status: 200,
        body: {rec_popular: rec_1, rec_nn: rec_2}
    }
}