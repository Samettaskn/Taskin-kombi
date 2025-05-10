document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  // Mobil cihaz kontrolü
  const isMobile = window.innerWidth <= 768;

  // Set current year in copyright
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  // Mobile menu toggle
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (event) {
    const isClickInside =
      hamburger.contains(event.target) || navLinks.contains(event.target);

    if (!isClickInside) {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    }
  });

  // Close mobile menu when clicking on a menu item
  const navItems = document.querySelectorAll(".nav-links a");
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector("header").offsetHeight;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Form validation
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Basic form validation
      let isValid = true;
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const message = document.getElementById("message").value.trim();

      // Simple validation checks
      if (name === "") {
        isValid = false;
        highlightField("name");
      }

      if (email === "" || !isValidEmail(email)) {
        isValid = false;
        highlightField("email");
      }

      if (phone === "" || !isValidPhone(phone)) {
        isValid = false;
        highlightField("phone");
      }

      if (message === "") {
        isValid = false;
        highlightField("message");
      }

      if (isValid) {
        // Here you would typically send the form data to a server
        // For now, let's just show a success message
        const formContainer = contactForm.parentElement;
        formContainer.innerHTML = `
          <div class="success-message">
            <h3>Teşekkürler!</h3>
            <p>Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.</p>
          </div>
        `;
      }
    });
  }

  // Helper functions for form validation
  function highlightField(fieldId) {
    const field = document.getElementById(fieldId);
    field.classList.add("error");

    field.addEventListener(
      "input",
      function () {
        field.classList.remove("error");
      },
      { once: true }
    );
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPhone(phone) {
    const phoneRegex = /^[\d\s()+\-]{7,15}$/;
    return phoneRegex.test(phone);
  }

  // Lazy loading for images
  const lazyImages = document.querySelectorAll("img[loading='lazy']");
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target;
          image.src = image.dataset.src;
          imageObserver.unobserve(image);
        }
      });
    });

    lazyImages.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    lazyImages.forEach((img) => {
      img.src = img.dataset.src;
    });
  }

  // Mobile responsiveness improvements
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  if (testimonialCards.length > 0) {
    let currentIndex = 0;
    const testimonialSlider = document.querySelector(".testimonials-slider");
    const sliderDots = document.querySelectorAll(".slider-dot");

    // Mobil cihazlarda slider fonksiyonlarını devre dışı bırak
    if (isMobile && testimonialSlider) {
      // Slider dots kontrollerini gizle
      if (sliderDots) {
        sliderDots.forEach((dot) => {
          dot.style.display = "none";
        });
      }
    }
    // Sadece masaüstü için slider fonksiyonlarını etkinleştir
    else {
      // Function to go to slide
      function goToSlide(index) {
        if (index < 0) {
          index = testimonialCards.length - 1;
        } else if (index >= testimonialCards.length) {
          index = 0;
        }

        currentIndex = index;

        // Update active dot
        sliderDots.forEach((dot, i) => {
          dot.classList.toggle("active", i === currentIndex);
        });

        // Scroll to the selected card
        const cardWidth = testimonialCards[0].offsetWidth;
        const scrollPosition = cardWidth * currentIndex + currentIndex * 20; // 20px is the gap

        testimonialSlider.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }

      // Event listeners for dots
      sliderDots.forEach((dot, index) => {
        dot.addEventListener("click", () => goToSlide(index));
      });

      // Touch swipe functionality
      let touchStartX = 0;
      let touchEndX = 0;

      function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
      }

      function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }

      testimonialSlider.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });

      testimonialSlider.addEventListener("touchend", handleTouchEnd, {
        passive: true,
      });

      function handleSwipe() {
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
          // Minimum swipe distance
          if (diff > 0) {
            // Swipe left - next slide
            goToSlide(currentIndex + 1);
          } else {
            // Swipe right - previous slide
            goToSlide(currentIndex - 1);
          }
        }
      }

      // Auto-scroll functionality for the slider
      let autoScrollInterval;

      function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
          goToSlide(currentIndex + 1);
        }, 5000); // Change slide every 5 seconds
      }

      function stopAutoScroll() {
        clearInterval(autoScrollInterval);
      }

      // Start auto-scroll
      startAutoScroll();

      // Stop on hover or touch
      testimonialSlider.addEventListener("mouseenter", stopAutoScroll);
      testimonialSlider.addEventListener("touchstart", stopAutoScroll, {
        passive: true,
      });

      // Resume on mouse leave
      testimonialSlider.addEventListener("mouseleave", startAutoScroll);

      // Update on window resize
      window.addEventListener("resize", () => {
        // Ekran genişliği mobil boyutuna gelirse slider fonksiyonlarını devre dışı bırak
        if (window.innerWidth <= 768) {
          clearInterval(autoScrollInterval);
        } else {
          goToSlide(currentIndex);
        }
      });
    }
  }

  // Add active class to current navigation item based on scroll position
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    let scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document
          .querySelector(`.nav-links a[href="#${sectionId}"]`)
          .classList.add("active");
      } else {
        document
          .querySelector(`.nav-links a[href="#${sectionId}"]`)
          .classList.remove("active");
      }
    });
  });
});
