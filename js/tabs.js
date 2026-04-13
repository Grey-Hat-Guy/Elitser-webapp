export function initItamTabs() {
  const wrapper = document.querySelector(".itam-solutions");
  if (!wrapper) return;

  const tabs = wrapper.querySelectorAll(".itam-tab");
  const panes = wrapper.querySelectorAll(".itam-pane");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      tabs.forEach((t) => t.classList.remove("active"));
      panes.forEach((p) => p.classList.remove("active"));

      tab.classList.add("active");

      const activePane = wrapper.querySelector(`#${target}`);
      if (activePane) activePane.classList.add("active");
    });
  });
}
