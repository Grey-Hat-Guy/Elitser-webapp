export function initMeet20Animation() {
  if (typeof window === "undefined") {
    return;
  }

  initJourneyChapterAnimation();

  initTimelessMomentsAnimation();
}

function initJourneyChapterAnimation() {
  const journey = document.querySelector(".meet20-journey");
  const stage = document.querySelector(".meet20-story-stage");

  if (!journey || !stage) {
    console.warn("Meet20: #journey or #storyStage not found.");
    return;
  }

  const chapters = Array.from(stage.querySelectorAll(".meet20-story-chapter"));

  if (chapters.length < 3) {
    console.warn("Meet20: Expected at least 3 story chapters.");
    return;
  }

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("Meet20: GSAP / ScrollTrigger not loaded.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  if (window.matchMedia("(max-width: 768px)").matches) {
    chapters.forEach((chapter) => {
      gsap.set(chapter, {
        clearProps: "all",
        autoAlpha: 1,
        yPercent: 0,
        y: 0,
      });
    });

    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.vars && trigger.vars.id === "meet20-story-timeline") {
        trigger.kill();
      }
    });

    return;
  }

  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.vars && trigger.vars.id === "meet20-story-timeline") {
      trigger.kill();
    }
  });

  gsap.set(chapters, {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    autoAlpha: 0,
    yPercent: 100,
  });

  gsap.set(chapters[0], {
    autoAlpha: 1,
    yPercent: 0,
  });

  const timeline = gsap.timeline({
    defaults: {
      ease: "power2.inOut",
    },
    scrollTrigger: {
      id: "meet20-story-timeline",
      trigger: stage,
      start: "top top+=40px",
      end: "+=800",
      pin: true,
      pinSpacing: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  timeline.to(
    chapters[0],
    {
      yPercent: -100,
      autoAlpha: 0,
      duration: 0.9,
    },
    0,
  );

  timeline.fromTo(
    chapters[1],
    {
      yPercent: 100,
      autoAlpha: 0,
    },
    {
      yPercent: 0,
      autoAlpha: 1,
      duration: 0.9,
    },
    "<",
  );

  timeline.to(
    {},
    {
      duration: 0.2,
    },
    "+=0.05",
  );

  timeline.to(
    chapters[1],
    {
      yPercent: -100,
      autoAlpha: 0,
      duration: 0.9,
    },
    "+=0.1",
  );

  timeline.fromTo(
    chapters[2],
    {
      yPercent: 100,
      autoAlpha: 0,
    },
    {
      yPercent: 0,
      autoAlpha: 1,
      duration: 0.9,
    },
    "<",
  );

  timeline.to(
    {},
    {
      duration: 0.25,
    },
    "+=0.05",
  );

  ScrollTrigger.refresh();

  let resizeTimer = null;

  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    },
    {
      passive: true,
    },
  );

  window.addEventListener(
    "orientationchange",
    () => {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);
    },
    {
      passive: true,
    },
  );
}

function initTimelessMomentsAnimation() {
  const section = document.querySelector("#tiles-animation-section");
  const wrap = section?.querySelector(".tiles-wrap");

  if (!section || !wrap) {
    return;
  }

  const tiles = Array.from(wrap.querySelectorAll(":scope > .tile"));

  if (!tiles.length) {
    return;
  }

  tiles.forEach((tile) => {
    tile.style.opacity = "1";
    tile.style.transform = "none";
  });

  if (typeof gsap !== "undefined") {
    gsap.killTweensOf(tiles);
  }

  if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.getAll().forEach((trigger) => {
      const triggerElement = trigger.trigger;
      if (
        triggerElement &&
        (tiles.includes(triggerElement) || section.contains(triggerElement))
      ) {
        trigger.kill();
      }
    });
  }

  const ANIMATION_DISTANCE = 1.25;
  const END_VIEWPORT = 2.5;
  const START_VIEWPORT = END_VIEWPORT + ANIMATION_DISTANCE;

  let rows = [];
  let rowPositions = [];
  let ticking = false;
  let layoutTimer = null;
  let initialized = false;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function buildRows() {
    const grouped = [];
    const tolerance = 3;

    tiles.forEach((tile) => {
      let top = tile.offsetTop;
      let parent = tile.offsetParent;

      while (parent && parent !== document.body) {
        top += parent.offsetTop;
        parent = parent.offsetParent;
      }

      let row = grouped.find(
        (candidate) => Math.abs(candidate.top - top) <= tolerance,
      );

      if (!row) {
        row = {
          top,
          tiles: [],
        };
        grouped.push(row);
      }

      row.tiles.push(tile);
    });

    grouped.sort((a, b) => a.top - b.top);

    grouped.forEach((row) => {
      row.tiles.sort((a, b) => a.offsetLeft - b.offsetLeft);
    });

    rows = grouped;
    rowPositions = rows.map((row) => row.top);
  }

  function getProgress(rowTop, scrollY, viewportHeight) {
    const start = scrollY + viewportHeight * START_VIEWPORT;
    const end = scrollY + viewportHeight * END_VIEWPORT;
    return clamp((start - rowTop) / (start - end), 0, 1);
  }

  function getAnimation(column, columnCount, progress) {
    const reverse = 1 - progress;

    if (columnCount <= 1) {
      return {
        rotate: 0,
        scale: 0.75 + 0.25 * progress,
        translateX: 0,
        translateY: 18 * reverse,
      };
    }

    if (columnCount === 2) {
      const isLeft = column === 0;
      return {
        rotate: (isLeft ? -120 : 120) * reverse,
        scale: 0.05 + 0.95 * progress,
        translateX: (isLeft ? -30 : 30) * reverse,
        translateY: 18 * reverse,
      };
    }

    if (columnCount === 3) {
      if (column === 0) {
        return {
          rotate: -120 * reverse,
          scale: 0.05 + 0.95 * progress,
          translateX: -30 * reverse,
          translateY: 18 * reverse,
        };
      }

      if (column === 1) {
        return {
          rotate: 0,
          scale: 0.75 + 0.25 * progress,
          translateX: 0,
          translateY: 18 * reverse,
        };
      }

      return {
        rotate: 120 * reverse,
        scale: 0.05 + 0.95 * progress,
        translateX: 30 * reverse,
        translateY: 18 * reverse,
      };
    }

    const middle = (columnCount - 1) / 2;
    const normalized = middle === 0 ? 0 : (column - middle) / middle;

    return {
      rotate: 120 * normalized * reverse,
      scale: 0.75 + 0.25 * progress,
      translateX: 30 * normalized * reverse,
      translateY: 18 * reverse,
    };
  }

  function applyTile(tile, column, columnCount, progress) {
    const animation = getAnimation(column, columnCount, progress);

    tile.style.opacity = progress.toFixed(4);

    tile.style.transform =
      `translate3d(` +
      `${animation.translateX.toFixed(2)}px, ` +
      `${animation.translateY.toFixed(2)}vh, ` +
      `0) ` +
      `rotateZ(` +
      `${animation.rotate.toFixed(2)}deg` +
      `) ` +
      `scale(` +
      `${animation.scale.toFixed(4)}` +
      `)`;
  }

  function update() {
    ticking = false;

    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;

    rows.forEach((row, rowIndex) => {
      const progress = getProgress(
        rowPositions[rowIndex],
        scrollY,
        viewportHeight,
      );

      const columnCount = row.tiles.length;

      row.tiles.forEach((tile, column) => {
        applyTile(tile, column, columnCount, progress);
      });
    });
  }

  function requestUpdate() {
    if (ticking) {
      return;
    }

    ticking = true;
    requestAnimationFrame(update);
  }

  function rebuildLayout() {
    window.clearTimeout(layoutTimer);

    layoutTimer = window.setTimeout(() => {
      buildRows();
      requestUpdate();
    }, 80);
  }

  function initialize() {
    if (initialized) {
      return;
    }

    initialized = true;

    buildRows();
    update();

    window.addEventListener("scroll", requestUpdate, {
      passive: true,
    });

    window.addEventListener("resize", rebuildLayout, {
      passive: true,
    });

    window.addEventListener("orientationchange", rebuildLayout, {
      passive: true,
    });

    window.addEventListener("load", rebuildLayout, {
      once: true,
    });

    if (document.fonts?.ready) {
      document.fonts.ready.then(rebuildLayout);
    }
  }

  setTimeout(update, 100);
  initialize();
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
