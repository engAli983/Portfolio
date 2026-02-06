document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  let isScrolling = false;

  const toggleHeader = () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
    isScrolling = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!isScrolling) {
        window.requestAnimationFrame(toggleHeader);
        isScrolling = true;
      }
    },
    { passive: true },
  ); // passive: true improves scrolling performance

  // === 2. Mobile Menu ===
  const menuBtn = document.querySelector(".menu-btn");
  const navLinks = document.querySelector(".nav-links");
  const links = document.querySelectorAll(".nav-links a");

  const toggleMenu = () => {
    const isActive = navLinks.classList.toggle("active");
    menuBtn.classList.toggle("active");
    menuBtn.setAttribute("aria-expanded", isActive); // Accessibility improvement
  };

  const closeMenu = () => {
    navLinks.classList.remove("active");
    menuBtn.classList.remove("active");
    menuBtn.setAttribute("aria-expanded", "false");
  };

  menuBtn?.addEventListener("click", toggleMenu); // Optional chaining check
  links.forEach((link) => link.addEventListener("click", closeMenu));

  // === 3. Intersection Observer (Animation) ===
  // Define observer once to reuse it
  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: "0px",
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target); // Stop observing once visible (Saves resources)
      }
    });
  }, observerOptions);

  const observeElements = () => {
    document.querySelectorAll(".fade-in, .slide-up").forEach((el) => {
      // Only observe if not already visible to avoid duplicates
      if (!el.classList.contains("visible")) {
        observer.observe(el);
      }
    });
  };

  // === 4. Dynamic Projects Loading ===
  const projectsContainer = document.getElementById("projects-grid");

  async function loadProjects() {
    if (!projectsContainer) return; // Guard clause

    try {
      const response = await fetch("projects.json");

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const projects = await response.json();

      // Generate HTML using template literals
      const projectsHTML = projects
        .map(
          (project) => `
                <article class="project-card fade-in">
                    <div class="card-image">
                        <img src="${project.image}" alt="${
                          project.title
                        }" loading="lazy" width="100%" height="auto">
                        <div class="card-overlay">
                            <a href="${
                              project.link
                            }" target="_blank" rel="noopener noreferrer" class="btn btn-primary">View Project</a>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="tags">
                            ${project.tags
                              .map((tag) => `<span class="tag">${tag}</span>`)
                              .join("")}
                        </div>
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                    </div>
                </article>
            `,
        )
        .join("");

      projectsContainer.innerHTML = projectsHTML;

      // Re-trigger observer for new elements
      observeElements();
    } catch (error) {
      console.error("Error loading projects:", error);
      projectsContainer.innerHTML = `
                <div class="error-message">
                    <p>Failed to load projects. Please try again later.</p>
                </div>`;
    }
  }

  // Initialize
  loadProjects();
  observeElements(); // Observer static elements on page load
});
