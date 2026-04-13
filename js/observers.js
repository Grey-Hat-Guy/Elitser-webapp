export function initObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;

        if (el.classList.contains("counter") && el.__counterHandler) {
          el.__counterHandler(el);
          observer.unobserve(el);
        }

        if (el.classList.contains("step")) {
          el.classList.add("active");
          observer.unobserve(el);
        }

        if (el.classList.contains("about-card")) {
          el.classList.add("show");
          observer.unobserve(el);
        }

        if (el.classList.contains("timeline-item")) {
          el.classList.add("show");
          observer.unobserve(el);
        }

        // ITAM
        if (el.classList.contains("itam-stat-card")) {
          el.classList.add("show");
          observer.unobserve(el);
        }

        if (el.classList.contains("itam-feature-card")) {
          el.classList.add("show");
          observer.unobserve(el);
        }

        if (el.classList.contains("itam-capability")) {
          el.classList.add("show");
          observer.unobserve(el);
        }

        if (el.classList.contains("about-story")) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -50px 0px" },
  );

  return observer;
}
