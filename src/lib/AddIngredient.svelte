<script>
    import {createEventDispatcher} from "svelte"
import { set_input_value } from "svelte/internal";
    const dispatch = createEventDispatcher()

    export let allowedIngredients
    export let queryIngredients
    let errorMsg = ""
    let ingredient = ""
    let filteredIngredients = []
    let highlightIndex = null

    const onAdd = () => {
        if(!allowedIngredients.includes(ingredient)) {
            errorMsg = "Ingredient not contained in database"
        } else if(queryIngredients.includes(ingredient)) {
            errorMsg = "Ingredient already in your query"
        } else {
            dispatch("add", ingredient)
            ingredient = ""
        }
    }

    const filterIngredients = () => {
        errorMsg = ""

        let storage = []
        if(ingredient) {
            allowedIngredients.forEach(ing => {
                if(ing.toLowerCase().startsWith(ingredient.toLowerCase())) {
                    storage = [...storage, makeMatchBold(ing)]
                }
            })
        }

        filteredIngredients = storage
    }

    const makeMatchBold = (str) => {
        let matched = str.substring(0, ingredient.length)
        let makeBold = "<strong>" + matched + "</strong>"
        let boldedMatch = str.replace(matched, makeBold)
        return boldedMatch
    }

    const navigateList = (e) => {
        console.log(highlightIndex)
        if(e.key === "ArrowDown" && highlightIndex <= filteredIngredients.length - 1) {
            highlightIndex === null ? highlightIndex = 0 : highlightIndex += 1
        } else if(e.key === "ArrowUp" && highlightIndex != null) {
            highlightIndex === 0 ? highlightIndex = filteredIngredients.length - 1 : highlightIndex -= 1
        } else if(e.key === "Enter") {
            setInputVal(filteredIngredients[highlightIndex])
        }
    }

    const setInputVal = (ing) => {
        ingredient = ing.replace(/<(.)*?>/g, "")
        filteredIngredients = []
        highlightIndex = null
        document.querySelector("#input_addingredient").focus()
    }
</script>

<svelte:window on:keydown={navigateList} />

<form on:submit|preventDefault={onAdd}>
    <div class="form-floating mb-2">
        <input type="text" class="form-control" autocomplete="off" 
            bind:value={ingredient}
            on:input={filterIngredients}
            id="input_addingredient" placeholder="Zimt" />
        <label class="form-label" for="input_addingredient" id="label_addingredient">
            Add an ingredient to your selection:
        </label>
    </div>
    {#if filteredIngredients.length > 0}
        <ul id="filteredIngredientsList">
            {#each filteredIngredients as ing, i}
                <li class="autocompleteItems" class:autocompleteActive={i === highlightIndex} on:click={() => setInputVal(ing)}>{@html ing}</li>
            {/each}
        </ul>
    {/if}
    {#if errorMsg}
        <div class="alert alert-danger fade show d-flex align-items-center" id="errorAlert">
            <i class="bi-exclamation-octagon-fill" />
            &nbsp;{errorMsg}
        </div>
    {/if}
    <div class="d-grid mt-1">
        <button class="btn btn-primary btn-block" type="submit" disabled={errorMsg != ""}>Add</button>
    </div>
</form>

<style>
    #filteredIngredientsList {
        position: relative;
        margin: 0;
        padding: 0;
        top: 0;
        border: solid 1px #ddd;
        background-color: #ddd;
    }
    li.autocompleteItems {
        list-style: none;
        border-bottom: 1px solid #d4d4d4;
        z-index: 99;
        top: 100%;
        left: 0;
        right: 0;
        padding: 10px;
        cursor: pointer;
        background-color: #fff;
    }
    li.autocompleteItems:hover {
        background-color: #0d6efd;
        color: white;
    }
    li.autocompleteItems:active {
        background-color: dodgerblue !important;
        color: #ffffff;
    }
    .autocompleteActive {
        background-color: dodgerblue !important;
        color: #ffffff;
    }
</style>