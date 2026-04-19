/* ============================================
   XYNTHERA SYSTEMS — INTERACTIONS
   ============================================ */

(function () {
  "use strict";

  /* ---------- Nav: sticky shadow + mobile menu ---------- */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navMobile = document.getElementById("navMobile");

  const handleScroll = () => {
    if (window.scrollY > 10) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  if (navToggle && navMobile) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMobile.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navMobile.setAttribute("aria-hidden", isOpen ? "false" : "true");
    });
    // Close mobile menu when clicking a link
    navMobile.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        navMobile.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navMobile.setAttribute("aria-hidden", "true");
      });
    });
  }

  /* ---------- Smooth scroll with nav offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 72; // sticky nav height
      const top =
        target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealSelectors = [
    ".section__head",
    ".service-card",
    ".work-card",
    ".process-step",
    ".stack-col",
    ".quote",
    ".faq__item",
    ".contact__wrap",
  ];
  const revealEls = document.querySelectorAll(revealSelectors.join(","));

  revealEls.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    el.style.transition =
      "opacity .8s cubic-bezier(.22,.61,.36,1), transform .8s cubic-bezier(.22,.61,.36,1)";
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const siblings = el.parentElement
              ? Array.from(el.parentElement.children)
              : [];
            const index = siblings.indexOf(el);
            const delay = Math.min(index * 60, 300);
            setTimeout(() => {
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            }, delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }

  /* ---------- FAQ: close others on open (optional nice touch) ---------- */
  const faqItems = document.querySelectorAll(".faq__item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item) other.removeAttribute("open");
        });
      }
    });
  });

  /* ---------- Contact form: validation + fake submit ---------- */
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");

  if (form) {
    const showError = (field) => field && field.classList.add("has-error");
    const clearError = (field) => field && field.classList.remove("has-error");

    // Clear errors on input
    form.querySelectorAll("input, select, textarea").forEach((el) => {
      el.addEventListener("input", () => {
        const field = el.closest(".field");
        clearError(field);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;

      const name = form.querySelector("#name");
      const email = form.querySelector("#email");
      const message = form.querySelector("#message");

      [name, email, message].forEach((el) => {
        const field = el.closest(".field");
        if (!el.value.trim()) {
          showError(field);
          valid = false;
        }
      });

      // Basic email pattern
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email.value.trim() && !emailPattern.test(email.value.trim())) {
        showError(email.closest(".field"));
        valid = false;
      }

      if (!valid) return;

      // Simulate submit
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = "Sending…";

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        if (success) {
          success.hidden = false;
          setTimeout(() => {
            success.hidden = true;
          }, 6000);
        }
      }, 900);
    });
  }

  /* ---------- Year in footer (if needed) ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Parallax tilt for hero glow (subtle) ---------- */
  const glow = document.querySelector(".hero__glow");
  if (glow && window.matchMedia("(pointer: fine)").matches) {
    const hero = document.querySelector(".hero");
    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      glow.style.transform = `translateX(calc(-50% + ${x * 40}px)) translateY(${y * 20}px)`;
    });
  }
})();
