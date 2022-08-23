<script>
  import fetchJsonp from "fetch-jsonp";
  import { search, suggestions } from "stores.js";
  import { Prompt, Suggestions } from "$lib";
  import { normalizeUrl, parseInput } from "$lib/js";

  async function getSuggestions(string) {
    const query = string.includes(":") ? string.split(":")[1] : string;
    //duckSuggestUrl = "https://duckduckgo.com/ac/?q=" + query + "&type=list", { jsonpCallbackFunction: "autocompleteCallback" }
    if (!query) {
      suggestions.set([]);
    } else {
      const response = await fetchJsonp(
        "https://google.com/complete/search?client=firefox&q=" + query
        );
        const searchSuggestions = await response.json();
        suggestions.set(searchSuggestions[1].slice(0, 5));
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
        window.location.assign(normalizeUrl(parseInput($search)))}
    >
      <input
        bind:value={$search}
        on:input={getSuggestions($search)}
        id="search-input"
        label="search input"
        type="text"
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
    font-weight: var(--normal);
  }

  /* @supports (-webkit-touch-callout: none) {
    /* CSS for iOS */
    /* input {
      margin-left: -10px;
    }
  } */
</style>
