<script>
  import { config, db } from "stores.js";
  import { Prompt, List } from "$lib";

  function cleanEmojis(str) {
    return str.replace(/\p{Emoji}/gu, "");
  }

  let sites = $config.sites.filter(
    (s) => s.category !== undefined && s.hidden !== true
  );
  //console.log(sites);
  const categories = [...new Set(sites.map((s) => s.category))].sort((a, b) =>
    cleanEmojis(a).localeCompare(cleanEmojis(b))
  );
  // console.log(categories);
  const favorites = $config.sites.filter((s) => s.favorite === true);
  //console.log(favorites);
</script>

<Prompt>
  tree
  <aside>
    <span>.</span>
    <ul>
      <List title="✨ Favorites" sites={favorites} />
      {#each categories as category}
        <List
          title={category}
          sites={sites.filter((s) => s.category === category)}
        />
      {/each}
    </ul>
  </aside>
</Prompt>

<style>
  /* h1 {
    color: var(--red);
    display: inline;
    font-family: var(--font);
    font-size: 1rem;
    font-weight: var(--heavy);
    user-select: none;
  } */
</style>
