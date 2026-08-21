export function initTeamVideos() {
  const cards = document.querySelectorAll(".team-card");

  cards.forEach((card) => {
    const imageWrap = card.querySelector(".team-card-image-wrap");
    const videoContainer = card.querySelector(".team-video-container");
    const iframe = videoContainer?.querySelector("iframe");

    if (!videoContainer || !iframe) return;

    card.addEventListener("click", function (e) {
      if (e.target.closest(".team-video-close")) return;

      if (this.classList.contains("video-playing")) return;

      cards.forEach((otherCard) => {
        if (otherCard !== this) {
          otherCard.classList.remove("video-playing");
          const otherContainer = otherCard.querySelector(
            ".team-video-container",
          );
          const otherIframe = otherContainer?.querySelector("iframe");
          if (otherIframe) {
            const src = otherIframe.getAttribute("src");
            otherIframe.setAttribute("src", "");
            setTimeout(() => {
              otherIframe.setAttribute(
                "src",
                src.replace("autoplay=1", "autoplay=0"),
              );
            }, 100);
          }
        }
      });

      this.classList.add("video-playing");
      const currentSrc = iframe.getAttribute("src");
      if (currentSrc && !currentSrc.includes("autoplay=1")) {
        iframe.setAttribute(
          "src",
          currentSrc.replace("autoplay=0", "autoplay=1"),
        );
      }
    });

    const closeBtn = document.createElement("button");
    closeBtn.className = "team-video-close";
    closeBtn.innerHTML = "✕";
    closeBtn.setAttribute("aria-label", "Close video");
    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      card.classList.remove("video-playing");
      iframe.setAttribute("src", "");
      setTimeout(() => {
        iframe.setAttribute(
          "src",
          `https://www.youtube.com/embed/${card.dataset.video}?autoplay=0&rel=0&modestbranding=1`,
        );
      }, 100);
    });
    videoContainer.appendChild(closeBtn);
  });
}
