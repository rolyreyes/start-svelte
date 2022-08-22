<script>
  import fetchJsonp from "fetch-jsonp";
  import { search, suggestions } from "stores.js";
  import { Prompt, Suggestions } from "$lib";
  import {parseInput} from "$lib/js";

  async function getSuggestions(search) {
    const query = search.includes(":") ? search.split(":")[1] : search;
    //duckSuggestUrl = "https://duckduckgo.com/ac/?q=" + query + "&type=list", { jsonpCallbackFunction: "autocompleteCallback" }
    if (!query) {
      suggestions.set([]);
    } else {
      const response = await fetchJsonp(
        "https://google.com/complete/search?client=firefox&q=" + query
      );
      const searchSuggestions = await response.json();
      suggestions.set(searchSuggestions[1].slice(0, 6));
    }
  }
</script>

<section>
  <Prompt>
    <form
      id="search-form"
      autocapitalize="none"
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
      on:submit|preventDefault={() =>
        window.location.assign(parseInput($search))}
    >
      <input
        bind:value={$search}
        on:input={getSuggestions($search)}
        type="text"
        id="search-input"
      />
    </form>
    <Suggestions />
  </Prompt>
</section>

<style>
  form {
    display: inline;
  }

  input {
    background: var(--background);
    border: none;
    outline: none;
    color: var(--white);
    /* font-size: 1rem; */
    font-weight: var(--normal);
    /* margin-left: -1px; */
    /* width: 90%; */
  }

  @supports (-webkit-touch-callout: none) {
    /* CSS for iOS */
    /* input {
      margin-left: -10px;
    } */
  }
</style>
