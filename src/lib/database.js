import dotenv from "dotenv"
dotenv.config()

import {MongoClient} from "mongodb"

const uri = process.env["MONGODB_URI"]
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
}

let client
let clientPromise

if(!uri) {
    throw new Error("Please add MongoDB URI to your .env configuration")
}

if(process.env["NODE_ENV"] === "development") {
    if(!global._mongoCLientPromise) {
        client = new MongoClient(uri, options)
        global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
} else {
    client = new MongoClient(uri, options)
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
        body: {result: countIngredients(recipes).slice(0, 10)}
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

    return {
        status: 200,
        body: {result: recommendations}
    }
}