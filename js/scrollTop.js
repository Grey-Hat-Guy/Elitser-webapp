export function initScrollTop() {
  const checkForButton = setInterval(() => {
    const btn = document.getElementById("scrollTopBtn");
    if (btn) {
      clearInterval(checkForButton);

      window.addEventListener("scroll", () => {
        btn.classList.toggle("show", window.scrollY > 300);
      });

      btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }, 100);
}
