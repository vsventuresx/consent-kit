# ConsentKit — VS Ventures edition

VS Ventures' privacy stack for client websites in Canada. It works on Webflow, WordPress and plain HTML.

It follows **PIPEDA** and **CASL**, and is ready for **Quebec Law 25**:
- Non-essential tracking stays **off until the visitor accepts**.
- French is built in.
- The banner, the preferences panel and the privacy policy's cookie table all come from one config, so they always match.

| File | What it is | Where it goes |
|---|---|---|
| `consent-kit.min.js` | The engine: banner, preferences, Google Consent Mode v2, script blocking, EN/FR | Served from this repo via jsDelivr |
| `consent-kit.js` | Readable source of the same file | Edit this, then rebuild the `.min.js` |
| `head-snippet.html` | Config + script tag for each client site | First thing in `<head>` |
| `privacy-policy.html` | Canadian privacy policy page | `/privacy-policy/` |
| `site-footer-links.html` | Privacy Policy · Cookie settings · Your privacy rights | Global footer |
| `email-footer.html` | CASL email footer (HTML + plain text) | Email templates |

> A strong starting point, not legal advice. Have counsel review each client's policy, especially in health, finance or other regulated industries.

---

## 1. Hosting

Every client site loads the same file:

```
https://cdn.jsdelivr.net/gh/vsventuresx/consent-kit@1/consent-kit.min.js
```

`@1` means every site automatically picks up any `v1.x.x` release.

**To release an update:**
1. Edit `consent-kit.js` and rebuild `consent-kit.min.js`.
2. Test on one site by pinning that site to the exact new version, e.g. `@1.0.1`.
3. Commit, then create a GitHub release with the next tag: `v1.0.1` for fixes, `v1.1.0` for new features.
4. Visit `https://purge.jsdelivr.net/gh/vsventuresx/consent-kit@1/consent-kit.min.js` to push it live now instead of within about 12 hours.
5. Only use `v2.0.0` for changes that could break existing installs.

jsDelivr needs this repo to stay **public**. Never commit client data, keys or passwords.

---

## 2. Install on a client site

1. **Head:** paste `head-snippet.html` as the first code in `<head>`.
   - **Webflow:** Site settings › Custom code › Head code, at the top. If the site uses Webflow's built-in Google Analytics field, remove it and add GA/GTM as custom code *below* the snippet.
   - **WordPress:** WPCode › Header, priority 1. **Remove any other cookie banner plugin.**
   - **Plain HTML:** first lines inside `<head>` on every page.
2. **Policy:** build `/privacy-policy/` from `privacy-policy.html`. Keep or delete the optional QUEBEC, SMS and AI blocks.
3. **Footer:** add `site-footer-links.html` to the global footer.
4. **Forms:** add the opt-in text from section 5.
5. **Email:** add `email-footer.html` to the client's email templates.
6. **Test:** run the launch checklist in section 7.

### Quebec or French sites
Set `lang: 'fr'` in the config. The banner, panel and cookie table all switch to French. Law 25 expects a French privacy policy for Quebec residents, so have the policy translated as well. Keep the QUEBEC blocks, and name the person in charge of personal information.

---

## 3. Making tracking obey the banner

**Google (GA4, Google Ads, GTM):** no changes needed. The kit sets Google Consent Mode v2 before Google's tags load, and updates it when the visitor makes a choice.

| Kit category | Google consent types |
|---|---|
| analytics | `analytics_storage` |
| marketing | `ad_storage`, `ad_user_data`, `ad_personalization` |
| functional | `functionality_storage`, `personalization_storage` |
| necessary | `security_storage` (always granted) |

**Everything else** (Meta Pixel, LinkedIn, TikTok, Hotjar, GHL chat/tracking): change the script's `type` and tag its category. It runs only after consent.

```html
<script type="text/plain" data-consent="marketing"> ...Meta Pixel code... </script>
<script type="text/plain" data-consent="functional" src="https://widgets.leadconnectorhq.com/loader.js" data-resources-url="..."></script>
```

**Embeds** (YouTube, booking calendars, maps):

```html
<iframe data-consent="functional" data-consent-src="https://www.youtube-nocookie.com/embed/VIDEO_ID" title="Video"></iframe>
```

**GTM triggers:** the kit pushes `consentkit_ready` on page load and `consentkit_update` whenever the visitor changes a choice. Both carry `consentkit: { functional, analytics, marketing }`.

**Revoking:** when someone turns a category off, the kit deletes that category's cookies and reloads the page so tags already loaded stop running.

---

## 4. Config reference

```js
window.ConsentKitConfig = {
  company: 'Acme Co.',
  policyUrl: '/privacy-policy/',
  mode: 'opt-in',            // default for this edition; don't change for Canadian clients
  lang: 'en',                // 'en' | 'fr'
  honorGPC: true,            // Global Privacy Control turns marketing off
  version: '1',              // bump to ask everyone again after adding a new tool
  cookieDays: 365,
  cookieDomain: '',          // '.example.com' to share the choice across subdomains
  layout: 'box',             // 'box' | 'bar'
  floatingButton: true,      // small "Privacy choices" button after a choice is made
  reloadOnRevoke: true,
  urlPassthrough: false,
  logEndpoint: '',           // optional: POST each consent record to a Make/Zapier webhook
  theme: { accent, accentText, background, text, muted, border, radius, font },
  text: { title, body, accept, reject, customize, save, ... },   // override any wording
  categories: [              // merged by id with: necessary, functional, analytics, marketing
    { id: 'analytics', cookies: [ { name, provider, purpose, duration } ], clear: ['_ga'] },
    { id: 'functional', disabled: true },
    { id: 'personalization', label: '...', description: '...', cookies: [] }
  ]
};
```

**Design:** *Accept all* is filled with `accent`. *Reject non-essential* uses the panel's `background` with an `accent` outline. Both buttons are the same size and sit in the same row. Keep it that way: a smaller or hidden reject option is what regulators treat as a dark pattern.

**API:** `ConsentKit.open()`, `.get()`, `.has('marketing')`, `.set({...})`, `.acceptAll()`, `.rejectAll()`, `.reset()`, `.on(fn)`, `.scan()`, `.render()`. The kit also dispatches a `consentkit:change` window event.

**Proof of consent:** each choice is stored with an ID, a timestamp, the source and the config version. Set `logEndpoint` to keep an auditable log. Bill C-36, if passed, is expected to require documented privacy practices.

---

## 5. Form opt-in text (CASL)

Keep consents **separate**. Leave marketing boxes **unchecked**, and never make marketing consent a condition of submitting a form.

**A. Contact / quote form.** A notice only, no checkbox. Place it by the submit button:
> By submitting this form, you agree that {{COMPANY_NAME}} may use your information to respond to your inquiry. See our [Privacy Policy](/privacy-policy/).

**B. Email marketing.** An optional, unchecked checkbox. This gives CASL express consent:
> ☐ Yes, I'd like to receive emails from {{COMPANY_LEGAL_NAME}} with {{TOPICS}}. I can unsubscribe at any time.

The same page must show the client's mailing address and an email or phone contact. The site footer usually covers this.

*Agency version*, when you collect for the client:
> ☐ Yes, I'd like to receive emails from {{CLIENT_LEGAL_NAME}} about {{TOPICS}}. I can unsubscribe at any time. This form is managed by VS Ventures on their behalf.

**C. Text messages.** An optional, unchecked checkbox:
> ☐ I agree to receive text messages from {{COMPANY_NAME}} about {{SMS_TOPICS}} at the number provided. Message frequency varies. Message and data rates may apply. Reply STOP to opt out. See our [Privacy Policy](/privacy-policy/).

**D. Newsletter-only form:**
> Get {{FREQUENCY}} tips from {{COMPANY_NAME}}. Unsubscribe anytime. [Privacy Policy](/privacy-policy/)

**E. Re-permission email.** Send this before an existing client's two-year implied-consent window ends:
> **Subject:** Want to keep hearing from us?
> We send {{COMPANY_NAME}} updates to clients like you. To keep receiving them, click below. If we don't hear from you, we'll stop emailing you by {{DATE}}.
> [Yes, keep me subscribed]

**Recording consent in GHL:** capture `consent_email` / `consent_sms`, `consent_date`, `consent_source` (page or form) and `consent_text_version`. Tag contacts by consent type (`consent:email-express`, `consent:email-implied`) and record the implied-consent expiry date so workflows can send the re-permission email on time.

---

## 6. Placeholders

`{{COMPANY_NAME}}` · `{{COMPANY_LEGAL_NAME}}` · `{{MAILING_ADDRESS}}` · `{{PHONE}}` · `{{WEBSITE_URL}}` · `{{WEBSITE_DOMAIN}}` · `{{CONTACT_EMAIL}}` · `{{PRIVACY_EMAIL}}` · `{{PRIVACY_OFFICER_NAME}}` · `{{PRIVACY_OFFICER_TITLE}}` · `{{LAST_UPDATED}}` · `{{WEBSITE_PLATFORM}}` · `{{PAYMENT_PROVIDERS}}` · `{{OTHER_PROVIDERS_OR_DELETE}}` · `{{EDIT_OR_REMOVE_IF_NOT_APPLICABLE}}` · `{{LEAD_RETENTION}}` · `{{CLIENT_RETENTION}}` · `{{SMS_TOPICS}}` · `{{REASON}}` · `{{UNSUBSCRIBE_URL}}` · `{{PREFERENCES_URL}}`

Search each file for `{{` before publishing. None should remain.

---

## 7. Launch checklist

- [ ] Private window: the banner appears, and no `_ga` or `_fbp` cookies exist yet (DevTools › Application › Cookies).
- [ ] **Reject non-essential:** still no analytics or marketing cookies, and the Meta Pixel doesn't fire (Pixel Helper).
- [ ] **Privacy choices** › turn Analytics on › Save: `_ga` appears and GA4 Realtime shows the visit.
- [ ] Turn Analytics off: the page reloads and `_ga` is gone.
- [ ] Footer "Cookie settings" opens the panel, and so does `/privacy-policy/#cookie-settings`.
- [ ] `/privacy-policy/` shows the cookie table and the visitor's current choices.
- [ ] Tag Assistant shows consent *default* before *update*.
- [ ] Forms have the notice, and marketing boxes are unchecked and optional.
- [ ] Test email: the footer shows identity, address, contact and a working unsubscribe.
- [ ] No `{{placeholders}}` remain.
- [ ] Log the site, date and version in the VS Ventures client privacy log.
