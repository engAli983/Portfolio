document.addEventListener('DOMContentLoaded', () => {
    // === Sticky Header ===
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // === Mobile Menu ===
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuBtn.classList.remove('active');
        });
    });

    // === Dynamic Projects Loading ===
    const projectsContainer = document.getElementById('projects-grid');
    
    async function loadProjects() {
        try {
            const response = await fetch('projects.json');
            const projects = await response.json();
            
            projectsContainer.innerHTML = projects.map(project => `
                <article class="project-card fade-in">
                    <div class="card-image">
                        <img src="${project.image}" alt="${project.title}" loading="lazy">
                        <div class="card-overlay">
                            <a href="${project.link}" target="_blank" class="btn btn-primary">View Project</a>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="tags">
                            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                    </div>
                </article>
            `).join('');
            
            // Re-trigger animations for new elements
            observeElements();
            
        } catch (error) {
            console.error('Error loading projects:', error);
            projectsContainer.innerHTML = '<p class="error">Failed to load projects.</p>';
        }
    }

    loadProjects();

    // === Intersection Observer for Animations ===
    function observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-in, .slide-up').forEach(el => observer.observe(el));
    }

    observeElements();
});
