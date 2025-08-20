import { apiInitializer } from "discourse/lib/api";
import { renderInlistIfNeeded } from "discourse/lib/mall-inlist-core";

export default apiInitializer("1.49", (api) => {
  function findListContainer() {
    return document.querySelector("#list-area") ||
           document.querySelector(".list-area") ||
           document.querySelector(".topic-list");
  }
  api.onPageChange(() => renderInlistIfNeeded(findListContainer));
});
