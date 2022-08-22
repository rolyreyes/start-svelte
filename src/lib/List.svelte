<script>
  export let title = "💩 Example"; // String
  export let sites = [
    // Array of objects
    {
      name: "Example Website",
      aliases: ["Example", "aliases"],
      url: "http://example.com/",
    },
  ];
</script>

<li>
  <details>
    <summary>
      {title}
    </summary>
    <ul>
      {#each sites.sort((a, b) => a.name.localeCompare(b.name)) as site}
        <li
          on:focus
          on:mouseover={(e) => e.target.focus()}
          title={site.aliases.toString().replace(",", ", ")}
        >
          <a href={site.url}>{site.name}</a>
        </li>
      {/each}
    </ul>
  </details>
</li>

<style>
  /* h1 {
    color: var(--red);
    display: inline;
    font-family: var(--font);
    font-size: 1rem;
    font-weight: var(--normal);
  } */

  /* ul {
    padding-left: 1.6rem;
  } */
  details {
    user-select: none;
  }
  details summary {
    list-style: none;
    outline: none;
    color: var(--red);
    font-weight: var(--normal);
    cursor: pointer;
  }
  /* details summary::-webkit-details-marker {
    display: none;
  } */
</style>
