export function initCounters(observer) {
  const counters = document.querySelectorAll(".counter");

  const startCounter = (counter) => {
    const target = +counter.getAttribute("data-target");
    let count = 0;
    const speed = 200;

    const update = () => {
      const increment = target / speed;

      if (count < target) {
        count += increment;
        counter.innerText = Math.ceil(count);
        requestAnimationFrame(update);
      } else {
        counter.innerText =
          counter.dataset.suffix === "%" ? target + "%" : target + "+";
      }
    };

    update();
  };

  counters.forEach((el) => {
    observer.observe(el);
    el.__counterHandler = startCounter;
  });
}
