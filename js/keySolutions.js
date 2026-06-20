export function initKeySolutions() {
  const solutions = [
    {
      icon: "fas fa-chalkboard-user",
      title: "Unified Service Management",
      desc: "Streamlined ITIL-aligned service desk and workflow automation.",
    },
    {
      icon: "fas fa-laptop-code",
      title: "Unified Endpoint Management and Security",
      desc: "Secure & manage devices across hybrid environments from one pane.",
    },
    {
      icon: "fas fa-chart-line",
      title: "IT Operations Management and Observability",
      desc: "Full-stack observability with AI-driven insights & automation.",
    },
    {
      icon: "fas fa-id-card",
      title: "Identity and Access Management",
      desc: "Secure identities, authentication and access control.",
    },
    {
      icon: "fas fa-shield-alt",
      title: "Security Information and Event Management",
      desc: "Real-time threat detection, compliance and SIEM analytics.",
    },
    {
      icon: "fas fa-key",
      title: "Public Key Infrastructure (PKI)",
      desc: "Certificate lifecycle management & cryptographic trust.",
    },
    {
      icon: "fas fa-robot",
      title: "Hyper Automation Platform",
      desc: "Intelligent automation combining RPA, AI, and orchestration.",
    },
    {
      icon: "fas fa-code-branch",
      title: "Low Code Software Development Platform",
      desc: "Rapid app delivery with drag-and-drop & enterprise integration.",
    },
    {
      icon: "fas fa-chart-pie",
      title: "Data Visualization & IT Analytics",
      desc: "Turn complex data into actionable dashboards and KPIs.",
    },
  ];

  const container = document.getElementById("keySolutionsNodes");
  const ecosystemDiv = document.getElementById("keySolutionsEcosystem");
  const svgContainer = document.getElementById("keySolutionsSvg");

  if (!container) return;

  function calculateOrbitPositions(
    centerX,
    centerY,
    radiusX,
    radiusY,
    startOffset = 0,
  ) {
    const positions = [];
    const count = solutions.length;
    const angleStep = (Math.PI * 2) / count;

    for (let i = 0; i < count; i++) {
      const angle = angleStep * i + startOffset;
      const x = centerX + Math.cos(angle) * radiusX;
      const y = centerY + Math.sin(angle) * radiusY;
      positions.push({ x, y, angle });
    }
    return positions;
  }

  function applyDesktopPositions() {
    const nodes = document.querySelectorAll(".solution-node");
    if (nodes.length === 0) return;

    const centerElem = document.getElementById("keySolutionsCenter");
    const ecosystemRect = ecosystemDiv.getBoundingClientRect();
    const centerRect = centerElem.getBoundingClientRect();

    const centerX = centerRect.left + centerRect.width / 2 - ecosystemRect.left;
    const centerY = centerRect.top + centerRect.height / 2 - ecosystemRect.top;

    const radiusX = 480;
    const radiusY = 290;

    const positions = calculateOrbitPositions(
      centerX,
      centerY,
      radiusX,
      radiusY,
      -Math.PI / 6,
    );

    nodes.forEach((node, idx) => {
      const pos = positions[idx];
      if (pos) {
        node.style.position = "absolute";
        node.style.left = `${pos.x - 135}px`;
        node.style.top = `${pos.y - 95}px`;
        node.style.right = "auto";
        node.style.bottom = "auto";
        node.style.transform = "none";
        node.style.width = "270px";
      }
    });
  }

  function renderNodes() {
    container.innerHTML = "";
    solutions.forEach((sol, idx) => {
      const node = document.createElement("div");
      node.className = "solution-node";
      node.setAttribute("data-pos", idx);
      node.setAttribute("data-solution-idx", idx);
      node.innerHTML = `
        <div class="node-icon"><i class="${sol.icon}"></i></div>
        <h4>${sol.title}</h4>
        <p>${sol.desc}</p>
      `;
      container.appendChild(node);
    });
  }

  function initParticles() {
    const particlesContainer = document.getElementById("keySolutionsParticles");
    if (!particlesContainer) return;

    for (let i = 0; i < 35; i++) {
      const particle = document.createElement("div");
      particle.classList.add("particle");
      const size = Math.random() * 8 + 3;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${Math.random() * 15 + 8}s`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particle.style.opacity = Math.random() * 0.12 + 0.03;
      particlesContainer.appendChild(particle);
    }
  }

  function drawConnectors() {
    if (window.innerWidth <= 1024) return;

    const svg = document.getElementById("keySolutionsLineSvg");
    if (!svg) return;

    const centerElem = document.getElementById("keySolutionsCenter");
    if (!centerElem) return;

    const ecosystemRect = ecosystemDiv.getBoundingClientRect();
    const centerRect = centerElem.getBoundingClientRect();
    const centerX = centerRect.left + centerRect.width / 2 - ecosystemRect.left;
    const centerY = centerRect.top + centerRect.height / 2 - ecosystemRect.top;

    const nodes = document.querySelectorAll(".solution-node");
    let linesHtml = "";

    nodes.forEach((node, i) => {
      const rect = node.getBoundingClientRect();
      const nodeX = rect.left + rect.width / 2 - ecosystemRect.left;
      const nodeY = rect.top + rect.height / 2 - ecosystemRect.top;
      linesHtml += `<line x1="${centerX}" y1="${centerY}" x2="${nodeX}" y2="${nodeY}" class="connector-line" data-line-idx="${i}" />`;
    });

    svg.innerHTML = linesHtml;

    const w = ecosystemDiv.clientWidth;
    const h = ecosystemDiv.clientHeight;
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.style.width = "100%";
    svg.style.height = "100%";

    nodes.forEach((node, idx) => {
      node.addEventListener("mouseenter", () => highlightConnector(idx, true));
      node.addEventListener("mouseleave", () => highlightConnector(idx, false));
    });
  }

  function highlightConnector(idx, highlight) {
    if (window.innerWidth <= 1024) return;
    const lines = document.querySelectorAll(".connector-line");
    const center = document.getElementById("keySolutionsCenter");

    if (lines[idx]) {
      if (highlight) {
        lines[idx].classList.add("highlight");
        if (center)
          center.style.boxShadow =
            "0 0 0 2px rgba(216,4,44,0.3), 0 20px 30px -10px rgba(0,0,0,0.1)";
      } else {
        lines[idx].classList.remove("highlight");
        if (center) center.style.boxShadow = "";
      }
    }
  }

  function updateLayout() {
    const width = window.innerWidth;
    const nodesContainer = document.getElementById("keySolutionsNodes");
    const svgContainerEl = document.getElementById("keySolutionsSvg");

    if (width <= 767) {
      nodesContainer.classList.add("nodes-stack");
      nodesContainer.classList.remove("nodes-grid-tablet");
      if (svgContainerEl) svgContainerEl.style.display = "none";

      const nodes = document.querySelectorAll(".solution-node");
      nodes.forEach((node) => {
        node.style.position = "relative";
        node.style.left = "auto";
        node.style.top = "auto";
        node.style.width = "100%";
      });
    } else if (width <= 1024) {
      nodesContainer.classList.add("nodes-grid-tablet");
      nodesContainer.classList.remove("nodes-stack");
      if (svgContainerEl) svgContainerEl.style.display = "none";

      const nodes = document.querySelectorAll(".solution-node");
      nodes.forEach((node) => {
        node.style.position = "relative";
        node.style.left = "auto";
        node.style.top = "auto";
        node.style.width = "100%";
      });
    } else {
      nodesContainer.classList.remove("nodes-grid-tablet", "nodes-stack");
      if (svgContainerEl) svgContainerEl.style.display = "block";

      setTimeout(() => {
        applyDesktopPositions();
        drawConnectors();
      }, 100);
    }
  }

  function initScrollReveal() {
    const nodes = document.querySelectorAll(".solution-node");
    const center = document.getElementById("keySolutionsCenter");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
    );

    nodes.forEach((node, idx) => {
      observer.observe(node);
      node.style.transitionDelay = `${idx * 0.04}s`;
    });
    if (center) observer.observe(center);
  }

  function ensureEcosystemHeight() {
    const ecosystem = document.getElementById("keySolutionsEcosystem");
    if (ecosystem && window.innerWidth > 1024) {
      ecosystem.style.minHeight = "700px";
      ecosystem.style.height = "auto";
    }
  }

  renderNodes();
  initParticles();
  ensureEcosystemHeight();

  setTimeout(() => {
    updateLayout();
    initScrollReveal();
  }, 200);

  window.addEventListener("resize", () => {
    ensureEcosystemHeight();
    setTimeout(() => {
      updateLayout();
      if (window.innerWidth > 1024) {
        setTimeout(() => drawConnectors(), 80);
      }
    }, 100);
  });

  window.addEventListener("scroll", () => {
    if (window.innerWidth > 1024) {
      requestAnimationFrame(() => drawConnectors());
    }
  });
}
