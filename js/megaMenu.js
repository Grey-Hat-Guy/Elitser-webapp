export function initMegaMenu() {
  const megaMenu = document.querySelector(".mega-menu");
  if (!megaMenu) return;

  const tabBtns = megaMenu.querySelectorAll(".tab-btn");
  const tabPanes = megaMenu.querySelectorAll(".tab-pane");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");

      tabBtns.forEach((b) => b.classList.remove("active"));
      tabPanes.forEach((p) => p.classList.remove("active"));

      btn.classList.add("active");

      const activePane = megaMenu.querySelector(`#${target}`);
      if (activePane) activePane.classList.add("active");
    });
  });
}
