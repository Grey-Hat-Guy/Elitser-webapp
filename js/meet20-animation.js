export function initMeet20Animation() {
  if (typeof window === "undefined") {
    return;
  }
  initTimelineScroll();
  initElegantTestimonials();
  initPledgeScroll();
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      if (typeof initMeet20Animation === "function") {
        initMeet20Animation();
      }
    });
  } else {
    if (typeof initMeet20Animation === "function") {
      initMeet20Animation();
    }
  }
}

function initTimelineScroll() {
  const events = document.querySelectorAll(".meet20-timeline-event");

  if (!events.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  events.forEach((event) => {
    observer.observe(event);
  });

  events.forEach((event) => {
    const rect = event.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      event.classList.add("visible");
    }
  });
}

function initElegantTestimonials() {
  const track = document.getElementById("elegantTrack");
  const dots = document.querySelectorAll(".elegant-dot");
  const prevBtn = document.getElementById("elegantPrev");
  const nextBtn = document.getElementById("elegantNext");
  const slides = document.querySelectorAll(".testimonials-elegant-slide");

  if (!track || !slides.length) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoPlayInterval = null;
  const autoPlayDelay = 3000;

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;

    currentIndex = index;
    track.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetAutoPlay();
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = parseInt(dot.getAttribute("data-index"));
      goToSlide(index);
      resetAutoPlay();
    });
  });

  const slider = document.querySelector(".testimonials-elegant-slider");
  if (slider) {
    slider.addEventListener("mouseenter", stopAutoPlay);
    slider.addEventListener("mouseleave", startAutoPlay);
  }

  document.addEventListener("keydown", (e) => {
    const rect = slider?.getBoundingClientRect();
    if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
      if (e.key === "ArrowLeft") {
        prevSlide();
        resetAutoPlay();
      } else if (e.key === "ArrowRight") {
        nextSlide();
        resetAutoPlay();
      }
    }
  });

  let touchStartX = 0;
  let touchEndX = 0;

  if (slider) {
    slider.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );

    slider.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
          if (diff > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
          resetAutoPlay();
        }
      },
      { passive: true },
    );
  }

  goToSlide(0);
  startAutoPlay();

  return {
    goToSlide,
    nextSlide,
    prevSlide,
    startAutoPlay,
    stopAutoPlay,
  };
}

function initPledgeScroll() {
  const pledges = document.querySelectorAll(".pledge-item");

  if (!pledges.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  pledges.forEach((pledge) => {
    observer.observe(pledge);
  });

  pledges.forEach((pledge) => {
    const rect = pledge.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      pledge.classList.add("visible");
    }
  });
}
