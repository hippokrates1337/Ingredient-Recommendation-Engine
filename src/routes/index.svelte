<script context="module">	
	export async function load({fetch}) {
		const res = await fetch("/recommendations")
		if(res.ok) {
			const data = await res.json()
			return {props: {popular_recommendations: data["rec_popular"]["recommendations"], numRecipesPopular: data["rec_popular"]["numRecipes"], allowed_ingredients: data.allowed_ingredients}}
		} else {
			return {
				status: res.status,
				error: new Error()
			}
		}
	}
</script>

<script>
	import AddIngredient from "$lib/AddIngredient.svelte"
	import IngredientQuery from "$lib/IngredientQuery.svelte"
	import IngredientRecommendations from "$lib/IngredientRecommendations.svelte"
	import CategorySelection from "$lib/CategorySelection.svelte"

	export const prerender = true;

	export let popular_recommendations = []
	export let nn_recommendations = []
	export let allowed_ingredients = []
	export let numRecipesPopular = 0
	let numRecipesNN = 0
	let ingredients = []
	let filter = "allCategories"
	let categoriesSelected = []

	const updateIngredients = async () => {
		let query = "/recommendations/" + ingredients.join("+")
		query = query + "--" + filter + "+" + categoriesSelected
		const res = await fetch(query)
		if(res.ok) {
			const data = await res.json()
			popular_recommendations = data["rec_popular"]["recommendations"]
			numRecipesPopular = data["rec_popular"]["numRecipes"]
			nn_recommendations = data["rec_nn"]["recommendations"]
			numRecipesNN = data["rec_nn"]["numRecipes"]
		}
	}

	const addIngredient = async (ingredient) => {
		ingredients = [...ingredients, ingredient]
		await updateIngredients()
	}

	const removeIngredient = async (ingredient) => {
		ingredients = ingredients.filter(i => i != ingredient)
		await updateIngredients()
	}

	const updateFilter = async (f) => {
		filter = f
		await updateIngredients()
	}

	const updateCategoriesSelected = async (c) => {
		categoriesSelected = c
		await updateIngredients()
	}
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<header>
	<div class="bg-dark collapse" id="navbarHeader">
		<div class="container">
			<div class="row">
				<h4 class="text-white">
					About
				</h4>
				<p class="text-muted">
					Get ingredient recommendations based on what combinations other people make. 
					Enter ingredients below and see what kind of foods are often used together.
				</p>
			</div>
		</div>
	</div>
	<div class="navbar navbar-dark bg-dark shadow-sm">
		<div class="container">
			<strong class="text-white">
				Ingredient recommendation engine
			</strong>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarHeader"
			aria-controls="navbarHeader" aria-expanded="true" aria-label="expand navigation">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-in-up text-white" viewBox="0 0 16 16">
					<path fill-rule="evenodd" d="M3.5 10a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 0 0 1h2A1.5 1.5 0 0 0 14 9.5v-8A1.5 1.5 0 0 0 12.5 0h-9A1.5 1.5 0 0 0 2 1.5v8A1.5 1.5 0 0 0 3.5 11h2a.5.5 0 0 0 0-1h-2z"/>
					<path fill-rule="evenodd" d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"/>
			  	</svg>
			</button>
		</div>
	</div>
</header>

<main>
	<section class="py-5 text-center container">
		<div class="row py-lg-5">
			<div class="col-lg-6 col-md-8 mx-auto">
				<AddIngredient {allowed_ingredients} query_ingredients={ingredients} on:add={e => addIngredient(e.detail)} />
			</div>
		</div>
	</section>

	<div class="album py-5 bg-light">
		<div class="container">
			<div class="row g-3">
				<div class="col">
					<IngredientQuery {ingredients} on:remove={e => removeIngredient(e.detail)} />
					<CategorySelection categories="allCategories" on:filterChange={e => updateFilter(e.detail)} on:categoryChange={e => updateCategoriesSelected(e.detail)}/>
				</div>
				<div class="col">
					<IngredientRecommendations recommendations={popular_recommendations} algorithm="popularity" numRecipes={numRecipesPopular} on:add={e => addIngredient(e.detail)} />
				</div>
				<div class="col">
					<IngredientRecommendations recommendations={nn_recommendations} algorithm="similar recipes" numRecipes={numRecipesNN} on:add={e => addIngredient(e.detail)} />
				</div>
			</div>
		</div>
	</div>
</main>