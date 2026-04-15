async function loadComponent(id, file) {
  const el = document.getElementById(id);

  if (!el) return;

  const res = await fetch(file);
  const data = await res.text();
  el.innerHTML = data;
}

window.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadComponent("header", "/components/header.html"),
    loadComponent("stats", "/components/stats.html"),
    loadComponent("cta", "/components//cta.html"),
    loadComponent("footer", "/components/footer.html"),
    loadComponent("scrollTop", "/components/scrollTop.html"),
  ]);

  window.dispatchEvent(new Event("componentsLoaded"));
});
