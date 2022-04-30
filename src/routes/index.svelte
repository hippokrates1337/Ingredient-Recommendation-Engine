<script context="module">	
	export async function load({fetch}) {
		const res = await fetch("/recommendations")
		if(res.ok) {
			const data = await res.json()
			return {props: {popular_recommendations: data.rec_popular, allowed_ingredients: data.allowed_ingredients}}
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

	export const prerender = true;

	export let popular_recommendations = []
	export let nn_recommendations = []
	export let allowed_ingredients = []
	let ingredients = []

	const updateIngredients = async () => {
		let query = "/recommendations/" + ingredients.join("+")
		const res = await fetch(query)
		if(res.ok) {
			const data = await res.json()
			popular_recommendations = data.rec_popular
			nn_recommendations = data.rec_nn
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
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<main>
	<div class="container p-4 bg-primary text-white text-center">
		<h1>Ingredient Recommendation Engine</h1>
		<p>Get ingredient recommendations based on what combinations other people make. 
			Enter ingredients below and see what kind of foods are often used together. </p>
	</div>
	<div class="container bg-light p-3 border border-primary">
		<div class="row">
			<div class="col-md-4">
				<AddIngredient {allowed_ingredients} query_ingredients={ingredients} on:add={e => addIngredient(e.detail)} />
				<IngredientQuery {ingredients} on:remove={e => removeIngredient(e.detail)} />	
			</div>
			<div class="col-md-8">
				<IngredientRecommendations recommendations={popular_recommendations} algorithm="popularity" on:add={e => addIngredient(e.detail)} />
				<IngredientRecommendations recommendations={nn_recommendations} algorithm="similar recipes" on:add={e => addIngredient(e.detail)} />
			</div>			
		</div>
	</div>
</main>