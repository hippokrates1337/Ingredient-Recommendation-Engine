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

	const addIngredient = async (ingredient) => {
		ingredients = [...ingredients, ingredient]
	}
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<main>
	<AddIngredient on:add={e => addIngredient(e.detail)} />
	<IngredientQuery {ingredients} />
	<IngredientRecommendations {recommendations} algorithm="popularity" />
</main>