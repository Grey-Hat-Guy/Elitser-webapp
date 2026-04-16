import { initObserver } from "./observers.js";
import { initCounters } from "./counters.js";
import { initMegaMenu } from "./megaMenu.js";
import { initItamTabs } from "./tabs.js";
import { initHeaderScroll } from "./header.js";
import { initScrollTop } from "./scrollTop.js";

document.addEventListener("DOMContentLoaded", () => {
  const observer = initObserver();

  const steps = document.querySelectorAll(".step");
  steps.forEach((step) => observer.observe(step));

  const aboutCards = document.querySelectorAll(".about-card");
  aboutCards.forEach((card) => observer.observe(card));

  const timelineItems = document.querySelectorAll(".timeline-item");
  timelineItems.forEach((item) => observer.observe(item));

  initHeaderScroll();
  initMobileMenu();
});

window.addEventListener("componentsLoaded", () => {
  initMegaMenu();
  initItamTabs();
  initScrollTop();

  const observer = initObserver();

  initCounters(observer);

  const steps = document.querySelectorAll(".step");
  steps.forEach((step) => observer.observe(step));

  const itamStatCards = document.querySelectorAll(".itam-stat-card");
  itamStatCards.forEach((card) => observer.observe(card));

  const itamFeatureCards = document.querySelectorAll(".itam-feature-card");
  itamFeatureCards.forEach((card) => observer.observe(card));

  const itamCapabilities = document.querySelectorAll(".itam-capability");
  itamCapabilities.forEach((cap) => observer.observe(cap));

  const aboutStory = document.querySelectorAll(".about-story");
  aboutStory.forEach((story) => observer.observe(story));

  const consultHero = document.querySelectorAll(".consult-hero");
  consultHero.forEach((el) => observer.observe(el));

  const consultDetails = document.querySelectorAll(".consult-details");
  consultDetails.forEach((el) => observer.observe(el));

  const consultKeypoints = document.querySelectorAll(".consult-keypoints");
  consultKeypoints.forEach((el) => observer.observe(el));

  const consultCards = document.querySelectorAll(".consult-card");
  consultCards.forEach((el) => observer.observe(el));

  const keypointCards = document.querySelectorAll(".keypoint-card");
  keypointCards.forEach((el) => observer.observe(el));

  initMobileMenu();
  initApmTabs();
  initFsoTabs();
  initAccordionItems();
});

function initMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");
  const megaParent = document.querySelector(".mega-parent");
  const serviceParent = document.querySelector(".service-parent");

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("active");

      const icon = menuToggle.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-times");
      }
    });
  }

  document
    .querySelectorAll(".mega-parent > a, .service-parent > a")
    .forEach((link) => {
      link.addEventListener("click", (e) => {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          const parent = link.parentElement;
          document
            .querySelectorAll(".mega-parent, .service-parent")
            .forEach((el) => {
              if (el !== parent) el.classList.remove("active");
            });
          parent.classList.toggle("active");
        }
      });
    });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav")) {
      if (menu) menu.classList.remove("active");
      if (megaParent) megaParent.classList.remove("active");
      if (serviceParent) serviceParent.classList.remove("active");
    }
  });
}

window.addEventListener("resize", () => {
  const menu = document.querySelector(".menu");
  const menuToggle = document.querySelector(".menu-toggle");
  const megaParent = document.querySelector(".mega-parent");
  const serviceParent = document.querySelector(".service-parent");

  if (window.innerWidth > 992) {
    if (menu) menu.classList.remove("active");
    if (megaParent) megaParent.classList.remove("active");
    if (serviceParent) serviceParent.classList.remove("active");
    if (menuToggle) {
      const icon = menuToggle.querySelector("i");
      if (icon) {
        icon.classList.add("fa-bars");
        icon.classList.remove("fa-times");
      }
    }
  }
});

function initApmTabs() {
  const tabButtons = document.querySelectorAll(".apm-tab-btn");
  const tabPanes = document.querySelectorAll(".apm-tab-pane");

  if (tabButtons.length && tabPanes.length) {
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tabId = button.getAttribute("data-tab");
        if (!tabId) return;

        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabPanes.forEach((pane) => pane.classList.remove("active"));

        button.classList.add("active");
        const activePane = document.getElementById(tabId);
        if (activePane) activePane.classList.add("active");
      });
    });
  }
}

function initFsoTabs() {
  const tabButtons = document.querySelectorAll(".fso-tab-btn");
  const tabPanes = document.querySelectorAll(".fso-tab-pane");

  if (!tabButtons.length || !tabPanes.length) return;

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");
      if (!tabId) return;

      // remove active from all buttons
      tabButtons.forEach((btn) => btn.classList.remove("active"));

      // add active to clicked
      this.classList.add("active");

      // hide all panes
      tabPanes.forEach((pane) => pane.classList.remove("active"));

      // show selected
      const activePane = document.getElementById(tabId);
      if (activePane) {
        activePane.classList.add("active");
      }
    });
  });
}

function initAccordionItems() {
  const accordionItems = document.querySelectorAll(".accordion-item");

  if (accordionItems.length) {
    accordionItems.forEach((item) => {
      const header = item.querySelector(".accordion-header");
      if (header) {
        header.addEventListener("click", () => {
          accordionItems.forEach((otherItem) => {
            if (otherItem !== item && otherItem.classList.contains("active")) {
              otherItem.classList.remove("active");
            }
          });
          item.classList.toggle("active");
        });
      }
    });
  }
}
