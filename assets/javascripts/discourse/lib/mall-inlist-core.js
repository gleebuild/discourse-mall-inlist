import { ajax } from "discourse/lib/ajax";

export async function renderInlistIfNeeded(findContainer) {
  const url = new URL(window.location.href);
  const isMall = url.searchParams.has("mall");
  const isAdmin = url.searchParams.has("mall_admin");

  if (!isMall && !isAdmin) {
    const container = findContainer();
    if (container) container.style.display = "";
    const old = document.querySelector(".mall-inlist-wrapper");
    if (old) old.remove();
    return;
  }

  const container = findContainer();
  if (!container) return;

  const old = document.querySelector(".mall-inlist-wrapper");
  if (old) old.remove();

  container.style.display = "none";

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
