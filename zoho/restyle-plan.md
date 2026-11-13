# Restyling the Zoho career site (careers.jkuates.co.ke)

Goal: make the existing Zoho Recruit career site match the draft in `index.html`,
using only Zoho's own career site editor. The URL, job links, application form and
everything inside Zoho Recruit stay as they are.

Where: Zoho Recruit > Setup (gear) > Job Boards > Career Site > **Careers** site >
Edit / Customize. Menu names can vary slightly by Zoho edition.

## Ground rules

- Change only the look and the text. Do not delete, hide, rename or reorder
  application form fields, screening questions or job templates.
- Do not change the custom domain, the site URL (`/jobs/Careers`) or any job board
  or integration settings.
- Before editing, take screenshots of every page and setting you will change, so
  anything can be put back.
- Save as a draft and preview before publishing, if the editor allows it.

## Settings

| Area | Set to |
|---|---|
| Brand / primary colour | `#058036` |
| Secondary / accent colour (if offered) | `#9BCA3E` |
| Dark backgrounds (banner, footer, if offered) | `#0A2418` |
| Font | Inter Tight if listed, otherwise the closest clean sans-serif (Inter, Lato, Open Sans) |
| Buttons (if a style option exists) | Rounded / pill |
| Logo | Official JKUATES logo (currently at `https://jkuates.co.ke/index.php/images/logos/logo.png`), linking to `https://jkuates.co.ke` |
| Favicon (if offered) | JKUATES logo mark |

## Header menu

- Vacancies: the job list on this site
- Main website: `https://jkuates.co.ke`
- Contact us: the contact section below (or `https://jkuates.co.ke/index.php/contact.php`)

## Page sections, in this order

### 1. Banner
- Heading: **Current vacancies**
- Text: Join the team taking the University to the People. Select a role to read the full description and apply online.
- Background: solid `#0A2418`, or a dark-tinted campus or team photo if one is available.
- Button (if offered): "View vacancies", scrolling to the job list.

### 2. Job list
- Keep Zoho's job list and search/filter as they are. Only colours and fonts change.
- Empty-state message (if editable): There are no open positions right now. Please check back soon.

### 3. Before you apply (text or rich-text section)
Intro: A few minutes of preparation can save you time and help you submit a stronger, more complete application.

1. **Read the role carefully.** Check the duties, requirements, closing date and application instructions before you begin.
2. **Prepare your documents.** Have your updated CV, certificates and any other requested documents ready to upload.
3. **Complete all fields.** Give accurate details and fill in every mandatory field before you submit.
4. **Submit before the deadline.** Apply early so you have time to resolve any technical or document issue.

Then: Need help with your application? Email recruitment@jkuates.jkuat.ac.ke or call 0736 524200, and mention the role you are applying for.

Highlighted note: **JKUATES never charges candidates any fee at any stage of recruitment.**

### 4. Get in touch (text section, two columns if available)
- **For candidates:** Questions about a vacancy or your application? Our recruitment support team will get back to you. Please mention the role you are applying for. recruitment@jkuates.jkuat.ac.ke, 0736 524200.
- **For clients:** Need us to recruit for your organisation? We run recruitment on behalf of clients, from advertising to shortlisting and interviews. recruitment@jkuates.jkuat.ac.ke, 0736 524200.
- Post: P.O. Box 62000-00200, Nairobi
- Hours: Mon to Fri 8am to 5pm, Sat 9am to 1pm

### 5. Footer
- © JKUAT Enterprises Ltd. A state corporation fully owned by JKUAT.
- Link: jkuates.co.ke

## Custom CSS

If the editor has a Custom CSS box (often under Advanced or Theme), paste the whole
of `zoho/career-site-custom.css`. Skip this if the option is not there; the settings
above still give most of the look.

## Check before publishing

- [ ] Job list page on desktop and on a phone-width window
- [ ] One job's detail page
- [ ] The application form opens and all fields are still there
- [ ] Header and footer links work
- [ ] After publishing: one test application arrives in Zoho Recruit (then delete it)
