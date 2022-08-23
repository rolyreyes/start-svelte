import { search, suggestions } from "stores.js";
import { get } from "svelte/store";

export default function keyHandler(event) {
  const activeElement = document.activeElement;
  const prevElement = activeElement.parentElement.previousElementSibling;
  const nextElement = activeElement.parentElement.nextElementSibling;

  const byId = (id) => document.getElementById(id);
  const byClass = (classname) => document.getElementsByClassName(classname);
  const hasFocus = (el) => activeElement === byId(el) ? true : false;
  const changeFocus = (el) => activeElement !== byId(el) && byId(el).focus();

  switch (event.key) {
    // ArrowUp === Shitf+Tab
    case "ArrowUp":
      if (hasFocus("search-input")) {
        byClass("search-suggestion")[this.length - 1].firstElementChild.focus();
      } else {
        prevElement
          ? prevElement.firstElementChild.focus()
          : byId("search-input").focus();
      }
      break;
      // ArrowDown === Tab
    case "ArrowDown":
      if (hasFocus("search-input")) {
        byClass("search-suggestion")[0].firstElementChild.focus();
      } else {
        nextElement
          ? nextElement.firstElementChild.focus()
          : byId("search-input").focus();
      }
      break;
    case " Backspace":
      changeFocus("search-input");
      break;
    case "Escape":
      // If search-input is focused then clear the input
      if (!hasFocus("search-input")) {
        changeFocus("search-input");
      } // If search-input is focused and has a value, zero it out
      else if (get(search).length > 0) {
        search.set("");
        suggestions.set([]);
      }
      break;
    case "Shift" && "Tab":
      // Allow tabbing but
      break;
    default:
      changeFocus("search-input"); // Anything else focuses search

      return;
  }
}
