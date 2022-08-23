<script>
  import { db } from "stores.js";
  import { Prompt, List } from "$lib";

  let sites = $db.filter((s) => s.category !== undefined && s.hidden !== true);
  const categories = [...new Set(sites.map((s) => s.category))].sort((a, b) =>
    cleanEmojis(a).localeCompare(cleanEmojis(b))
  );
  const favorites = $db.filter((s) => s.favorite === true);

  function cleanEmojis(str) {
    return str.replace(/\p{Emoji}/gu, "");
  }
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
