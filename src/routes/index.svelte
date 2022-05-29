<script context="module">	
	export async function load({fetch}) {
		const res = await fetch("/ingredients")
		if(res.ok) {
			const data = await res.json()
			return {props: {popularRecommendations: data["recommendations"], numRecipesPopular: data["numRecipes"], allowedIngredients: data["allowedIngredients"]}}
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

	export let popularRecommendations = []
	export let nnRecommendations = []
	export let allowedIngredients = []
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
			popularRecommendations = data["recPopular"]["recommendations"]
			numRecipesPopular = data["recPopular"]["numRecipes"]
			nnRecommendations = data["recNN"]["recommendations"]
			numRecipesNN = data["recNN"]["numRecipes"]
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
				<i class="bi bi-info-circle" />
			</button>
		</div>
	</div>
</header>

<main>
	<section class="py-5 text-center container">
		<div class="row py-lg-5">
			<div class="col-lg-6 col-md-8 mx-auto">
				<AddIngredient {allowedIngredients} queryIngredients={ingredients} on:add={e => addIngredient(e.detail)} />
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
					<IngredientRecommendations recommendations={popularRecommendations} algorithm="popularity" numRecipes={numRecipesPopular} on:add={e => addIngredient(e.detail)} />
				</div>
				<div class="col">
					<IngredientRecommendations recommendations={nnRecommendations} algorithm="similar recipes" numRecipes={numRecipesNN} on:add={e => addIngredient(e.detail)} />
				</div>
			</div>
		</div>
	</div>
</main>