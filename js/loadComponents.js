async function loadComponent(id, file) {
  const res = await fetch(file);
  const data = await res.text();
  document.getElementById(id).innerHTML = data;
}

window.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadComponent("header", "/components/header.html"),
    loadComponent("footer", "/components/footer.html"),
    loadComponent("scrollTop", "/components/scrollTop.html"),
  ]);

  window.dispatchEvent(new Event("componentsLoaded"));
});
