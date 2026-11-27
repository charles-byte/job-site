// Zoho Recruit settings. Keep these in sync with the "Embed Jobs" code in Zoho Recruit.
var ZOHO_CONFIG = {
  widget_id: "rec_job_listing_div",
  page_name: "Careers",
  source: "CareerSite",
  site: "https://careers.jkuates.co.ke",
  brand_color: "#058036",
  empty_job_msg: "There are no open positions right now. Please check back soon."
};

// Order of the date parts Zoho sends, which follows the date format set in Zoho Recruit.
// "DMY" for 20/11/2026, "MDY" for 11/20/2026. The page also checks the dates Zoho sends
// and switches automatically if one can only be read the other way (e.g. 20/11).
var ZOHO_DATE_ORDER = "DMY";

// API name of the Zoho field shown as "Deadline" on each job card
var ZOHO_DEADLINE_FIELD = "Target_Date";

(function () {
  // Load Zoho job listings, or show a link to the Zoho portal if the widget is unavailable.
  var fallback = document.getElementById("jobs-fallback");
  var target = document.getElementById(ZOHO_CONFIG.widget_id);

  function showFallback() {
    // Zoho's "no jobs" message is a bare text node, so check text as well as elements
    if (fallback && target && !target.children.length && !target.textContent.trim()) fallback.hidden = false;
  }

  // Wording for Zoho's search box (Zoho's default is "Job title or skill")
  var SEARCH_PLACEHOLDER = "Job title or position";
  // Zoho adds the search row above the job list, inside .embed_jobs_head
  var widget = document.querySelector(".embed_jobs_head");
  function relabelSearch() {
    var box = widget && widget.querySelector("input.searchWhat");
    if (box && box.placeholder !== SEARCH_PLACEHOLDER) {
      box.placeholder = SEARCH_PLACEHOLDER;
      box.setAttribute("aria-label", SEARCH_PLACEHOLDER);
    }
  }

  if (window.rec_embed_js && typeof window.rec_embed_js.load === "function") {
    window.rec_embed_js.load(ZOHO_CONFIG);
    if (widget && window.MutationObserver) {
      relabelSearch();
      new MutationObserver(relabelSearch).observe(widget, { childList: true, subtree: true });
    }
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
      encodeURIComponent(ZOHO_CONFIG.page_name) + "&source=" + encodeURIComponent(ZOHO_CONFIG.source) +
      // Zoho only returns extra fields that are asked for by name
      "&extra_fields=" + encodeURIComponent(JSON.stringify([ZOHO_DEADLINE_FIELD]));

    fetch(feed).then(function (r) { return r.json(); }).then(function (res) {
      deadlines = {};
      (res.data || []).forEach(function (job) {
        deadlines[job.id] = job[ZOHO_DEADLINE_FIELD];
        detectDateOrder([job[ZOHO_DEADLINE_FIELD], job.Date_Opened]);
      });
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
      if (due && isPast(due)) {
        // Safety net: Zoho unpublishes jobs after their deadline, but never show one here
        card.style.display = "none";
        card.setAttribute("data-expired", "");
      } else if (due) {
        span.textContent = "Deadline: " + formatDate(due);
      } else {
        span.style.display = "none";
      }
    });
    showEmptyIfAllExpired(root);
  }

  // If every listed job is past its deadline, say so instead of showing a blank list
  function showEmptyIfAllExpired(root) {
    var cards = root.querySelectorAll("ul.rec-job-info");
    var expired = root.querySelectorAll("ul.rec-job-info[data-expired]");
    if (!cards.length || cards.length !== expired.length || root.querySelector(".jobs-empty")) return;
    var msg = document.createElement("p");
    msg.className = "jobs-empty";
    msg.textContent = ZOHO_CONFIG.empty_job_msg;
    root.appendChild(msg);
  }

  // True once the whole deadline day has passed (the job is open until the end of that day)
  function isPast(value) {
    var d = parseDate(value);
    if (!d) return false;
    return new Date() > new Date(d.year, d.month - 1, d.day, 23, 59, 59);
  }

  // A date like 20/11/2026 can only be day-first, and 11/20/2026 only month-first
  function detectDateOrder(values) {
    values.forEach(function (value) {
      var m = String(value).match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);
      if (!m) return;
      if (Number(m[1]) > 12) ZOHO_DATE_ORDER = "DMY";
      else if (Number(m[2]) > 12) ZOHO_DATE_ORDER = "MDY";
    });
  }

  // Read a Zoho date (e.g. 10/12/2026) using the detected day/month order
  function parseDate(value) {
    var m = String(value).match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);
    if (!m) return null;
    var day = Number(ZOHO_DATE_ORDER === "DMY" ? m[1] : m[2]);
    var month = Number(ZOHO_DATE_ORDER === "DMY" ? m[2] : m[1]);
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    return { day: day, month: month, year: Number(m[3]) };
  }

  // Show Zoho's numeric dates as "20 Dec 2026" so they can't be misread
  function formatDate(value) {
    var d = parseDate(value);
    if (!d) return value;
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return d.day + " " + months[d.month - 1] + " " + d.year;
  }
  // Moving banner background: slowly shifting green "contour" bands, in the spirit of the
  // looping video on acalconsulting.co.ke but drawn in the browser (nothing to download).
  // Only runs with ?hero=flow for now. Pauses when the banner is off screen, and stays
  // still for visitors who have asked their device to reduce motion.
  if (document.documentElement.classList.contains("hero-flow")) heroFlow();

  function heroFlow() {
    var hero = document.querySelector(".hero");
    var canvas = document.createElement("canvas");
    if (!hero || !canvas.getContext) return;
    canvas.className = "hero__flow";
    canvas.setAttribute("aria-hidden", "true");
    hero.insertBefore(canvas, hero.firstChild);
    var ctx = canvas.getContext("2d");
    var CELL = 6;                       // one canvas pixel per 6 screen pixels; the browser smooths it
    var BANDS = 7;                      // number of terraces
    var dark = [10, 36, 24];            // --deep
    var light = [5, 128, 54];           // --brand
    var w, h, img, visible = true, last = 0;
    var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      w = Math.max(1, Math.ceil(hero.offsetWidth / CELL));
      h = Math.max(1, Math.ceil(hero.offsetHeight / CELL));
      canvas.width = w; canvas.height = h;
      img = ctx.createImageData(w, h);
      draw(last);
    }

    function draw(time) {
      var t = time / 1000 * 0.12, d = img.data, i = 0;
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          var u = x * CELL / 170, v = y * CELL / 170;
          var n = Math.sin(u * 1.3 + t) + Math.sin(v * 1.9 - t * 0.8) +
                  Math.sin((u + v) * 0.8 + t * 0.6) + Math.sin(Math.sqrt((u - 4) * (u - 4) + (v - 1) * (v - 1)) * 1.5 - t * 1.2);
          n = (n + 4) / 8 * BANDS;
          var band = Math.floor(n), edge = n - band;
          // each band a step lighter, with a soft highlight along its upper edge
          var k = (band / BANDS) * 0.8 + edge * 0.08 + (edge > 0.85 ? 0.1 : 0);
          k = Math.max(0, Math.min(1, k));
          d[i++] = dark[0] + (light[0] - dark[0]) * k;
          d[i++] = dark[1] + (light[1] - dark[1]) * k;
          d[i++] = dark[2] + (light[2] - dark[2]) * k;
          d[i++] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
    }

    function frame(now) {
      requestAnimationFrame(frame);
      if (!visible || now - last < 40) return;   // about 25 frames a second is plenty
      last = now;
      draw(now);
    }

    resize();
    window.addEventListener("resize", resize);
    if (still) return;
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(hero);
    }
    requestAnimationFrame(frame);
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
