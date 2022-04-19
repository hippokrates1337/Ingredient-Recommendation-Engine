<script context="module">	
	export async function load({fetch}) {
		const res = await fetch("/recommendations")
		if(res.ok) {
			const data = await res.json()
			return {props: {recommendations: data.result}}
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

	export let recommendations = ""
	let ingredients = []

	const updateIngredients = async () => {
		let query = "/recommendations/" + ingredients.join("+")
		const res = await fetch(query)
		if(res.ok) {
			const data = await res.json()
			recommendations = data.result
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
				<AddIngredient on:add={e => addIngredient(e.detail)} />
				<IngredientQuery {ingredients} on:remove={e => removeIngredient(e.detail)} />	
			</div>
			<div class="col-md-8">
				<IngredientRecommendations {recommendations} algorithm="popularity" />
				<IngredientRecommendations {recommendations} algorithm="similar recipes (DUMMY)" />
			</div>			
		</div>
	</div>
</main>