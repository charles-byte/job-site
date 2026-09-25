// Zoho Recruit settings. Keep these in sync with the "Embed Jobs" code in Zoho Recruit.
var ZOHO_CONFIG = {
  widget_id: "rec_job_listing_div",
  page_name: "Careers",
  source: "CareerSite",
  site: "https://careers.jkuates.co.ke",
  brand_color: "#058036",
  empty_job_msg: "There are no open positions right now. Please check back soon."
};

(function () {
  // Load Zoho job listings, or show a link to the Zoho portal if the widget is unavailable.
  var fallback = document.getElementById("jobs-fallback");
  var target = document.getElementById(ZOHO_CONFIG.widget_id);

  function showFallback() {
    // Zoho's "no jobs" message is a bare text node, so check text as well as elements
    if (fallback && target && !target.children.length && !target.textContent.trim()) fallback.hidden = false;
  }

  if (window.rec_embed_js && typeof window.rec_embed_js.load === "function") {
    window.rec_embed_js.load(ZOHO_CONFIG);
    setTimeout(showFallback, 8000);
  } else {
    showFallback();
  }

  // Mobile navigation
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Header shadow on scroll
  var header = document.querySelector(".header");
  window.addEventListener("scroll", function () {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }, { passive: true });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
