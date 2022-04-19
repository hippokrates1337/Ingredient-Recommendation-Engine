<script>
    export let recommendations
    export let algorithm
</script>

<div>
    <label class="h6 text-primary mb-2" for="list_ingredientrecs" id="label_ingredientrecs">
        Recommended ingredients based on {algorithm}:
    </label>
    <ul class="list-group" role="list" id="list_ingredientrecs" aria-labelledby="label_ingredientrecs">
        {#each recommendations as rec}
            <li class="list-group-item list-group-item-info list-group-item-action">
                {rec[0]}
            </li>
        {/each}
    </ul>
</div>