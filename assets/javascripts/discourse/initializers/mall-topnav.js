import { apiInitializer } from "discourse/lib/api";
import DiscourseURL from "discourse/lib/url";

export default apiInitializer("1.49", (api) => {
  function navUl() {
    return document.querySelector(".navigation-container .nav-pills");
  }

  function ensureTabs() {
    const ul = navUl();
    if (!ul) return;
    const currentUser = api.getCurrentUser?.();

    if (!ul.querySelector("a[data-mall-tab='mall']")) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.textContent = "商城";
      a.dataset.mallTab = "mall";
      a.href = "#";
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const u = new URL(window.location.href);
        u.searchParams.delete("mall_admin");
        u.searchParams.set("mall", "1");
        DiscourseURL.routeTo(u.pathname + u.search);
      });
      li.appendChild(a);
      ul.appendChild(li);
    }

    if (currentUser?.admin && !ul.querySelector("a[data-mall-tab='admin']")) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.textContent = "管理";
      a.dataset.mallTab = "admin";
      a.href = "#";
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const u = new URL(window.location.href);
        u.searchParams.delete("mall");
        u.searchParams.set("mall_admin", "1");
        DiscourseURL.routeTo(u.pathname + u.search);
      });
      li.appendChild(a);
      ul.appendChild(li);
    }
  }

  function setActive() {
    const u = new URL(window.location.href);
    const isMall = u.searchParams.has("mall");
    const isAdmin = u.searchParams.has("mall_admin");
    document.querySelectorAll(".navigation-container .nav-pills a[data-mall-tab]").forEach(a => {
      a.classList.remove("active");
    });
    if (isMall) {
      const a = document.querySelector("a[data-mall-tab='mall']");
      a && a.classList.add("active");
    } else if (isAdmin) {
      const a = document.querySelector("a[data-mall-tab='admin']");
      a && a.classList.add("active");
    }
  }

  function tick() {
    ensureTabs();
    setActive();
  }

  api.onPageChange(() => tick());
  // 首次进入
  tick();
});
