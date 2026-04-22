export function initMegaMenu() {
  const megaMenu = document.querySelector(".mega-menu");
  if (!megaMenu) return;

  const tabBtns = megaMenu.querySelectorAll(".tab-btn");
  const tabPanes = megaMenu.querySelectorAll(".tab-pane");

  function setActiveTabByURL() {
    const currentPath = window.location.pathname;
    let activeTabId = "tab1";

    if (currentPath.includes("/products/help-desk/")) {
      activeTabId = "tab1";
    } else if (currentPath.includes("/products/end-point-management/")) {
      activeTabId = "tab2";
    } else if (currentPath.includes("/products/infrastructure-monitoring/")) {
      activeTabId = "tab3";
    } else if (currentPath.includes("/products/active-directory-management/")) {
      activeTabId = "tab4";
    } else if (currentPath.includes("/products/security-log-analysis/")) {
      activeTabId = "tab5";
    } else if (currentPath.includes("/products/ai-automation/")) {
      activeTabId = "tab6";
    } else if (currentPath.includes("/products/public-key-infrastructure/")) {
      activeTabId = "tab7";
    }

    tabBtns.forEach((btn) => btn.classList.remove("active"));
    tabPanes.forEach((pane) => pane.classList.remove("active"));

    const activeButton = Array.from(tabBtns).find(
      (btn) => btn.getAttribute("data-tab") === activeTabId,
    );
    if (activeButton) {
      activeButton.classList.add("active");
    }

    const activePane = megaMenu.querySelector(`#${activeTabId}`);
    if (activePane) {
      activePane.classList.add("active");
    }
  }

  tabBtns.forEach((btn) => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener("click", () => {
      const target = newBtn.getAttribute("data-tab");
      if (!target) return;

      const allTabBtns = megaMenu.querySelectorAll(".tab-btn");
      allTabBtns.forEach((btn) => btn.classList.remove("active"));

      newBtn.classList.add("active");

      const allTabPanes = megaMenu.querySelectorAll(".tab-pane");
      allTabPanes.forEach((pane) => pane.classList.remove("active"));

      const activePane = megaMenu.querySelector(`#${target}`);
      if (activePane) activePane.classList.add("active");

      const tabImages = megaMenu.querySelectorAll(".tab-image");
      tabImages.forEach((img) => img.classList.remove("active"));
      const activeImage = megaMenu.querySelector(
        `.tab-image[data-image="${target}"]`,
      );
      if (activeImage) activeImage.classList.add("active");
    });
  });

  setActiveTabByURL();
}
