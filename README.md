# JKUATES Careers Site

This is a branded careers landing page for JKUAT Enterprises Ltd. It shows live job openings from **Zoho Recruit**, and the Zoho integration stays exactly as it is.

## How it works

```
Candidate
   │
   ▼
Branded careers page (this repo)          <- you control the design fully
   │  Zoho "Embed Jobs" widget pulls live openings
   ▼
Zoho Recruit hosted pages                 <- job details, apply form, candidate portal
(careers.jkuates.co.ke)                      styled with zoho/career-site-custom.css
   │
   ▼
Zoho Recruit ATS                          <- applications, pipelines, emails: unchanged
```

- **Jobs are never copied or hard-coded.** Zoho's own embed script loads them, so publishing or closing a job in Zoho updates this page automatically.
- **Applications are still handled by Zoho.** Clicking a job opens Zoho's job page and application form, so resume parsing, screening questions, notifications and workflows are not affected.
- If the Zoho script can't load, the page shows a button linking to the Zoho portal.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page content. Search for `EDIT:` comments to find text to confirm. |
| `assets/css/styles.css` | Design. Brand colours are in `:root` at the top. |
| `assets/js/main.js` | Zoho widget settings (`ZOHO_CONFIG`), mobile menu, fallback. |
| `assets/img/` | Favicon. Put a local copy of the logo here (see step 2). |
| `zoho/career-site-custom.css` | Paste into Zoho so job detail and apply pages match the new look. |

## Design and brand

The page is deliberately compact (about 2 to 3 screens) and puts vacancies first:

1. **Vacancies:** a short banner, with the Zoho job list overlapping it so jobs show without scrolling.
2. **How to apply:** four steps in one row plus a no-fees notice.
3. **Get in touch:** one card for candidates, one for clients who want JKUATES to recruit for them, plus phone, email, address and hours.

The style follows [acalconsulting.co.ke](https://acalconsulting.co.ke): floating white pill header, dark banner, headings with one word in serif italic, off-white sections, `[01]` numbering and pill buttons with a round arrow. Fonts are Inter Tight and Playfair Display (italic accents only).

Colours come from JKUATES, not ACAL:

| Token | Value | Source |
|---|---|---|
| `--brand` | `#058036` | Button green already used on the Zoho portal |
| `--lime` | `#9BCA3E` | Logo ring and jkuates.co.ke menu colour |
| `--deep` | `#0A2418` | Dark green for hero, CTA and footer (chosen to pair with the above) |

Contact details:
- Email: candidates recruitment@jkuates.jkuat.ac.ke; clients consultancy@jkuates.jkuat.ac.ke
- Phone for everyone: 0736 524200
- Address: JKUAT Main Campus, Juja. Hours: Mon to Fri 8am to 5pm (no Saturdays).

The "Before you apply" guidance is adapted from careersolutions.co.ke.

## Verified on 2026-09-25

- The v1.1 Zoho embed widget with `site: https://careers.jkuates.co.ke` loads on this page. The portal had no open jobs, so the widget showed the empty-state message. Job rows could not be checked yet.
- **Two separate Zoho career sites** (checked 2026-11-26). `careers.jkuates.co.ke` and `recruitment.jkuates.co.ke` are both DNS CNAMEs to Zoho's shared host (`recruit.cs.zohohost.com`), but they are **different career sites**:
  - `careers.jkuates.co.ke`: "JKUATES Recruitment Portal", green brand, carries the live jobs (e.g. CBK internship). **This is the site this page shows.** Linked from jkuates.co.ke as "JKUATES Client Recruitments".
  - `recruitment.jkuates.co.ke`: "Exciting Career Opportunities", Zoho's default purple, no jobs published. Linked from the jkuates.co.ke footer as "Recruitment". This is an older, separate Zoho Recruit account set up by a consultant before JKUATES had its own; it will be deleted or repurposed. Once it is retired, `recruitment.jkuates.co.ke` is free to reuse (e.g. as the new Zoho address in step 4b), and the jkuates.co.ke footer link should be updated.
  Do not repoint either of them.

## Steps to go live

### 1. Confirm the Zoho embed code
1. In Zoho Recruit go to **Setup > Job Boards > Career Site**, open the site, and find **Embed Jobs** (or "Get code").
2. Choose a layout/style and copy the code.
3. Compare it with the embed block in `index.html` and the `ZOHO_CONFIG` values in `assets/js/main.js` (`site`, `page_name`, `source`). If Zoho's code is different, use Zoho's values.

### 2. Brand it
- The header currently loads the logo from `jkuates.co.ke/index.php/images/logos/logo.png`. Save a local copy (ideally a transparent PNG or SVG from the brand team) to `assets/img/` and update the `<img>` path.
- If the brand team has official colour values, update the tokens at the top of `assets/css/styles.css` and `zoho/career-site-custom.css`.
- Go through the `EDIT:` comments in `index.html` (currently just the logo).

### 3. Style the Zoho-hosted pages
In Zoho Recruit, open your career site's **Customize / Theme** settings and:
- Upload the logo and set the brand colour.
- Paste `zoho/career-site-custom.css` into the **Custom CSS** box (availability depends on your Zoho edition).
- Point the header/menu links back to the new careers page and the main website.
- Preview the job list, a job detail page and the application form, then submit a test application to confirm it arrives in Zoho.

### 4. Hosting: `apply.jkuates.co.ke` on the jkuates.co.ke cPanel
The page lives at **`apply.jkuates.co.ke`**, a subdomain on the jkuates.co.ke cPanel hosting.
A cPanel cron job pulls the site from this (public) GitHub repo every 10 minutes and copies
`index.html` and `assets/` into the subdomain's folder. No FTP account or password is
needed (the hosting plan allows only one FTP account, used by e-learning). To publish a
change: commit and push to `claude/tender-ptolemy-gt93ih`, then wait up to 10 minutes.

One-time setup:

1. **cPanel > Domains > Create A New Domain:** `apply.jkuates.co.ke`. Note its Document Root
   (expected: `/apply.jkuates.co.ke`, i.e. `~/apply.jkuates.co.ke`). If DNS is managed outside
   this cPanel, add an A record for `apply` pointing to 102.130.123.19. Only this new record is added.
2. **cPanel > Git Version Control > Create:** turn on "Clone a Repository".
   - Clone URL: `https://github.com/charles-byte/job-site.git`
   - Repository Path: `repositories/job-site`
   - Repository Name: `job-site`
3. **cPanel > Cron Jobs > Add New Cron Job:** Common Settings "Once Per Ten Minutes"
   (`*/10 * * * *`), Command (one line):

   ```sh
   (cd "$HOME/repositories/job-site" && old=$(git rev-parse HEAD) && git fetch -q origin && git reset -q --hard origin/claude/tender-ptolemy-gt93ih && cp -f index.html "$HOME/apply.jkuates.co.ke/" && cp -Rf assets "$HOME/apply.jkuates.co.ke/" && if [ "$old" != "$(git rev-parse HEAD)" ]; then uapi NginxCaching clear_cache > /dev/null && date "+%F %T deployed $(git rev-parse --short HEAD), cache cleared"; fi) >> "$HOME/apply-deploy.log" 2>&1
   ```

   If step 1 gave a different Document Root, change both `$HOME/apply.jkuates.co.ke/` parts to it.
   The server has an NGINX cache in front of the site that keeps serving the old page after
   new files are copied. The command therefore clears that cache, but only when a new commit
   arrived. `~/apply-deploy.log` gets one "deployed ..., cache cleared" line per new commit,
   plus any errors. To clear it by hand: **cPanel > NGINX Caching > Clear Cache**.
4. **cPanel > SSL/TLS Status:** run AutoSSL for the subdomain so it loads over https.

Notes: only `index.html` and `assets/` are copied, so the README, `zoho/` notes and git files
are never public. Files deleted from the repo are not deleted from the server; remove them
in File Manager if needed.

**Do not touch `careers.jkuates.co.ke`.** It is Zoho's live career site and application form.
This page only *reads* the public job list from it; no DNS record, Zoho setting or link
for `careers.jkuates.co.ke` needs to change.

### 4b. Later: move this page to `careers.jkuates.co.ke`
Do this only when no recruitment is open on Zoho (e.g. after the CBK internship closes),
because it changes where `careers.jkuates.co.ke` points. The Zoho career site now on
`careers.jkuates.co.ke` needs a **new address** first. Do not use
`recruitment.jkuates.co.ke`: it is a different Zoho career site.

1. **Zoho:** give the "JKUATES Recruitment Portal" career site a new custom domain on an
   unused subdomain (to be chosen), make it the main domain, and remove
   `careers.jkuates.co.ke`. Open a job on the new address and submit a test application.
2. **Site code:** set `site` in `ZOHO_CONFIG` (`assets/js/main.js`) and the portal link in
   `index.html` to the new Zoho address; set canonical/og:url to
   `https://careers.jkuates.co.ke/`. Add an `.htaccess` that redirects `/jobs/...` to the
   new Zoho address, so old Zoho job links on job boards and in emails still reach the job.
3. **Deploy:** change the cron command's destination from `apply.jkuates.co.ke` to the
   `careers.jkuates.co.ke` folder in cPanel (it already exists: `/careers.jkuates.co.ke`),
   and copy `.htaccess` as well.
4. **DNS (last):** change `careers` from the Zoho CNAME to an A record for 102.130.123.19,
   then run AutoSSL for it. Make `apply.jkuates.co.ke` redirect to `careers.jkuates.co.ke`.

### 5. Test before announcing
- Page loads on desktop and mobile.
- Jobs appear and match what is published in Zoho.
- A test application goes all the way into Zoho Recruit.
- Old links shared on job boards (`careers.jkuates.co.ke/jobs/Careers/...`) still work.

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```
