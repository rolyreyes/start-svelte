import { get } from "svelte/store";
import { db } from "stores.js";
import { getTracking, isTracking, isUrl } from "./utils.js";

const findSiteByAlias = (string) =>
  get(db).find((site) => site.alias === string);

const aliasArray = get(db).map((site) => site.alias);
const aliasDupes = aliasArray.filter((item, index) =>
  index !== aliasArray.indexOf(item)
).filter(Boolean);

if (aliasDupes.length > 0) {
  console.log("DUPLICATE ALIASES FOUND IN CONFIG:", aliasDupes);
}

export default function parseInput(string) {
  const input = string.toLowerCase();

  // const duckUrl = "https://duckduckgo.com/?q={}";
  const googleUrl = "https://google.com/search?q=";

  // BEGIN PARSER

  // handle @ for Twitter
  // Ex: @SwiftOnSecurity
  if (input.startsWith("@")) {
    return "https://twitter.com/" + input;
  }

  // handle ~ for Tildes
  // Ex: ~tech
  if (input.startsWith("~")) {
    return "https://tildes.net/" + input;
  }

  // handle $ for stocks
  // Ex: $aapl
  if (input.startsWith("$")) {
    return "https://google.com/finance?q=" + input;
  }

  // handle r/ for subreddits
  if (input.startsWith("r/")) {
    // handled aliased subreddits
    const subredditAlias = input.match(/r\/\w+/i)[0];
    if (aliasArray.includes(subredditAlias)) {
      //// aliased subreddit search
      //// r/mm:vega
      if (input.includes(":")) {
        const query = input.split(":")[1].trim();
        return findSiteByAlias(subredditAlias).search_url.replace("{}", query);
      }

      //// aliased subreddit with path
      //// Ex r/mm || r/mm/new
      if (input.includes("/")) {
        const path = input.split("/").slice(2).join();
        return findSiteByAlias(subredditAlias).url + "/" + path;
      }
    }
    // subreddit search
    // Ex: r/mechmarket:vega

    if (input.includes(":")) {
      const subreddit = input.split(":")[0];
      const query = input.split(":")[1].trim();

      return "https://www.reddit.com/[]/search/?q={}&restrict_sr=1".replace(
        "[]",
        subreddit,
      ).replace("{}", query);
    }

    //Ex: r/all
    return "https://reddit.com/" + input;
  }

  // handle match to aliased site defined in config.js
  // Ex: gb => https://www.giantbomb.com/
  if (aliasArray.includes(input)) {
    return findSiteByAlias(input).url;
  }

  // handle match to alias with search
  // Ex: Search YouTube => 'y:query'
  if (input.includes(":") && aliasArray.includes(input.split(":")[0])) {
    const alias = input.split(":")[0];
    const query = input.split(":")[1].trim();

    if (findSiteByAlias(alias)) {
      return findSiteByAlias(alias)
        .search_url.replace("{}", query);
    }
  }

  // handle paths with a matched alias
  // Ex: gb/api => https://www.giantbomb.com/api
  if (
    input.includes("/") && aliasArray.includes(input.split("/")[0])
  ) {
    const alias = input.split("/")[0];
    const path = string.split("/").slice(1).join("/");
    let site = findSiteByAlias(alias).url;

    // // detect and remove trailing slash if found
    // if (site.endsWith("/")) {
    //   site = site.slice(0, -1);
    // }

    return site + "/" + path;
  }

  // handle tracking numbers
  if (isTracking(input)) {
    return getTracking(input);
  }

  if (isUrl(string)) {
    return string;
  }

  // send query to search engine
  return googleUrl + string;
}
