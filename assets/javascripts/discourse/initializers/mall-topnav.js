import { apiInitializer } from "discourse/lib/api";
import DiscourseURL from "discourse/lib/url";

export default apiInitializer("1.49", (api) => {
  function navUl() {
    return document.querySelector(".navigation-container .nav-pills");
  }

  function makeLi(label, param, key) {
    const li = document.createElement("li");
    li.className = "nav-item mall-nav-item";
    const a = document.createElement("a");
    a.textContent = label;
    a.dataset.mallTab = key;
    a.href = "#";
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const u = new URL(window.location.href);
      u.searchParams.delete("mall");
      u.searchParams.delete("mall_admin");
      u.searchParams.set(param, "1");
      DiscourseURL.routeTo(u.pathname + u.search);
    });
    li.appendChild(a);
    return li;
  }

  function ensureTabs() {
    const ul = navUl();
    if (!ul) return;
    const currentUser = api.getCurrentUser?.();

    if (!ul.querySelector("a[data-mall-tab='mall']")) {
      ul.appendChild(makeLi("商城", "mall", "mall"));
    }
    if (currentUser?.admin && !ul.querySelector("a[data-mall-tab='admin']")) {
      ul.appendChild(makeLi("管理", "mall_admin", "admin"));
    }
  }

  function setActive() {
    const u = new URL(window.location.href);
    const isMall = u.searchParams.has("mall");
    const isAdmin = u.searchParams.has("mall_admin");
    document.querySelectorAll(".navigation-container .nav-pills li.mall-nav-item").forEach(li => {
      const a = li.querySelector("a[data-mall-tab]");
      li.classList.remove("active");
      a && a.classList.remove("active");
      a && a.removeAttribute("aria-current");
      if (isMall && a?.dataset.mallTab === "mall") {
        li.classList.add("active");
        a.classList.add("active");
        a.setAttribute("aria-current","page");
      }
      if (isAdmin && a?.dataset.mallTab === "admin") {
        li.classList.add("active");
        a.classList.add("active");
        a.setAttribute("aria-current","page");
      }
    });
  }

  function tick() { ensureTabs(); setActive(); }

  api.onPageChange(() => tick());
  tick();
});
