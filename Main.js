
document.addEventListener("DOMContentLoaded", () => {
  // 1. Sticky Navbar on Scroll
  const header = document.getElementById("main-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // 2. Active Link Management on Scroll (IntersectionObserver)
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section, footer");

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -60% 0px", // Detect section when it's in the middle of the screen
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        if (id) {
          navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${id}`) {
              link.classList.add("active");
            }
          });
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });

  // 3. Process Section Dynamic Tooltips / Info update
  const processSteps = document.querySelectorAll(".process-step");
  const detailsBox = document.getElementById("process-details");

  processSteps.forEach(step => {
    step.addEventListener("mouseenter", () => {
      const stepNum = step.getAttribute("data-step");
      const label = step.querySelector(".process-label").textContent;
      const desc = step.getAttribute("data-desc");

      detailsBox.innerHTML = `<strong>${stepNum} ${label}:</strong> &nbsp;${desc}`;
      detailsBox.style.borderLeftColor = "#B4171E";
      detailsBox.style.transform = "translateX(5px)";
    });

    step.addEventListener("mouseleave", () => {
      detailsBox.style.transform = "translateX(0)";
    });
  });

  // 4. Smooth Scrolling for internal anchor links
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      // Check if href is an anchor link
      if (href.startsWith("#")) {
        e.preventDefault();
        const targetSection = document.querySelector(href);
        if (targetSection) {
          // Collapse responsive menu if open
          const navbarCollapse = document.getElementById("navbarNav");
          if (navbarCollapse.classList.contains("show")) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            bsCollapse.hide();
          }

          const offsetTop = targetSection.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth"
          });
        }
      }
    });
  });

  // 5. Hero image slider auto-rotation with back-and-forth sequencing
  const slidesContainer = document.getElementById('slides');
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('dotsContainer');

  let currentIndex = 0;
  let direction = 'forward';
  const total = slides.length;
  const AUTO_DELAY = 3000;
  let autoplayInterval = null;

  function updateActiveDot() {
    const allDots = document.querySelectorAll('.dot');
    allDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function createDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      dot.setAttribute('data-index', i);
      dot.addEventListener('click', () => {
        currentIndex = i;
        direction = i === total - 1 ? 'backward' : i === 0 ? 'forward' : direction;
        goToSlide(i);
        resetAutoplayTimer();
      });
      dotsContainer.appendChild(dot);
    }
    updateActiveDot();
  }

  function goToSlide(index) {
    if (!slidesContainer) return;
    currentIndex = index;
    const offset = -currentIndex * 100;
    slidesContainer.style.transform = `translateX(${offset}%)`;
    updateActiveDot();
  }

  function nextSlide() {
    if (direction === 'forward') {
      if (currentIndex < total - 1) {
        currentIndex += 1;
      } else {
        direction = 'backward';
      }
    } else {
      if (currentIndex > 0) {
        currentIndex -= 1;
      } else {
        direction = 'forward';
      }
    }
    goToSlide(currentIndex);
  }

  function startAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
    autoplayInterval = setInterval(nextSlide, AUTO_DELAY);
  }

  function resetAutoplayTimer() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }
    startAutoplay();
  }

  createDots();
  goToSlide(0);
  startAutoplay();
});