<script>
    import {createEventDispatcher} from "svelte"
    const dispatch = createEventDispatcher()

    let ingredient

    const onAdd = () => {
        dispatch("add", ingredient)
        ingredient = ""
    }
</script>

<form on:submit|preventDefault={onAdd}>
    <div class="form-floating">
        <input type="text" class="form-control" autocomplete="off" bind:value={ingredient} id="input_addingredient" />
        <label class="form-label" for="input_addingredient" id="label_addingredient">
            Add an ingredient to your selection:
        </label>
    </div>
    <div class="d-grid mt-1">
        <button class="btn btn-primary btn-block" type="submit">Add</button>
    </div>
</form>
