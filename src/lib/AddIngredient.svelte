<script>
    import {createEventDispatcher} from "svelte"
    const dispatch = createEventDispatcher()

    let ingredient

    const onAdd = () => {
        dispatch("add", ingredient)
        ingredient = ""
    }
</script>

<div>
    <form on:submit|preventDefault={onAdd}>
        <label for="input_addingredient" id="label_addingredient">
            Add an ingredient to your selection:
        </label>
        <input bind:value={ingredient} type="text" autocomplete="off" id="input_addingredient" />
        <button type="submit">Add</button>
    </form>
</div>