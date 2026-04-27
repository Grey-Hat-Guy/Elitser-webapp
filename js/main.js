import { initObserver } from "./observers.js";
import { initCounters } from "./counters.js";
import { initMegaMenu } from "./megaMenu.js";
import { initItamTabs } from "./tabs.js";
import { initHeaderScroll } from "./header.js";
import { initScrollTop } from "./scrollTop.js";
import { initContactForm } from "./contact.js";

document.addEventListener("DOMContentLoaded", () => {
  const observer = initObserver();

  const steps = document.querySelectorAll(".step");
  steps.forEach((step) => observer.observe(step));

  const aboutCards = document.querySelectorAll(".about-card");
  aboutCards.forEach((card) => observer.observe(card));

  const timelineItems = document.querySelectorAll(".timeline-item");
  timelineItems.forEach((item) => observer.observe(item));

  initHeroGridCanvas();
  initAboutAnimation();
  initHeaderScroll();
  initMobileMenu();
  initProductsMobileAccordion();
  initDvaTabs();
  initMobileAccordion();
  initApmMobileAccordion();
  initClientsPage();
  initContactForm();
});

window.addEventListener("componentsLoaded", () => {
  initMegaMenu();
  initProductsMobileAccordion();
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
  initAdmTabs();
  initExrTabs();
  initAccordionItems();
  initLoadMoreButtons();
  initO365Tabs();
  initPamTabs();
  initSiemTabs();
  initContactForm();

  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
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

let productsAccordionInitialized = false;

function initProductsMobileAccordion() {
  if (productsAccordionInitialized) return;

  const checkInterval = setInterval(() => {
    const accordionContainer = document.querySelector(
      ".mobile-products-accordion",
    );

    if (
      accordionContainer &&
      accordionContainer.querySelectorAll(".products-accordion-item").length > 0
    ) {
      clearInterval(checkInterval);
      productsAccordionInitialized = true;

      const accordionItems = accordionContainer.querySelectorAll(
        ".products-accordion-item:not(.direct-link-item)",
      );

      accordionItems.forEach((item) => {
        const header = item.querySelector(".products-accordion-header");
        if (header && !header.hasAttribute("data-listener")) {
          header.setAttribute("data-listener", "true");
          header.addEventListener("click", (e) => {
            e.stopPropagation();

            accordionItems.forEach((otherItem) => {
              if (
                otherItem !== item &&
                otherItem.classList.contains("active")
              ) {
                otherItem.classList.remove("active");
              }
            });
            item.classList.toggle("active");
          });
        }
      });
    }
  }, 200);

  setTimeout(() => clearInterval(checkInterval), 10000);
}

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

let apmAccordionInitialized = false;

function initApmMobileAccordion() {
  if (apmAccordionInitialized) return;

  const checkInterval = setInterval(() => {
    const accordionContainer = document.querySelector(
      ".apm-accordion-container",
    );

    if (
      accordionContainer &&
      accordionContainer.querySelectorAll(".accordion-item").length > 0
    ) {
      clearInterval(checkInterval);
      apmAccordionInitialized = true;

      const accordionItems =
        accordionContainer.querySelectorAll(".accordion-item");

      accordionItems.forEach((item) => {
        const header = item.querySelector(".accordion-header");
        if (header) {
          // Remove existing listeners to avoid duplicates
          const newHeader = header.cloneNode(true);
          header.parentNode.replaceChild(newHeader, header);

          newHeader.addEventListener("click", (e) => {
            e.stopPropagation();

            // Close other items
            accordionItems.forEach((otherItem) => {
              if (
                otherItem !== item &&
                otherItem.classList.contains("active")
              ) {
                otherItem.classList.remove("active");
              }
            });

            // Toggle current
            item.classList.toggle("active");
          });
        }
      });

      // Open first accordion by default
      if (
        accordionItems.length > 0 &&
        !accordionItems[0].classList.contains("active")
      ) {
        accordionItems[0].classList.add("active");
      }
    }
  }, 200);

  setTimeout(() => clearInterval(checkInterval), 10000);
}

function initFsoTabs() {
  const tabButtons = document.querySelectorAll(".fso-tab-btn");
  const tabPanes = document.querySelectorAll(".fso-tab-pane");

  if (!tabButtons.length || !tabPanes.length) return;

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");
      if (!tabId) return;

      tabButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      tabPanes.forEach((pane) => pane.classList.remove("active"));

      const activePane = document.getElementById(tabId);
      if (activePane) activePane.classList.add("active");
    });
  });
}

function initAdmTabs() {
  const tabButtons = document.querySelectorAll(".adm-tab-btn");
  const tabPanes = document.querySelectorAll(".adm-tab-pane");

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

function initExrTabs() {
  const tabButtons = document.querySelectorAll(".exr-tab-btn");
  const tabPanes = document.querySelectorAll(".exr-tab-pane");

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

function initLoadMoreButtons() {
  // Data Source Load More
  const loadMoreDataBtn = document.getElementById("loadMoreDataBtn");
  if (loadMoreDataBtn) {
    const hiddenCards = document.querySelectorAll(
      "#dataSourceGrid .data-card.hidden",
    );
    let isExpanded = false;

    loadMoreDataBtn.addEventListener("click", function () {
      hiddenCards.forEach((card) => {
        card.classList.toggle("hidden");
      });

      if (!isExpanded) {
        this.innerHTML = 'Show Less <i class="fas fa-chevron-up"></i>';
        isExpanded = true;
      } else {
        this.innerHTML =
          'Load More Data Sources <i class="fas fa-chevron-down"></i>';
        isExpanded = false;
      }
    });
  }
}

function initO365Tabs() {
  const tabButtons = document.querySelectorAll(".o365-tab-btn");
  const tabPanes = document.querySelectorAll(".o365-tab-pane");

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

function initPamTabs() {
  const tabButtons = document.querySelectorAll(".pam-tab-btn");
  const tabPanes = document.querySelectorAll(".pam-tab-pane");

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

function initSiemTabs() {
  const tabButtons = document.querySelectorAll(".siem-tab-btn");
  const sections = document.querySelectorAll(".siem-section");

  function updateActiveTab() {
    let currentSection = "";
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 150 && rect.bottom >= 150) {
        currentSection = section.getAttribute("id");
      }
    });

    tabButtons.forEach((btn) => {
      btn.classList.remove("active");
      if (btn.getAttribute("data-section") === currentSection) {
        btn.classList.add("active");
      }
    });
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const sectionId = btn.getAttribute("data-section");
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  window.addEventListener("scroll", updateActiveTab);
  updateActiveTab();
}

// Data Visualization Tabs Functionality
function initDvaTabs() {
  const tabButtons = document.querySelectorAll(".dva-tab-btn");
  const tabPanes = document.querySelectorAll(".dva-tab-pane");

  if (tabButtons.length && tabPanes.length) {
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tabId = button.getAttribute("data-tab");

        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabPanes.forEach((pane) => pane.classList.remove("active"));

        button.classList.add("active");
        const activePane = document.getElementById(tabId);
        if (activePane) activePane.classList.add("active");
      });
    });
  }
}

let dvaAccordionInitialized = false;

function initMobileAccordion() {
  if (dvaAccordionInitialized) return;

  const checkInterval = setInterval(() => {
    const accordionContainer = document.querySelector(
      ".dva-accordion-container",
    );

    if (
      accordionContainer &&
      accordionContainer.querySelectorAll(".accordion-item").length > 0
    ) {
      clearInterval(checkInterval);
      dvaAccordionInitialized = true;

      const accordionItems =
        accordionContainer.querySelectorAll(".accordion-item");

      accordionItems.forEach((item) => {
        const header = item.querySelector(".accordion-header");
        if (header) {
          const newHeader = header.cloneNode(true);
          header.parentNode.replaceChild(newHeader, header);

          newHeader.addEventListener("click", (e) => {
            e.stopPropagation();

            accordionItems.forEach((otherItem) => {
              if (
                otherItem !== item &&
                otherItem.classList.contains("active")
              ) {
                otherItem.classList.remove("active");
              }
            });
            item.classList.toggle("active");
          });
        }
      });

      // Open first accordion by default
      if (
        accordionItems.length > 0 &&
        !accordionItems[0].classList.contains("active")
      ) {
        accordionItems[0].classList.add("active");
      }
    }
  }, 200);

  setTimeout(() => clearInterval(checkInterval), 10000);
}

// Hero Canvas Grid Animation
function initHeroGridCanvas() {
  const canvas = document.getElementById("hero-grid-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: -9999, y: -9999 };
  const squareSize = 80;
  let grid = [];

  function initGrid() {
    grid = [];
    for (let x = 0; x < width; x += squareSize) {
      for (let y = 0; y < height; y += squareSize) {
        grid.push({
          x: x,
          y: y,
          alpha: 0,
          fading: false,
          lastTouched: 0,
        });
      }
    }
  }

  function getCellAt(x, y) {
    return grid.find(
      (cell) =>
        x >= cell.x &&
        x < cell.x + squareSize &&
        y >= cell.y &&
        y < cell.y + squareSize,
    );
  }

  function handleMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    const cell = getCellAt(mouse.x, mouse.y);
    if (cell && cell.alpha === 0) {
      cell.alpha = 1;
      cell.lastTouched = Date.now();
      cell.fading = false;
    }
  }

  function handleResize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initGrid();
  }

  function drawGrid() {
    ctx.clearRect(0, 0, width, height);
    const now = Date.now();

    for (let i = 0; i < grid.length; i++) {
      const cell = grid[i];

      if (cell.alpha > 0 && !cell.fading && now - cell.lastTouched > 500) {
        cell.fading = true;
      }

      if (cell.fading) {
        cell.alpha -= 0.02;
        if (cell.alpha <= 0) {
          cell.alpha = 0;
          cell.fading = false;
        }
      }

      if (cell.alpha > 0) {
        const centerX = cell.x + squareSize / 2;
        const centerY = cell.y + squareSize / 2;

        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          5,
          centerX,
          centerY,
          squareSize,
        );
        gradient.addColorStop(0, `rgba(216, 4, 44, ${cell.alpha * 0.8})`);
        gradient.addColorStop(1, `rgba(216, 4, 44, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(
          cell.x + 0.5,
          cell.y + 0.5,
          squareSize - 1,
          squareSize - 1,
        );
      }
    }

    requestAnimationFrame(drawGrid);
  }

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("resize", handleResize);

  initGrid();
  drawGrid();
}

// About Page Visible Animation
function initAboutAnimation() {
  const container = document.querySelector(".about-bg-animation");
  if (!container) return;

  for (let i = 1; i <= 4; i++) {
    const line = document.createElement("div");
    line.className = `moving-line line-${i}`;
    container.appendChild(line);
  }

  function createParticle() {
    const particle = document.createElement("div");
    particle.className = "floating-particle";

    const size = Math.random() * 6 + 3;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;

    const isRight = Math.random() > 0.6;
    const duration = Math.random() * 8 + 6;

    particle.style.animation = `${isRight ? "particleFloatRight" : "particleFloat"} ${duration}s ease-in-out infinite`;
    particle.style.animationDelay = `${Math.random() * 5}s`;

    container.appendChild(particle);

    setTimeout(() => particle.remove(), (duration + 5) * 1000);
  }

  for (let i = 0; i < 25; i++) {
    setTimeout(() => createParticle(), i * 200);
  }

  setInterval(() => {
    if (container.querySelectorAll(".floating-particle").length < 30) {
      createParticle();
    }
  }, 1500);
}

// Clients Page Functionality
function initClientsPage() {
  const clientsGrid = document.getElementById("clientsGrid");
  let loadMoreBtn = document.getElementById("loadMoreBtn");

  if (!clientsGrid) return;

  const imagePaths = [];
  const totalImages = 243;

  for (let i = 1; i <= totalImages; i++) {
    imagePaths.push(`/assets/clients/${i}.jpg`);
  }

  let itemsToShow = 24;
  let allCards = [];

  function createClientCard(imagePath, index) {
    const card = document.createElement("div");
    card.className = "client-card";
    if (index >= itemsToShow) card.classList.add("hidden");

    const img = document.createElement("img");
    img.src = imagePath;
    img.alt = `Client ${index + 1}`;
    img.loading = "lazy";

    img.onerror = function () {
      this.style.display = "none";
      const placeholder = document.createElement("div");
      placeholder.style.cssText =
        "height: 80px; display: flex; align-items: center; justify-content: center; background: #f8f9fb; border-radius: 0.5rem;";
      placeholder.innerHTML =
        '<i class="fas fa-building" style="font-size: 2rem; color: #ddd;"></i>';
      card.appendChild(placeholder);
    };

    card.appendChild(img);
    return card;
  }

  function renderCards() {
    clientsGrid.innerHTML = "";
    allCards = [];

    for (let i = 0; i < imagePaths.length; i++) {
      const card = createClientCard(imagePaths[i], i);
      clientsGrid.appendChild(card);
      allCards.push(card);
    }
  }

  function updateLoadMoreButton() {
    if (!loadMoreBtn) return;

    if (itemsToShow >= allCards.length) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "inline-flex";
    }
  }

  function loadMore() {
    if (itemsToShow >= allCards.length) {
      if (loadMoreBtn) loadMoreBtn.style.display = "none";
      return;
    }

    itemsToShow += Math.min(24, allCards.length - itemsToShow);

    // Show newly visible cards
    for (let i = 0; i < itemsToShow; i++) {
      if (allCards[i]) allCards[i].classList.remove("hidden");
    }

    updateLoadMoreButton();
  }

  // Initialize
  renderCards();
  updateLoadMoreButton();

  // Event listener
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", loadMore);
  }
}
