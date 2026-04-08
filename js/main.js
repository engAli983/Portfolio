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
  const closeBtn = document.querySelector(".close-btn");
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
  closeBtn?.addEventListener("click", closeMenu); // Custom close button
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
  const loadMoreBtn = document.getElementById("load-more-btn");
  const showLessBtn = document.getElementById("show-less-btn");
  let allProjectsHTML = [];
  let currentlyShown = 3;

  // Array of project names to hide (add hidden project names here)
  const excludedProjects = [
    "engali983.github.io",
    "react-components-practice",
    "JavaScript-Course-Reference",
    "course-js",
    "My-Portfolio",
    "Ramadan-companion",
    "learn-git",
    "Artificial-intelligence-templates-",
    "engAli983",
    "JS_Practice",
  ];

  // Object to override GitHub data with custom details locally
  // Use the exact GitHub repository name as the key
  const customProjectData = {
    Portfolio: {
      title: "Personal Developer Portfolio",
      image: "../image/Portfolio.webp",
      description:
        "A dynamic and fully responsive personal portfolio built to showcase my skills and projects. Features real-time GitHub API integration for project fetching, smooth scroll animations using Intersection Observer, and a fully functional contact form powered by EmailJS.",
      tags: [
        "HTML5",
        "CSS3",
        "Vanilla JS",
        "GitHub API",
        "CSS Grid",
        "EmailJS",
      ],
      demoLink: "https://engali983.github.io/Portfolio/",
    },
    "forkify-api": {
      title: "Forkify Recipe Explorer",
      image: "../image/Forkiy-Api.webp",
      description:
        "A dynamic recipe application built by integrating the free Forkify REST API. It features 7 distinct food categories with pagination, rendering multiple recipe cards dynamically. Showcases advanced asynchronous JavaScript, API data fetching, and dynamic UI updates.",
      tags: ["HTML5", "CSS3", "JavaScript", "REST API", "Async/Await", "DOM"],
      demoLink: "https://engali983.github.io/forkify-api/",
    },
    "The_Holy_Qur-an": {
      title: "Interactive Holy Quran Web App",
      image: "../image/The-Holy-Qur-an.webp",
      description:
        "A sophisticated spiritual web application that integrates the Al-Quran Cloud API. It features dynamic Surah loading, a custom multi-color bookmarking system using LocalStorage, smart auto-scroll to saved verses, and a beautiful traditional UI designed with modern CSS layout techniques.",
      tags: ["JavaScript", "REST API", "LocalStorage", "Modern CSS"],
      demoLink: "https://engali983.github.io/The_Holy_Qur-an/",
    },
    "card-pay": {
      image: "../image/Card-Pay.webp",
      description:
        "A dynamic and interactive credit card payment interface. Features real-time data synchronization between the form and the card UI, a 3D-like flip animation when focusing on CVV, card number formatting, and integrated form validation with a success modal.",
      tags: ["Vanilla JS", "CSS 3D Transforms", "DOM Manipulation", "UI/UX"],
      demoLink: "https://engali983.github.io/card-pay/",
    },
    "E-commerce": {
      image: "../image/E-commerce.webp",
      description:
        "A comprehensive e-commerce frontend built entirely with Vanilla JavaScript. Features dynamic product rendering from a JSON file, a fully functional shopping cart and wishlist managed via LocalStorage, and interactive product sliders using Swiper.js.",
      tags: [
        "HTML5",
        "CSS3",
        "Vanilla JS",
        "LocalStorage",
        "JSON",
        "Swiper.js",
      ],
      demoLink: "https://engali983.github.io/E-commerce/",
    },
    Landing_page_bites: {
      title: "Bites Restaurant Web App",
      image: "../image/Landing-Page-Bits.webp",
      description:
        "A premium restaurant web application built entirely with Vanilla JavaScript. Features a dynamic menu with live search and filtering, a fully functional shopping cart managed via LocalStorage, and an advanced multi-step table reservation system with WhatsApp integration.",
      tags: [
        "HTML5",
        "CSS3",
        "Vanilla JS",
        "LocalStorage",
        "DOM Manipulation",
        "UI/UX",
      ],
      demoLink: "https://engali983.github.io/Landing_page_bites/",
    },
    "Family-Bakery": {
      title: "Family Bakery",
      image: "../image/Family-Bakiry.webp",
      description:
        "A beautifully crafted, fully responsive landing page for a local bakery. Features smooth scroll animations using Intersection Observer, an interactive product modal, and smart dynamic UI updates like highlighting current business hours.",
      tags: [
        "HTML5",
        "CSS3",
        "Vanilla JS",
        "CSS Animations",
        "DOM",
        "Responsive",
      ],
      demoLink: "https://engali983.github.io/Family-Bakery/",
    },
    "To-Do-List": {
      title: "Interactive To-Do List",
      image: "../image/To-Do-List.Webp",
      description:
        "A sleek and interactive task management application built with Vanilla JavaScript. Features persistent data storage using LocalStorage, dynamic DOM manipulation, and event delegation for optimized performance and a seamless user experience.",
      tags: [
        "HTML5",
        "CSS3",
        "HTML5",
        "CSS3",
        "Vanilla JS",
        "LocalStorage",
        "DOM Manipulation",
      ],
      demoLink: "https://engali983.github.io/To-Do-List/",
    },
    HTML_And_CSS_Template_One: {
      title: "Leon Creative Agency",
      image: "../image/HTML-And-CSS-Template-One.webp",
      description:
        "A modern, minimalist single-page agency template. Enhanced with custom Vanilla JavaScript features including a dynamic typewriter effect, smooth scroll animations via Intersection Observer, and an interactive portfolio filter.",
      tags: ["HTML5", "CSS3", "HTML", "CSS", "Vanilla JS", "DOM"],
      demoLink: "https://engali983.github.io/HTML_And_CSS_Template_One/",
    },
    HTML_And_CSS_Template_Two: {
      title: "Kasper Premium Portfolio",
      image: "../image/HTML-And-CSS-Template-Two.webp",
      description:
        "A fully responsive, premium agency template enhanced with advanced Vanilla JavaScript. Features a persistent dark/light mode toggle, scroll-triggered animations using Intersection Observer, dynamic statistic counters, and an interactive project filter.",
      tags: [
        "HTML5",
        "CSS3",
        "Vanilla JS",
        "Dark Mode",
        "Intersection Observer",
        "DOM",
      ],
      demoLink: "https://engali983.github.io/HTML_And_CSS_Template_Two/",
    },
    HTML_And_CSS_Template_Three: {
      title: "Advanced UI Template",
      image: "../image/HTML-And-CSS-Template-Three.webp",
      description:
        "A highly detailed, multi-section web template demonstrating advanced CSS3 architecture. Showcases a complex mega-menu, intricate keyframe animations, creative pseudo-element styling, and a pixel-perfect responsive layout using CSS Grid and Flexbox.",
      tags: ["HTML5", "CSS3", "Advanced CSS", "CSS Grid", "Animations"],
      demoLink: "https://engali983.github.io/HTML_And_CSS_Template_Three/",
    },
    HTML_And_CSS_Template_Four: {
      title: "Dashboard",
      image: "../image/HTML-And-CSS-Template-Four.webp",
      description:
        "A comprehensive and responsive admin dashboard featuring interactive charts, task management, and data widgets. Built to showcase complex UI structuring and DOM manipulation.",
      tags: ["HTML/CSS", "CSS Grid", "Custom Framework", "Multi-page UI"],
      demoLink: "https://engali983.github.io/HTML_And_CSS_Template_Four",
    },
  };

  function updateButtons() {
    if (loadMoreBtn) {
      if (currentlyShown < allProjectsHTML.length) {
        loadMoreBtn.style.display = "inline-block";
      } else {
        loadMoreBtn.style.display = "none";
      }
    }

    if (showLessBtn) {
      if (currentlyShown > 3) {
        showLessBtn.style.display = "inline-block";
      } else {
        showLessBtn.style.display = "none";
      }
    }
  }

  function renderProjects(start, end) {
    if (!projectsContainer) return;

    const itemsHTML = allProjectsHTML.slice(start, end).join("");
    if (start === 0) {
      projectsContainer.innerHTML = itemsHTML;
    } else {
      projectsContainer.insertAdjacentHTML("beforeend", itemsHTML);
    }

    updateButtons();
    observeElements();
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      let nextShown = currentlyShown + 3;
      if (nextShown > allProjectsHTML.length) {
        nextShown = allProjectsHTML.length;
      }
      renderProjects(currentlyShown, nextShown);
      currentlyShown = nextShown;
      updateButtons();
    });
  }

  if (showLessBtn) {
    showLessBtn.addEventListener("click", () => {
      let nextShown = currentlyShown - 3;
      if (nextShown < 3) {
        nextShown = 3;
      }
      currentlyShown = nextShown;
      renderProjects(0, currentlyShown);

      const projectsSection = document.getElementById("projects");
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  async function loadProjects() {
    if (!projectsContainer) return; // Guard clause

    try {
      // Fetch repositories from GitHub API
      const response = await fetch("https://api.github.com/users/engAli983/repos?sort=updated&per_page=6");
      const response = await fetch(
        "https://api.github.com/users/engAli983/repos?sort=updated",
      );

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

      // Filter out excluded projects and forks
      const activeProjects = repos.filter(
        (repo) => !excludedProjects.includes(repo.name) && !repo.fork,
      );

      // Generate HTML string array
      allProjectsHTML = activeProjects.map((project) => {
        const customData = customProjectData[project.name] || {};

        const tags =
          customData.tags && customData.tags.length > 0
            ? customData.tags
            : project.topics && project.topics.length > 0
              ? project.topics
              : project.language
                ? [project.language]
                : [];

        const imageUrl =
          customData.image ||
          `https://opengraph.githubassets.com/1/engAli983/${project.name}`;
        const projectTitle =
          customData.title ||
          project.name.replace(/-/g, " ").replace(/_/g, " ");
        const projectDesc =
          customData.description ||
          project.description ||
          "A cool project built with passion and code.";

        const liveDemoUrl = customData.demoLink || project.homepage;

        return `
                <article class="project-card">
                    <div class="card-image">
                        <img src="${imageUrl}" alt="${projectTitle}" loading="lazy" width="100%" height="auto">
                    </div>
                    <div class="card-content">
                        <div class="tech-tags">
                            ${tags.map((tag) => `<span class="tech-tag">${tag}</span>`).join("")}
                        </div>
                        <h3>${projectTitle}</h3>
                        <p>${projectDesc}</p>
                        <div class="card-footer">
                            <a href="${project.html_url}" target="_blank" rel="noopener noreferrer" class="card-footer-link">
                                <i class="fa-brands fa-github"></i> GitHub
                            </a>
                            ${
                              liveDemoUrl
                                ? `<a href="${liveDemoUrl}" target="_blank" rel="noopener noreferrer" class="demo-btn">
                                <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo
                            </a>`
                                : ""
                            }
                        </div>
                    </div>
                </article>
            `;
      });

      renderProjects(0, currentlyShown);
    } catch (error) {
      console.error("Error loading projects:", error);
      projectsContainer.innerHTML = `
                <div class="error-message">
                    <p>Failed to load GitHub projects. Please try again later.</p>
                <div class="error-message" style="width: 100%;">
                    <p style="text-align: center;">Failed to load projects. Please try again later.</p>
                </div>`;
    }
  }

  // === 5. EmailJS Contact Form Setup ===
  const contactForm = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");
  const formMessage = document.getElementById("form-message");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault(); // منع إعادة تحميل الصفحة

      // تغيير حالة الزرار عشان اليوزر يعرف إن الرسالة بتتبعت
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = "Sending...";
      submitBtn.disabled = true;

      // المتغيرات دي لازم تتأكد منها من حسابك
      const serviceID = "service_vpew8b6"; // الـ Service ID بتاعك (من الصورة)
      const templateID = "template_wc88al8"; // حط الـ Template ID اللي جبناه في الخطوة اللي فاتت

      // إرسال الفورم
      emailjs.sendForm(serviceID, templateID, this).then(
        () => {
          // لو الإرسال نجح
          formMessage.style.display = "block";
          formMessage.style.color = "#4CAF50"; // لون أخضر
          formMessage.innerText = "Your message has been sent successfully!";

          // تفريغ الحقول بعد الإرسال
          contactForm.reset();

          // إرجاع الزرار لشكله الطبيعي
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;

          // إخفاء رسالة النجاح بعد 5 ثواني
          setTimeout(() => {
            formMessage.style.display = "none";
          }, 5000);
        },
        (error) => {
          // لو حصل خطأ
          console.error("FAILED...", error);
          formMessage.style.display = "block";
          formMessage.style.color = "#f44336"; // لون أحمر
          formMessage.innerText =
            "Oops! Something went wrong. Please try again.";

          // إرجاع الزرار لشكله الطبيعي
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        },
      );
    });
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
