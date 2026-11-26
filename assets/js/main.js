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
    watchDeadlines();
  } else {
    showFallback();
  }

  // Show each job's deadline (Zoho's "Target Date") in place of the date opened.
  // Zoho only includes Target_Date in its public feed once that field is set to show
  // on the career site. Until then the date is hidden rather than showing the opening date.
  function watchDeadlines() {
    if (!target || !window.fetch || !window.MutationObserver) return;
    var deadlines = null;
    var feed = ZOHO_CONFIG.site + "/recruit/v2/public/Job_Openings?pagename=" +
      encodeURIComponent(ZOHO_CONFIG.page_name) + "&source=" + encodeURIComponent(ZOHO_CONFIG.source);

    fetch(feed).then(function (r) { return r.json(); }).then(function (res) {
      deadlines = {};
      (res.data || []).forEach(function (job) { deadlines[job.id] = job.Target_Date; });
      applyDeadlines(target, deadlines);
    }).catch(function () { deadlines = {}; applyDeadlines(target, deadlines); });

    // Zoho redraws the list after a search, so apply again whenever it changes
    new MutationObserver(function () { if (deadlines) applyDeadlines(target, deadlines); })
      .observe(target, { childList: true, subtree: true });
  }

  function applyDeadlines(root, deadlines) {
    var spans = root.querySelectorAll("span.zrsite_Date_Opened:not([data-deadline])");
    Array.prototype.forEach.call(spans, function (span) {
      span.setAttribute("data-deadline", "");
      var card = span.closest("ul.rec-job-info");
      var link = card && card.querySelector(".rec-job-title a");
      var id = link && (link.href.match(/\/(\d{6,})\//) || [])[1];
      var due = id && deadlines[id];
      if (due) {
        span.textContent = "Deadline: " + formatDate(due);
      } else {
        span.style.display = "none";
      }
    });
  }

  // Zoho sends dates as MM/DD/YYYY; show them as "20 Dec 2026" so they can't be misread
  function formatDate(value) {
    var m = String(value).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!m) return value;
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return Number(m[2]) + " " + months[Number(m[1]) - 1] + " " + m[3];
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
