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
      // Fetch repositories from GitHub API
      const response = await fetch("https://api.github.com/users/engAli983/repos?sort=updated&per_page=6");

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const repos = await response.json();

      // Filter out forks and map to our expected structure
      const projects = repos
          .filter(repo => !repo.fork)
          .map(repo => {
            // Check if there is a homepage/live site, otherwise use the repo URL
            const projectLink = repo.homepage ? repo.homepage : repo.html_url;
            
            // GitHub API doesn't provide images directly, using a beautiful placeholder service
            // Alternatively, could use a fixed generic image: "image/project-placeholder.jpg"
            const imageUrl = `https://picsum.photos/seed/${repo.id}/600/400`;
            
            return {
              title: repo.name.replace(/-/g, ' '),
              description: repo.description || "No description provided for this project.",
              link: projectLink,
              image: imageUrl,
              tags: repo.topics && repo.topics.length > 0 ? repo.topics : [repo.language || "Code"]
            };
          });

      // Generate HTML using template literals
      const projectsHTML = projects
        .map(
          (project) => `
                <article class="project-card fade-in tilt-element">
                    <div class="card-image">
                        <img src="${project.image}" alt="${project.title}" loading="lazy" width="100%" height="auto">
                        <div class="card-overlay">
                            <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">View Project</a>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="tags">
                            ${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
                        </div>
                        <h3 style="text-transform: capitalize;">${project.title}</h3>
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
                    <p>Failed to load GitHub projects. Please try again later.</p>
                </div>`;
    }
  }

  // Initialize
  loadProjects().then(() => {
    initTilt();
  });
  observeElements(); // Observer static elements on page load

  // === 5. Typing Effect ===
  const textArray = ["Computer Science Student", "Full Stack Developer", "Creative Coder", "UI/UX Designer"];
  let textIndex = 0;
  let charIndex = 0;
  const typingSpeed = 100;
  const erasingSpeed = 50;
  const delayBetweenWords = 2000;
  const typeText = document.querySelector(".typing-text");

  function type() {
    if (charIndex < textArray[textIndex].length) {
      typeText.textContent += textArray[textIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingSpeed);
    } else {
      setTimeout(erase, delayBetweenWords);
    }
  }

  function erase() {
    if (charIndex > 0) {
      typeText.textContent = textArray[textIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, erasingSpeed);
    } else {
      textIndex++;
      if (textIndex >= textArray.length) textIndex = 0;
      setTimeout(type, typingSpeed + 1100);
    }
  }
  
  if (typeText) {
    setTimeout(type, 1000);
  }

  // === 6. 3D Tilt Effect ===
  function initTilt() {
    // const tiltElements = document.querySelectorAll(".tilt-element");
    tiltElements.forEach(el => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -15; // Max 15 degree tilt
        const rotateY = ((x - centerX) / centerX) * 15;
        
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
      });
      
      el.addEventListener("mouseleave", () => {
        el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      });
    });
  }
  
  initTilt();
});
