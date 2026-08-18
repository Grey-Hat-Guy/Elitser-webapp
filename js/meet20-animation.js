export function initMeet20Animation() {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof gsap === "undefined") {
    console.warn("GSAP not loaded — Meet20 animation skipped.");
    return;
  }

  if (typeof ScrollTrigger === "undefined") {
    console.warn("ScrollTrigger not loaded — Meet20 animation skipped.");
    return;
  }

  if (typeof MotionPathPlugin === "undefined") {
    console.warn("MotionPathPlugin not loaded — Meet20 animation skipped.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

  const journey = document.querySelector("#journey");
  const storyWrapper = document.querySelector(".meet20-story-wrapper");
  const visualLayer = document.querySelector("#animationLane");
  const svg = document.querySelector("#journeySvg");
  const plane = document.querySelector("#plane");

  if (!journey || !storyWrapper || !visualLayer || !svg || !plane) {
    console.warn("Meet20 animation container is missing.");
    return;
  }

  const anchors = [
    document.querySelector("#story-anchor-hero"),
    document.querySelector("#story-anchor-1"),
    document.querySelector("#story-anchor-2"),
    document.querySelector("#story-anchor-3"),
    document.querySelector("#story-anchor-4"),
  ];

  const loops = [1, 2, 3, 4].map((index) =>
    document.querySelector(`#loop${index}`),
  );

  const connectors = [0, 1, 2, 3].map((index) =>
    document.querySelector(`#connector${index}`),
  );

  if (
    anchors.some((anchor) => !anchor) ||
    loops.some((loop) => !loop) ||
    connectors.some((connector) => !connector)
  ) {
    console.warn("Meet20 animation anchors or SVG paths are missing.");
    return;
  }

  const planeWidth = 86;
  const planeHeight = 86;

  let timeline = null;
  let resizeTimer = null;
  let initialized = false;
  let lastScrollPosition = null;

  function getLoopRadius() {
    const journeyStyles = getComputedStyle(journey);
    const configuredSize = parseFloat(
      journeyStyles.getPropertyValue("--loop-size"),
    );

    if (Number.isFinite(configuredSize) && configuredSize > 0) {
      return configuredSize / 2;
    }

    if (window.innerWidth <= 480) return 29;
    if (window.innerWidth <= 768) return 37;
    if (window.innerWidth <= 1024) return 55;

    return 62;
  }

  function getDocumentPoint(element) {
    const rect = element.getBoundingClientRect();

    return {
      x: rect.left + rect.width / 2 + window.scrollX,
      y: rect.top + rect.height / 2 + window.scrollY,
    };
  }

  function getLocalPoint(element, referenceRect) {
    const rect = element.getBoundingClientRect();

    return {
      x: rect.left + rect.width / 2 - referenceRect.left,
      y: rect.top + rect.height / 2 - referenceRect.top,
    };
  }

  function getCirclePath(center, radius) {
    const startX = center.x;
    const startY = center.y - radius;

    const oppositeX = center.x;
    const oppositeY = center.y + radius;

    return [
      `M ${startX} ${startY}`,
      `A ${radius} ${radius} 0 1 1 ${oppositeX} ${oppositeY}`,
      `A ${radius} ${radius} 0 1 1 ${startX} ${startY}`,
    ].join(" ");
  }

  function getConnectorPath(from, to) {
    const distance = Math.abs(to.y - from.y);
    const direction = to.y >= from.y ? 1 : -1;
    const curve = Math.max(28, Math.min(100, distance * 0.28));

    const controlPoint1 = {
      x: from.x,
      y: from.y + curve * direction,
    };

    const controlPoint2 = {
      x: to.x,
      y: to.y - curve * direction,
    };

    return [
      `M ${from.x} ${from.y}`,
      `C ${controlPoint1.x} ${controlPoint1.y}`,
      `${controlPoint2.x} ${controlPoint2.y}`,
      `${to.x} ${to.y}`,
    ].join(" ");
  }

  function setPath(element, pathData) {
    element.setAttribute("d", pathData);
  }

  function getLayout() {
    const visualRect = visualLayer.getBoundingClientRect();
    const wrapperRect = storyWrapper.getBoundingClientRect();

    const svgWidth = Math.max(1, visualRect.width);
    const svgHeight = Math.max(1, storyWrapper.offsetHeight);

    svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);

    const localAnchorPoints = anchors.map((anchor) =>
      getLocalPoint(anchor, visualRect),
    );

    const documentAnchorPoints = anchors.map((anchor) =>
      getDocumentPoint(anchor),
    );

    const laneCenterX = svgWidth / 2;
    const loopRadius = getLoopRadius();

    const loopCenters = localAnchorPoints.slice(1).map((point) => ({
      x: laneCenterX,
      y: point.y + visualRect.top - wrapperRect.top,
    }));

    const loopJoinPoints = loopCenters.map((center) => ({
      x: center.x,
      y: center.y - loopRadius,
    }));

    setPath(
      connectors[0],
      getConnectorPath(localAnchorPoints[0], loopJoinPoints[0]),
    );

    setPath(loops[0], getCirclePath(loopCenters[0], loopRadius));

    setPath(
      connectors[1],
      getConnectorPath(loopJoinPoints[0], loopJoinPoints[1]),
    );

    setPath(loops[1], getCirclePath(loopCenters[1], loopRadius));

    setPath(
      connectors[2],
      getConnectorPath(loopJoinPoints[1], loopJoinPoints[2]),
    );

    setPath(loops[2], getCirclePath(loopCenters[2], loopRadius));

    setPath(
      connectors[3],
      getConnectorPath(loopJoinPoints[2], loopJoinPoints[3]),
    );

    setPath(loops[3], getCirclePath(loopCenters[3], loopRadius));

    return {
      localAnchorPoints,
      documentAnchorPoints,
      loopCenters,
      loopJoinPoints,
    };
  }

  function getChapterProgress(documentAnchorPoints) {
    const firstY = documentAnchorPoints[0].y;
    const finalY = documentAnchorPoints[documentAnchorPoints.length - 1].y;

    const totalDistance = Math.max(1, finalY - firstY);

    return documentAnchorPoints.map((point) => {
      return gsap.utils.clamp(0, 1, (point.y - firstY) / totalDistance);
    });
  }

  function getPathLengths(pathSequence) {
    return pathSequence.map((selector) => {
      const path = document.querySelector(selector);

      if (!path) {
        return 1;
      }

      return Math.max(1, path.getTotalLength());
    });
  }

  function calculateDurations(chapterProgress, pathSequence) {
    const chapterSizes = [
      chapterProgress[1] - chapterProgress[0],
      chapterProgress[2] - chapterProgress[1],
      chapterProgress[3] - chapterProgress[2],
      chapterProgress[4] - chapterProgress[3],
    ];

    const pathLengths = getPathLengths(pathSequence);

    const chapterGroups = [
      [0, 1],
      [2, 3],
      [4, 5],
      [6, 7],
    ];

    const durations = new Array(pathSequence.length).fill(0);

    chapterGroups.forEach((group, chapterIndex) => {
      const totalPathLength = group.reduce(
        (total, pathIndex) => total + pathLengths[pathIndex],
        0,
      );

      group.forEach((pathIndex) => {
        const pathShare = pathLengths[pathIndex] / totalPathLength;

        durations[pathIndex] = chapterSizes[chapterIndex] * pathShare;
      });
    });

    return durations;
  }

  function getAnchorScrollPosition(anchor) {
    const rect = anchor.getBoundingClientRect();

    return rect.top + window.scrollY;
  }

  function killTimeline() {
    if (timeline) {
      timeline.kill();
      timeline = null;
    }

    const trigger = ScrollTrigger.getById("meet20JourneyTrigger");

    if (trigger) {
      trigger.kill();
    }
  }

  function buildTimeline(preserveScrollPosition = true) {
    const currentScrollPosition = window.scrollY;

    killTimeline();

    const layout = getLayout();

    const pathSequence = [
      "#connector0",
      "#loop1",
      "#connector1",
      "#loop2",
      "#connector2",
      "#loop3",
      "#connector3",
      "#loop4",
    ];

    const chapterProgress = getChapterProgress(layout.documentAnchorPoints);

    const durations = calculateDurations(chapterProgress, pathSequence);

    const heroScrollPosition = getAnchorScrollPosition(anchors[0]);

    const finalStoryScrollPosition = getAnchorScrollPosition(anchors[4]);

    const scrollDistance = Math.max(
      1,
      finalStoryScrollPosition - heroScrollPosition,
    );

    gsap.set(plane, {
      x: layout.localAnchorPoints[0].x - planeWidth / 2,
      y: layout.localAnchorPoints[0].y - planeHeight / 2,
      opacity: 1,
      transformOrigin: "50% 50%",
    });

    timeline = gsap.timeline({
      defaults: {
        ease: "none",
      },

      scrollTrigger: {
        id: "meet20JourneyTrigger",

        start: heroScrollPosition,
        end: heroScrollPosition + scrollDistance,

        scrub: true,

        invalidateOnRefresh: true,
        anticipatePin: 0,
      },
    });

    let timelineCursor = 0;

    pathSequence.forEach((path, index) => {
      timeline.to(
        plane,
        {
          duration: durations[index],
          motionPath: {
            path,
            align: path,
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
          },
        },
        timelineCursor,
      );

      timelineCursor += durations[index];
    });

    if (preserveScrollPosition && Number.isFinite(currentScrollPosition)) {
      lastScrollPosition = currentScrollPosition;
    }
  }

  function refreshAnimation() {
    window.clearTimeout(resizeTimer);

    resizeTimer = window.setTimeout(() => {
      const currentScroll = window.scrollY;

      buildTimeline(true);

      ScrollTrigger.refresh(true);

      requestAnimationFrame(() => {
        window.scrollTo({
          top: currentScroll,
          left: 0,
          behavior: "auto",
        });

        ScrollTrigger.update();
      });
    }, 120);
  }

  function initialize() {
    if (initialized) {
      return;
    }

    initialized = true;

    buildTimeline(false);
    ScrollTrigger.refresh(true);

    window.addEventListener("resize", refreshAnimation, { passive: true });

    window.addEventListener("orientationchange", refreshAnimation, {
      passive: true,
    });

    window.addEventListener("load", refreshAnimation, { once: true });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refreshAnimation);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
}
