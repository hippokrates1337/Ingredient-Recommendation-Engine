<script>
    import {createEventDispatcher} from "svelte"
    const dispatch = createEventDispatcher()

    export let allowedIngredients
    export let query_ingredients
    let ingredient
    let errorMsg = ""

    const onAdd = () => {
        if(!allowedIngredients.includes(ingredient)) {
            errorMsg = "Ingredient not contained in database"
        } else if(query_ingredients.includes(ingredient)) {
            errorMsg = "Ingredient already in your query"
        } else {
            dispatch("add", ingredient)
            ingredient = ""
        }
    }
</script>

<form on:submit|preventDefault={onAdd}>
    <div class="form-floating">
        <input type="text" class="form-control" autocomplete="off" bind:value={ingredient} 
            on:input={() => errorMsg = ""}
            id="input_addingredient" placeholder="Zimt" />
        <label class="form-label" for="input_addingredient" id="label_addingredient">
            Add an ingredient to your selection:
        </label>
        {#if errorMsg}
            <span class="text-danger">{errorMsg}</span>
        {/if}
    </div>
    <div class="d-grid mt-1">
        <button class="btn btn-primary btn-block" type="submit" disabled={errorMsg.length > 0}>Add</button>
    </div>
</form>
