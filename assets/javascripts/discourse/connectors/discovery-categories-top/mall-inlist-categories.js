import { apiInitializer } from "discourse/lib/api";
import { renderInlistIfNeeded } from "discourse/lib/mall-inlist-core";

export default apiInitializer("1.49", (api) => {
  function findCategoriesContainer() {
    // try several known containers in categories page
    return document.querySelector(".categories-and-latest .category-list") ||
           document.querySelector(".categories-and-topics .category-list") ||
           document.querySelector(".category-list") ||
           document.querySelector("#list-area");
  }
  api.onPageChange(() => renderInlistIfNeeded(findCategoriesContainer));
});
