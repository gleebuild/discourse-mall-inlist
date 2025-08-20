import { apiInitializer } from "discourse/lib/api";
import { ajax } from "discourse/lib/ajax";
import DiscourseURL from "discourse/lib/url";

export default apiInitializer("1.49", (api) => {
  function listContainer() {
    return document.querySelector("#list-area") ||
           document.querySelector(".list-area") ||
           document.querySelector(".sidebar-wrapper");
  }

  async function renderInlist() {
    const url = new URL(window.location.href);
    const isMall = url.searchParams.has("mall");
    const isAdmin = url.searchParams.has("mall_admin");
    const container = listContainer();
    if (!container) return;

    // 清理旧的
    const old = document.querySelector(".mall-inlist-wrapper");
    if (old) old.remove();

    if (!isMall && !isAdmin) {
      container.style.display = "";
      return;
    }

    // 隐藏原生列表
    container.style.display = "none";

    // 挂载位置 —— 容器前面
    const mount = document.createElement("div");
    mount.className = "mall-inlist-wrapper";
    mount.innerHTML = `<div class="mall-inlist-loading">Loading…</div>`;
    container.parentElement.insertBefore(mount, container);

    try {
      const path = isAdmin ? "/mall/admin?inlist=1" : "/mall?inlist=1";
      const html = await ajax(path, { dataType: "html" });
      mount.innerHTML = html;
    } catch (e) {
      mount.innerHTML = `<p class="mall-inlist-error">加载失败：${e}</p>`;
      container.style.display = "";
    }
  }

  api.onPageChange(() => renderInlist());
});
