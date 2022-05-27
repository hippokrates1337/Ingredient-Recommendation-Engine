<script>
    import {createEventDispatcher} from "svelte"
    const dispatch = createEventDispatcher()

    export let categories 
    export let categoriesSelected = []

    let categoryNames = [
        {name: "other", label: "Main & side dishes"},
        {name: "soup", label: "Soups"},
        {name: "salad", label: "Salads"},
        {name: "pastry", label: "Pastry"},
        {name: "dessert", label: "Desserts"}
    ]

    const onFilterChange = () => {
        dispatch("filterChange", categories)
    }

    const onCategoryChange = () => {
        dispatch("categoryChange", categoriesSelected)
    }
</script>

<div class="card shadow-sm p-1">
    <h5 class="card-title text-primary text-center">Recipe categories considered</h5>
    <div class="card-body">
        <div class="form-check border border-primary rounded">
            <input type="radio" bind:group={categories} on:change={onFilterChange} name="categories" value={"all"} id="allCategories" checked>
            <label for="allCategories">All</label>
        </div>
        <div class="form-check border border-primary rounded">
            <input type="radio" bind:group={categories} on:change={onFilterChange} name="categories" value={"selected"} id="selectedCategories">
            <label for="selectedCategories">Selected only</label>
            {#each categoryNames as cat}
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" bind:group={categoriesSelected} on:change={onCategoryChange} name="categoriesSelected" value={cat["name"]} id={cat["name"]} disabled={categories == "all"} />
                    <label class="form-check-label" for={cat["name"]}>{cat["label"]}</label>
                </div>
            {/each}
        </div>
    </div>
</div>