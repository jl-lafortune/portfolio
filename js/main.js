/* LAFORTUNE Jean-Luc — Portfolio — main.js */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var html = document.documentElement;

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Theme toggle (light/dark) ----------
     The actual [data-theme="light"] attribute is applied synchronously by
     an inline script in <head> (reads localStorage before first paint, so
     there's no flash of the wrong theme). This just wires up the button
     to flip it and persist the choice. Default with no stored choice, or
     if localStorage is unavailable, stays the site's designed dark theme. */
  var themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var isLight = html.getAttribute("data-theme") === "light";
      if (isLight) {
        html.removeAttribute("data-theme");
        try { localStorage.setItem("theme", "dark"); } catch (e) {}
      } else {
        html.setAttribute("data-theme", "light");
        try { localStorage.setItem("theme", "light"); } catch (e) {}
      }
    });
  }

  /* ---------- Header scroll state + progress bar ---------- */
  var header = document.querySelector(".site-header");
  var progress = document.querySelector(".progress");

  function onScroll() {
    var y = window.scrollY || html.scrollTop;
    if (header) header.classList.toggle("is-scrolled", y > 12);
    if (progress) {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (y / max) * 100 : 0;
      progress.style.width = pct + "%";
    }
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector(".burger");
  var mobileMenu = document.querySelector(".mobile-menu");
  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileMenu.classList.remove("is-open");
        burger.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Scroll reveal (progressive enhancement) ---------- */
  /* Default state (no JS, or this code fails) = fully visible — see .reveal
     in style.css, which has no opacity rule on its own. Only once we get
     here do elements below the fold get marked ".pending" (hidden) so they
     can animate in as they're scrolled into view via ".animate-in". A
     timeout force-reveals anything left pending as a last-resort safety net. */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  revealEls.forEach(function (el, i) { el.style.setProperty("--i", i % 8); });

  if ("IntersectionObserver" in window && !reduceMotion) {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.remove("pending");
            entry.target.classList.add("animate-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    revealEls.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var alreadyVisible = rect.top < vh * 0.92;
      if (alreadyVisible) {
        el.classList.add("animate-in");
      } else {
        el.classList.add("pending");
        io.observe(el);
      }
    });

    // Safety net: if anything is still pending after 4s (observer missed it,
    // layout shifted, etc.), reveal it immediately rather than leave it hidden.
    setTimeout(function () {
      document.querySelectorAll(".reveal.pending").forEach(function (el) {
        el.classList.remove("pending");
        el.classList.add("animate-in");
      });
    }, 4000);
  }

  /* ---------- Custom cursor (fine pointers only) ---------- */
  var canHover = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  if (canHover && !reduceMotion) {
    var dot = document.createElement("div");
    dot.className = "cursor-dot";
    document.body.appendChild(dot);
    var mx = 0, my = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; });
    (function raf() {
      cx += (mx - cx) * 0.22;
      cy += (my - cy) * 0.22;
      dot.style.transform = "translate(" + cx + "px," + cy + "px) translate(-50%,-50%)";
      requestAnimationFrame(raf);
    })();
    document.querySelectorAll("a, button, .work-card, .gallery-item").forEach(function (el) {
      el.addEventListener("mouseenter", function () { dot.classList.add("is-active"); });
      el.addEventListener("mouseleave", function () { dot.classList.remove("is-active"); });
    });
  }

  /* ---------- Filter tabs (travaux.html) ---------- */
  var filterBar = document.querySelector(".filter-bar");
  if (filterBar) {
    var items = document.querySelectorAll(".gallery-item");
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;
      filterBar.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var cat = btn.dataset.filter;
      items.forEach(function (item) {
        var match = cat === "tous" || item.dataset.category === cat;
        item.classList.toggle("is-hidden", !match);
      });
    });
  }

  /* ---------- Lightbox ---------- */
  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var lbImg = lightbox.querySelector("img");
    var lbTitle = lightbox.querySelector(".lb-title");
    var lbDesc = lightbox.querySelector(".lb-desc");
    var lbClose = lightbox.querySelector(".lightbox-close");

    document.querySelectorAll("[data-lightbox]").forEach(function (trigger) {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        lbImg.src = trigger.dataset.lightbox;
        lbImg.alt = trigger.dataset.title || "";
        if (lbTitle) lbTitle.textContent = trigger.dataset.title || "";
        if (lbDesc) lbDesc.textContent = trigger.dataset.desc || "";
        lightbox.classList.add("is-open");
        document.body.style.overflow = "hidden";
      });
    });
    function closeLb() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    }
    if (lbClose) lbClose.addEventListener("click", closeLb);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLb();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLb();
    });
  }

  /* ---------- Active nav link ---------- */
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-desktop a, .mobile-menu a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      a.classList.add("is-active");
    }
  });
})();
