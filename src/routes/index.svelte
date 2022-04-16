<script>
	export const prerender = true;

	import AddIngredient from "$lib/AddIngredient.svelte"
	import IngredientQuery from "$lib/IngredientQuery.svelte"

	let ingredients = []

	const addIngredient = (ingredient) => {
		ingredients = [...ingredients, ingredient]
	}
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<AddIngredient on:add={e => addIngredient(e.detail)} />
<IngredientQuery {ingredients} />