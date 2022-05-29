<script>
    import {createEventDispatcher} from "svelte"
    const dispatch = createEventDispatcher()

    export let recommendations = []
    export let algorithm = ""
    export let numRecipes = 0

    const addIngredient = (rec) => {
        dispatch("add", rec)
    }
</script>

<div class="card shadow-sm p-1">
    <h5 class="card-title text-primary text-center"> Recommendations ({algorithm})</h5>
    <p class="text-muted text-center small">Based on {numRecipes.toLocaleString("en-IN")} recipes</p>
    <div class="card-body">
        {#if recommendations.length == 0}
            <p class="text-muted">No recommendations available
            </p>
        {:else}
        <ul class="list-group list-group-flush" role="list" id="list_ingredientrecs" aria-labelledby="label_ingredientrecs">
            {#each recommendations as rec}
                <li class="list-group-item list-group-item-action">
                    <div class="row">
                        <div class="col-md-10 my-auto">
                            {rec[0]}
                        </div>
                        <div class="col-md-2 text-end">
                            <button class="btn btn-sm shadow-none" type="button" on:click={() => addIngredient(rec[0])}>
                                <i class="bi bi-plus-circle-fill" />
                            </button>
                        </div>
                    </div>
                </li>
            {/each}
        </ul>
        {/if}
    </div>
</div>