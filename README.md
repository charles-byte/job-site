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
| `assets/img/` | Add `logo.svg` (or change the `<img>` path to a PNG). |
| `zoho/career-site-custom.css` | Paste into Zoho so job detail and apply pages match the new look. |

## Steps to go live

### 1. Confirm the Zoho embed code
1. In Zoho Recruit go to **Setup > Job Boards > Career Site**, open the site, and find **Embed Jobs** (or "Get code").
2. Choose a layout/style and copy the code.
3. Compare it with the embed block in `index.html` and the `ZOHO_CONFIG` values in `assets/js/main.js` (`site`, `page_name`, `source`). If Zoho's code is different, use Zoho's values.

### 2. Brand it
- Add the official logo to `assets/img/logo.svg`.
- Change the colour tokens at the top of `assets/css/styles.css` (and `zoho/career-site-custom.css`) to the official brand colours.
- Go through the `EDIT:` comments in `index.html` (contact email, company copy, FAQ answers).

### 3. Style the Zoho-hosted pages
In Zoho Recruit, open your career site's **Customize / Theme** settings and:
- Upload the logo and set the brand colour.
- Paste `zoho/career-site-custom.css` into the **Custom CSS** box (availability depends on your Zoho edition).
- Point the header/menu links back to the new careers page and the main website.
- Preview the job list, a job detail page and the application form, then submit a test application to confirm it arrives in Zoho.

### 4. Host the page (pick one)
| Option | Effort | Notes |
|---|---|---|
| **A. `jkuates.co.ke/careers`** on the existing website | Low | Upload `index.html` and `assets/` to a `/careers` folder, or paste the sections into a CMS page. Keep `careers.jkuates.co.ke` pointing to Zoho. **Recommended.** |
| **B. New subdomain**, e.g. `jobs.jkuates.co.ke`, on GitHub Pages / Netlify / Vercel (free) | Low | Add a CNAME record for the new subdomain only. Zoho's DNS is not touched. |
| **C. Take over `careers.jkuates.co.ke`** | Medium | First move Zoho to another subdomain in Zoho's custom domain settings, update the Zoho CNAME, then update `site` in `ZOHO_CONFIG` and all portal links. Do this only after A or B is tested, because it changes live application links. |

**Important:** do not change the existing `careers.jkuates.co.ke` DNS record unless you are doing option C. That record is what keeps the Zoho portal working.

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
