<script>
    export let ingredients = []
</script>

<div>
    <label for="list_ingredientquery" id="label_ingredientquery">
        Ingredients currently in your query:
    </label>
    <ul role="list" id="list_ingredientquery" aria-labelledby="label_ingredientquery">
        {#each ingredients as ingredient}
            <li>
                {ingredient}
            </li>
        {/each}
    </ul>
</div>