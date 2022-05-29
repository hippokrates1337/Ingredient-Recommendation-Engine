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
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </li>
            {/each}
        </ul>
        {/if}
    </div>
</div>