<script>
    export let recommendations
    export let algorithm
</script>

<div>
    <label for="list_ingredientrecs" id="label_ingredientrecs">
        Recommended ingredients based on {algorithm}:
    </label>
    <ul role="list" id="list_ingredientrecs" aria-labelledby="label_ingredientrecs">
        {#each recommendations as rec}
            <li>
                {rec[0]}
            </li>
        {/each}
    </ul>
</div>