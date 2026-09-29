/*!
 * ConsentKit v1.0.3 — VS Ventures edition
 * Cookie consent banner + preferences + Google Consent Mode v2.
 * Default: opt-in (PIPEDA / CASL / Quebec Law 25). EN + FR-CA.
 * Works on plain HTML, WordPress and Webflow. No dependencies.
 *
 * INSTALL: load in <head>, BEFORE Google tags / GTM / Meta Pixel,
 *          WITHOUT async or defer. Configure with window.ConsentKitConfig
 *          (see README.md). Everything below is the engine — edit the config,
 *          not this file.
 */
(function (w, d) {
  'use strict';
  if (w.ConsentKit) return;

  /* ------------------------------------------------------------------ */
  /* 1. Default copy (EN + FR-CA) and categories                          */
  /* ------------------------------------------------------------------ */
  var STRINGS = {
    en: {
      title: 'We value your privacy',
      bodyOptIn: 'We use cookies and similar tools to run this site, understand how it\u2019s used and, with your permission, measure and personalize our ads. Non-essential cookies stay off unless you turn them on.',
      bodyOptOut: 'We use cookies and similar tools to run this site, understand how it\u2019s used and show you relevant ads. You can turn off non-essential cookies at any time.',
      accept: 'Accept all',
      reject: 'Reject non-essential',
      customize: 'Customize',
      save: 'Save my choices',
      prefsTitle: 'Privacy choices',
      prefsIntro: 'Choose which cookies we can use. Strictly necessary cookies are always on because the site needs them to work. You can change your choices any time with the \u201cPrivacy choices\u201d button or the link in our footer.',
      policyLink: 'Privacy Policy',
      alwaysOn: 'Always on',
      close: 'Close',
      floating: 'Privacy choices',
      gpcNote: 'Your browser sent a Global Privacy Control signal, so marketing cookies are off.',
      thCookie: 'Cookie', thProvider: 'Provider', thPurpose: 'Purpose', thDuration: 'Duration',
      none: 'No cookies in this category are currently in use.',
      on: 'On', off: 'Off', notSet: 'You haven\u2019t made a choice yet.', updated: 'Last updated'
    },
    fr: {
      title: 'Votre vie priv\u00e9e compte',
      bodyOptIn: 'Nous utilisons des t\u00e9moins (cookies) et des outils semblables pour faire fonctionner ce site, comprendre son utilisation et, avec votre permission, mesurer et personnaliser nos publicit\u00e9s. Les t\u00e9moins non essentiels restent d\u00e9sactiv\u00e9s \u00e0 moins que vous les activiez.',
      bodyOptOut: 'Nous utilisons des t\u00e9moins et des outils semblables pour faire fonctionner ce site, comprendre son utilisation et vous montrer des publicit\u00e9s pertinentes. Vous pouvez d\u00e9sactiver les t\u00e9moins non essentiels en tout temps.',
      accept: 'Tout accepter',
      reject: 'Refuser les non essentiels',
      customize: 'Personnaliser',
      save: 'Enregistrer mes choix',
      prefsTitle: 'Choix de confidentialit\u00e9',
      prefsIntro: 'Choisissez les t\u00e9moins que nous pouvons utiliser. Les t\u00e9moins strictement n\u00e9cessaires sont toujours actifs, car le site en a besoin pour fonctionner. Vous pouvez modifier vos choix en tout temps avec le bouton \u00ab\u00a0Choix de confidentialit\u00e9\u00a0\u00bb ou le lien au bas de la page.',
      policyLink: 'Politique de confidentialit\u00e9',
      alwaysOn: 'Toujours actifs',
      close: 'Fermer',
      floating: 'Choix de confidentialit\u00e9',
      gpcNote: 'Votre navigateur a envoy\u00e9 un signal Global Privacy Control\u00a0; les t\u00e9moins marketing sont donc d\u00e9sactiv\u00e9s.',
      thCookie: 'T\u00e9moin', thProvider: 'Fournisseur', thPurpose: 'Finalit\u00e9', thDuration: 'Dur\u00e9e',
      none: 'Aucun t\u00e9moin de cette cat\u00e9gorie n\u2019est utilis\u00e9 actuellement.',
      on: 'Activ\u00e9', off: 'D\u00e9sactiv\u00e9', notSet: 'Vous n\u2019avez pas encore fait de choix.', updated: 'Derni\u00e8re mise \u00e0 jour'
    }
  };

  var CATEGORIES = {
    en: [
      { id: 'necessary', required: true, label: 'Strictly necessary',
        description: 'Needed for the site to work, such as security, form submission and remembering your cookie choices. These can\u2019t be turned off.',
        cookies: [{ name: 'ck_consent', provider: 'This website', purpose: 'Remembers your cookie choices', duration: '12 months' }] },
      { id: 'functional', label: 'Functional',
        description: 'Enable extra features like live chat, booking calendars and embedded video. Turning these off may stop some features from working.',
        cookies: [], clear: [] },
      { id: 'analytics', label: 'Analytics',
        description: 'Help us understand how visitors use the site, such as which pages are popular, so we can improve it. Reports are aggregated.',
        cookies: [
          { name: '_ga', provider: 'Google Analytics', purpose: 'Distinguishes unique visitors', duration: '2 years' },
          { name: '_ga_*', provider: 'Google Analytics', purpose: 'Keeps track of your session', duration: '2 years' }
        ], clear: ['_ga', '_gid', '_gat'] },
      { id: 'marketing', label: 'Marketing',
        description: 'Let us and our advertising partners (such as Google and Meta) measure ad performance and show you relevant ads on other sites.',
        cookies: [
          { name: '_gcl_au', provider: 'Google Ads', purpose: 'Measures conversions from ad clicks', duration: '3 months' },
          { name: '_fbp', provider: 'Meta', purpose: 'Delivers and measures Meta ads', duration: '3 months' },
          { name: '_fbc', provider: 'Meta', purpose: 'Stores the last Meta ad click', duration: '3 months' }
        ], clear: ['_gcl', '_fbp', '_fbc', '_uet', '_ttp', 'li_', '_rdt'] }
    ],
    fr: [
      { id: 'necessary', required: true, label: 'Strictement n\u00e9cessaires',
        description: 'Requis pour le fonctionnement du site, comme la s\u00e9curit\u00e9, l\u2019envoi de formulaires et la m\u00e9morisation de vos choix. Ils ne peuvent pas \u00eatre d\u00e9sactiv\u00e9s.',
        cookies: [{ name: 'ck_consent', provider: 'Ce site', purpose: 'M\u00e9morise vos choix relatifs aux t\u00e9moins', duration: '12 mois' }] },
      { id: 'functional', label: 'Fonctionnels',
        description: 'Permettent des fonctions suppl\u00e9mentaires comme le clavardage en direct, les calendriers de r\u00e9servation et les vid\u00e9os int\u00e9gr\u00e9es. Les d\u00e9sactiver peut emp\u00eacher certaines fonctions de marcher.',
        cookies: [], clear: [] },
      { id: 'analytics', label: 'Analytiques',
        description: 'Nous aident \u00e0 comprendre comment les visiteurs utilisent le site, par exemple les pages les plus consult\u00e9es, afin de l\u2019am\u00e9liorer. Les rapports sont agr\u00e9g\u00e9s.',
        cookies: [
          { name: '_ga', provider: 'Google Analytics', purpose: 'Distingue les visiteurs uniques', duration: '2 ans' },
          { name: '_ga_*', provider: 'Google Analytics', purpose: 'Suit votre session', duration: '2 ans' }
        ], clear: ['_ga', '_gid', '_gat'] },
      { id: 'marketing', label: 'Marketing',
        description: 'Permettent \u00e0 nous et \u00e0 nos partenaires publicitaires (comme Google et Meta) de mesurer la performance des publicit\u00e9s et de vous montrer des annonces pertinentes sur d\u2019autres sites.',
        cookies: [
          { name: '_gcl_au', provider: 'Google Ads', purpose: 'Mesure les conversions issues des clics publicitaires', duration: '3 mois' },
          { name: '_fbp', provider: 'Meta', purpose: 'Diffuse et mesure les publicit\u00e9s Meta', duration: '3 mois' },
          { name: '_fbc', provider: 'Meta', purpose: 'Conserve le dernier clic sur une publicit\u00e9 Meta', duration: '3 mois' }
        ], clear: ['_gcl', '_fbp', '_fbc', '_uet', '_ttp', 'li_', '_rdt'] }
    ]
  };

  /* ------------------------------------------------------------------ */
  /* 2. Config                                                            */
  /* ------------------------------------------------------------------ */
  var user = w.ConsentKitConfig || {};
  var lang = (user.lang || (d.documentElement.lang || 'en')).slice(0, 2).toLowerCase();
  if (!STRINGS[lang]) lang = 'en';

  var cfg = {
    company: 'Company Name',
    policyUrl: '/privacy-policy/',
    mode: 'opt-in',            // 'opt-in' = off until accepted (Canada, Quebec, EU). 'opt-out' = on until declined (US).
    honorGPC: true,            // respect Global Privacy Control browser signal (turns marketing off)
    version: '1',              // bump when your tools change to ask everyone again
    cookieName: 'ck_consent',
    cookieDays: 365,
    cookieDomain: '',          // e.g. '.example.com' to share one choice across subdomains
    layout: 'box',             // 'box' (bottom-left card) or 'bar' (full-width bottom bar)
    floatingButton: true,      // small "Privacy choices" button after a choice is made
    reloadOnRevoke: true,      // reload page when a category is turned off, so tags stop
    urlPassthrough: false,     // Google Consent Mode url_passthrough
    logEndpoint: '',           // optional URL to POST consent records (proof of consent)
    theme: {
      accent: '#111111', accentText: '#ffffff', background: '#ffffff', text: '#1a1a1a',
      muted: '#5b5b5b', border: '#e3e3e3', radius: '12px',
      font: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    text: {},
    categories: []
  };

  function isObj(x) { return x && typeof x === 'object' && !Array.isArray(x); }
  function merge(t, s) {
    for (var k in s) if (Object.prototype.hasOwnProperty.call(s, k)) {
      if (isObj(s[k]) && isObj(t[k])) merge(t[k], s[k]); else t[k] = s[k];
    }
    return t;
  }
  function clone(x) { return JSON.parse(JSON.stringify(x)); }

  var userCats = user.categories;
  var userText = user.text || {};
  var u2 = merge({}, user); delete u2.categories; delete u2.text;
  merge(cfg, u2);

  // Text: language defaults, body picked by mode, then user overrides
  var T = clone(STRINGS[lang]);
  T.body = cfg.mode === 'opt-out' ? T.bodyOptOut : T.bodyOptIn;
  merge(T, userText);

  // Categories: language defaults, merged by id with user overrides; {disabled:true} removes one
  var cats = clone(CATEGORIES[lang]);
  if (Array.isArray(userCats)) {
    userCats.forEach(function (uc) {
      var found = null;
      for (var i = 0; i < cats.length; i++) if (cats[i].id === uc.id) found = cats[i];
      if (found) merge(found, uc); else cats.push(merge({ cookies: [], clear: [] }, uc));
    });
  }
  cats = cats.filter(function (c) { return !c.disabled; });
  var optional = cats.filter(function (c) { return !c.required; });

  /* ------------------------------------------------------------------ */
  /* 3. Storage                                                           */
  /* ------------------------------------------------------------------ */
  function readCookie(name) {
    var m = d.cookie.match(new RegExp('(?:^|; )' + name.replace(/[.$?*|{}()[\]\\/+^]/g, '\\$&') + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }
  function writeCookie(name, val, days) {
    var c = name + '=' + encodeURIComponent(val) + '; expires=' + new Date(Date.now() + days * 864e5).toUTCString() + '; path=/; SameSite=Lax';
    if (cfg.cookieDomain) c += '; domain=' + cfg.cookieDomain;
    if (location.protocol === 'https:') c += '; Secure';
    d.cookie = c;
  }
  function expireCookie(name) {
    var host = location.hostname, parts = host.split('.'), domains = ['', host, '.' + host];
    for (var i = 1; i < parts.length - 1; i++) domains.push('.' + parts.slice(i).join('.'));
    domains.forEach(function (dm) {
      d.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (dm ? '; domain=' + dm : '');
    });
  }
  function clearByPrefix(prefixes) {
    if (!prefixes || !prefixes.length) return;
    d.cookie.split(';').forEach(function (p) {
      var name = p.split('=')[0].trim();
      prefixes.forEach(function (pre) { if (name && name.indexOf(pre) === 0) expireCookie(name); });
    });
  }
  function uid() {
    try { if (w.crypto && w.crypto.randomUUID) return w.crypto.randomUUID(); } catch (e) {}
    return 'ck-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }
  function load() {
    try {
      var raw = readCookie(cfg.cookieName);
      if (!raw) return null;
      var s = JSON.parse(raw);
      return s && s.v === String(cfg.version) && s.c ? s : null;
    } catch (e) { return null; }
  }

  var gpc = !!(cfg.honorGPC && navigator.globalPrivacyControl === true);

  function defaults() {
    var c = {};
    optional.forEach(function (cat) { c[cat.id] = cfg.mode === 'opt-out'; });
    if (gpc && 'marketing' in c) c.marketing = false;
    return c;
  }

  var stored = load();
  var state = stored ? clone(stored.c) : defaults();
  // A GPC signal that appears after an earlier "accept" still turns marketing off
  if (stored && gpc && !stored.gpc && state.marketing) state.marketing = false;
  optional.forEach(function (cat) { if (!(cat.id in state)) state[cat.id] = defaults()[cat.id]; });

  /* ------------------------------------------------------------------ */
  /* 4. Google Consent Mode v2 (runs immediately, before any tags)        */
  /* ------------------------------------------------------------------ */
  w.dataLayer = w.dataLayer || [];
  if (typeof w.gtag !== 'function') w.gtag = function () { w.dataLayer.push(arguments); };

  function g(v) { return v ? 'granted' : 'denied'; }
  function googleMap(s) {
    return {
      ad_storage: g(s.marketing), ad_user_data: g(s.marketing), ad_personalization: g(s.marketing),
      analytics_storage: g(s.analytics),
      functionality_storage: g(s.functional), personalization_storage: g(s.functional),
      security_storage: 'granted'
    };
  }
  var def = googleMap(state); def.wait_for_update = 500;
  w.gtag('consent', 'default', def);
  w.gtag('set', 'ads_data_redaction', !state.marketing);
  if (cfg.urlPassthrough) w.gtag('set', 'url_passthrough', true);
  w.dataLayer.push({ event: 'consentkit_ready', consentkit: clone(state), consentkit_decided: !!stored });

  /* ------------------------------------------------------------------ */
  /* 5. Apply consent to page                                             */
  /* ------------------------------------------------------------------ */
  var listeners = [];

  function allowed(list) {
    return list.split(/[\s,]+/).filter(Boolean).every(function (id) {
      return id === 'necessary' || state[id] === true;
    });
  }

  // <script type="text/plain" data-consent="marketing">  -> runs once allowed
  // <iframe data-consent="functional" data-consent-src="..."> -> src set once allowed
  function scan() {
    var nodes = d.querySelectorAll('script[type="text/plain"][data-consent], [data-consent][data-consent-src]');
    Array.prototype.forEach.call(nodes, function (n) {
      if (!allowed(n.getAttribute('data-consent'))) return;
      if (n.tagName === 'SCRIPT') {
        var s = d.createElement('script');
        Array.prototype.forEach.call(n.attributes, function (a) {
          if (a.name !== 'type' && a.name !== 'data-consent') s.setAttribute(a.name, a.value);
        });
        s.type = n.getAttribute('data-type') || 'text/javascript';
        if (!n.src) s.text = n.text;
        n.parentNode.replaceChild(s, n);
      } else {
        n.setAttribute('src', n.getAttribute('data-consent-src'));
        n.removeAttribute('data-consent-src');
      }
    });
  }

  function notify(source) {
    w.gtag('consent', 'update', googleMap(state));
    w.gtag('set', 'ads_data_redaction', !state.marketing);
    w.dataLayer.push({ event: 'consentkit_update', consentkit: clone(state), consentkit_source: source });
    if (typeof w.fbq === 'function') { try { w.fbq('consent', state.marketing ? 'grant' : 'revoke'); } catch (e) {} }
    scan();
    renderStatus();
    var detail = { choices: clone(state), source: source };
    try { w.dispatchEvent(new CustomEvent('consentkit:change', { detail: detail })); } catch (e) {}
    listeners.forEach(function (fn) { try { fn(detail); } catch (e) {} });
  }

  function save(choices, source) {
    var before = clone(state), revoked = false;
    optional.forEach(function (cat) {
      state[cat.id] = !!choices[cat.id];
      if (before[cat.id] && !state[cat.id]) { revoked = true; clearByPrefix(cat.clear); }
    });
    var rec = { v: String(cfg.version), id: (stored && stored.id) || uid(), ts: new Date().toISOString(), src: source, gpc: gpc, c: clone(state) };
    stored = rec;
    writeCookie(cfg.cookieName, JSON.stringify(rec), cfg.cookieDays);
    if (cfg.logEndpoint) {
      try {
        var body = JSON.stringify({ id: rec.id, ts: rec.ts, version: rec.v, source: source, gpc: gpc, choices: rec.c, url: location.href, ua: navigator.userAgent });
        if (navigator.sendBeacon) navigator.sendBeacon(cfg.logEndpoint, new Blob([body], { type: 'application/json' }));
        else fetch(cfg.logEndpoint, { method: 'POST', body: body, headers: { 'Content-Type': 'application/json' }, keepalive: true });
      } catch (e) {}
    }
    notify(source);
    hideBanner(); closePrefs(true);
    if (revoked && cfg.reloadOnRevoke) setTimeout(function () { location.reload(); }, 150);
  }

  // "Accept all" is an explicit action, so it can turn marketing on even with GPC present
  function all(v) { var c = {}; optional.forEach(function (cat) { c[cat.id] = v; }); return c; }

  /* ------------------------------------------------------------------ */
  /* 6. UI (shadow DOM so site CSS can't break it)                        */
  /* ------------------------------------------------------------------ */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var host, root, banner, overlay, modal, fab, lastFocus;
  var th = cfg.theme;

  var CSS = [
    ':host{all:initial}',
    '*{box-sizing:border-box;margin:0}',
    '.w{font-family:' + th.font + ';font-size:15px;line-height:1.5;color:' + th.text + ';-webkit-font-smoothing:antialiased}',
    '.banner{position:fixed;z-index:2147483000;background:' + th.background + ';border:1px solid ' + th.border + ';box-shadow:0 10px 40px rgba(0,0,0,.14);padding:20px;animation:up .28s ease-out}',
    '.box{left:16px;bottom:16px;max-width:420px;border-radius:' + th.radius + '}',
    '.bar{left:0;right:0;bottom:0;border-radius:0;border-width:1px 0 0;display:flex;gap:24px;align-items:center;justify-content:space-between;padding:18px 24px}',
    '.bar .txt{max-width:760px}',
    '.title{font-weight:650;font-size:16px;margin-bottom:6px}',
    '.body{color:' + th.muted + ';font-size:14px}',
    'a{color:inherit;text-decoration:underline;text-underline-offset:2px}',
    '.actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;align-items:center}',
    '.bar .actions{margin-top:0;flex-shrink:0}',
    '.btn{font:inherit;font-size:14px;font-weight:600;cursor:pointer;border-radius:999px;padding:10px 18px;border:1.5px solid ' + th.accent + ';background:' + th.accent + ';color:' + th.accentText + ';min-width:0;flex:1 1 auto;white-space:nowrap}',
    '.btn.alt{background:transparent;color:' + th.accent + '}',
    '.lnk{font:inherit;font-size:14px;background:none;border:0;padding:8px 4px;cursor:pointer;color:' + th.text + ';text-decoration:underline;text-underline-offset:2px}',
    '.btn:focus-visible,.lnk:focus-visible,.x:focus-visible,.fab:focus-visible,input:focus-visible+.sl,a:focus-visible{outline:3px solid ' + th.accent + ';outline-offset:2px}',
    '.ov{position:fixed;inset:0;z-index:2147483001;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:16px}',
    '.ov[hidden]{display:none}',
    '.modal{background:' + th.background + ';border-radius:' + th.radius + ';width:100%;max-width:560px;max-height:calc(100vh - 32px);overflow:auto;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.25)}',
    '.mh{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:8px}',
    'h2{font-size:19px;font-weight:650}',
    '.x{background:none;border:0;font-size:26px;line-height:1;cursor:pointer;color:' + th.muted + ';padding:4px 8px;border-radius:8px}',
    '.intro{color:' + th.muted + ';font-size:14px;margin-bottom:16px}',
    '.gpc{background:#f4f4f4;border-radius:8px;padding:10px 12px;font-size:13px;margin-bottom:12px;color:' + th.text + '}',
    '.cat{border-top:1px solid ' + th.border + ';padding:14px 0}',
    '.ch{display:flex;justify-content:space-between;align-items:center;gap:12px}',
    '.cl{font-weight:600;font-size:15px}',
    '.cd{color:' + th.muted + ';font-size:13px;margin-top:4px}',
    '.aon{font-size:12px;font-weight:600;color:' + th.muted + ';white-space:nowrap}',
    '.sw{position:relative;display:inline-block;width:44px;height:26px;flex-shrink:0}',
    '.sw input{position:absolute;opacity:0;width:100%;height:100%;margin:0;cursor:pointer;z-index:1}',
    '.sl{position:absolute;inset:0;background:#c9c9c9;border-radius:999px;transition:background .15s}',
    '.sl:before{content:"";position:absolute;width:20px;height:20px;left:3px;top:3px;background:#fff;border-radius:50%;transition:transform .15s;box-shadow:0 1px 3px rgba(0,0,0,.25)}',
    'input:checked+.sl{background:' + th.accent + '}',
    'input:checked+.sl:before{transform:translateX(18px)}',
    '.mf{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;border-top:1px solid ' + th.border + ';padding-top:16px}',
    '.fab{position:fixed;left:16px;bottom:16px;z-index:2147482999;width:44px;height:44px;border-radius:50%;border:1px solid ' + th.border + ';background:' + th.background + ';color:' + th.text + ';cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,.12)}',
    '.fab svg{width:22px;height:22px}',
    '[hidden]{display:none!important}',
    '@keyframes up{from{transform:translateY(12px);opacity:0}to{transform:none;opacity:1}}',
    '@media (max-width:640px){.box{left:8px;right:8px;bottom:8px;max-width:none}.bar{flex-direction:column;align-items:stretch;gap:12px;padding:16px}.btn{flex:1 1 100%}.fab{left:12px;bottom:12px}}',
    '@media (prefers-reduced-motion:reduce){.banner{animation:none}.sl,.sl:before{transition:none}}'
  ].join('');

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9 4 4 0 0 1-4-4 4 4 0 0 1-4-4 1 1 0 0 0-1-1Z"/><circle cx="8.5" cy="10.5" r="1"/><circle cx="12" cy="15.5" r="1"/><circle cx="16" cy="13" r="1"/></svg>';

  function build() {
    if (host) return;
    host = d.createElement('div');
    host.id = 'consentkit';
    host.setAttribute('data-nosnippet', '');
    root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;
    var policy = esc(cfg.policyUrl);

    var catsHtml = cats.map(function (c) {
      var ctl = c.required
        ? '<span class="aon">' + esc(T.alwaysOn) + '</span>'
        : '<span class="sw"><input type="checkbox" role="switch" id="ck-' + esc(c.id) + '" data-cat="' + esc(c.id) + '" aria-describedby="ckd-' + esc(c.id) + '"><span class="sl"></span></span>';
      return '<div class="cat"><div class="ch"><label class="cl" for="ck-' + esc(c.id) + '">' + esc(c.label) + '</label>' + ctl + '</div><p class="cd" id="ckd-' + esc(c.id) + '">' + esc(c.description) + '</p></div>';
    }).join('');

    root.innerHTML = '<style>' + CSS + '</style><div class="w">' +
      '<div class="banner ' + (cfg.layout === 'bar' ? 'bar' : 'box') + '" role="region" aria-labelledby="ck-t" hidden>' +
        '<div class="txt"><p class="title" id="ck-t">' + esc(T.title) + '</p>' +
        '<p class="body">' + esc(T.body) + ' <a href="' + policy + '">' + esc(T.policyLink) + '</a></p></div>' +
        '<div class="actions">' +
          '<button type="button" class="btn alt" data-a="reject">' + esc(T.reject) + '</button>' +
          '<button type="button" class="btn" data-a="accept">' + esc(T.accept) + '</button>' +
          '<button type="button" class="lnk" data-a="custom">' + esc(T.customize) + '</button>' +
        '</div></div>' +
      '<div class="ov" hidden><div class="modal" role="dialog" aria-modal="true" aria-labelledby="ck-mt">' +
        '<div class="mh"><h2 id="ck-mt">' + esc(T.prefsTitle) + '</h2><button type="button" class="x" data-a="close" aria-label="' + esc(T.close) + '">&times;</button></div>' +
        '<p class="intro">' + esc(T.prefsIntro) + ' <a href="' + policy + '">' + esc(T.policyLink) + '</a></p>' +
        (gpc ? '<p class="gpc">' + esc(T.gpcNote) + '</p>' : '') +
        catsHtml +
        '<div class="mf">' +
          '<button type="button" class="btn alt" data-a="reject">' + esc(T.reject) + '</button>' +
          '<button type="button" class="btn alt" data-a="save">' + esc(T.save) + '</button>' +
          '<button type="button" class="btn" data-a="accept">' + esc(T.accept) + '</button>' +
        '</div></div></div>' +
      '<button type="button" class="fab" aria-label="' + esc(T.floating) + '" title="' + esc(T.floating) + '" hidden>' + ICON + '</button>' +
    '</div>';

    banner = root.querySelector('.banner');
    overlay = root.querySelector('.ov');
    modal = root.querySelector('.modal');
    fab = root.querySelector('.fab');

    root.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-a]') : null;
      if (e.target === overlay) return closePrefs();
      if (!b) return;
      var a = b.getAttribute('data-a');
      if (a === 'accept') save(all(true), 'accept_all');
      else if (a === 'reject') save(all(false), 'reject_all');
      else if (a === 'custom') openPrefs();
      else if (a === 'close') closePrefs();
      else if (a === 'save') {
        var c = {};
        Array.prototype.forEach.call(root.querySelectorAll('input[data-cat]'), function (i) { c[i.getAttribute('data-cat')] = i.checked; });
        save(c, 'custom');
      }
    });
    fab.addEventListener('click', openPrefs);
    overlay.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); closePrefs(); return; }
      if (e.key !== 'Tab') return;
      var f = modal.querySelectorAll('button,a[href],input');
      var first = f[0], last = f[f.length - 1], act = root.activeElement || d.activeElement;
      if (e.shiftKey && act === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && act === last) { e.preventDefault(); first.focus(); }
    });
    d.body.appendChild(host);
  }

  function showBanner() { build(); banner.hidden = false; fab.hidden = true; }
  function hideBanner() { if (!banner) return; banner.hidden = true; fab.hidden = !cfg.floatingButton; }
  function openPrefs() {
    build();
    lastFocus = d.activeElement;
    Array.prototype.forEach.call(root.querySelectorAll('input[data-cat]'), function (i) { i.checked = !!state[i.getAttribute('data-cat')]; });
    overlay.hidden = false;
    var first = modal.querySelector('input[data-cat]') || modal.querySelector('.x');
    if (first) first.focus();
  }
  function closePrefs(silent) {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    if (!silent && lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ------------------------------------------------------------------ */
  /* 7. Policy-page helpers: live cookie table + current choices          */
  /* ------------------------------------------------------------------ */
  // <div data-consentkit-table></div>   -> table of every category + cookie
  // <div data-consentkit-status></div>  -> the visitor's current choices
  function renderTables() {
    Array.prototype.forEach.call(d.querySelectorAll('[data-consentkit-table]'), function (el) {
      el.innerHTML = cats.map(function (c) {
        var rows = (c.cookies || []).map(function (k) {
          return '<tr><td><code>' + esc(k.name) + '</code></td><td>' + esc(k.provider) + '</td><td>' + esc(k.purpose) + '</td><td>' + esc(k.duration) + '</td></tr>';
        }).join('');
        return '<div class="ckt-group"><h3 class="ckt-h">' + esc(c.label) + '</h3><p class="ckt-d">' + esc(c.description) + '</p>' +
          (rows ? '<div class="ckt-scroll"><table class="ckt"><thead><tr><th>' + esc(T.thCookie) + '</th><th>' + esc(T.thProvider) + '</th><th>' + esc(T.thPurpose) + '</th><th>' + esc(T.thDuration) + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>'
                : '<p class="ckt-none">' + esc(T.none) + '</p>') + '</div>';
      }).join('');
    });
  }
  function renderStatus() {
    Array.prototype.forEach.call(d.querySelectorAll('[data-consentkit-status]'), function (el) {
      if (!stored) { el.innerHTML = '<p class="ckt-status">' + esc(T.notSet) + '</p>'; return; }
      el.innerHTML = '<ul class="ckt-status">' + optional.map(function (c) {
        return '<li><strong>' + esc(c.label) + ':</strong> ' + esc(state[c.id] ? T.on : T.off) + '</li>';
      }).join('') + '</ul><p class="ckt-status-meta">' + esc(T.updated) + ': ' + esc(new Date(stored.ts).toLocaleString()) + ' \u00b7 ID ' + esc(stored.id) + '</p>';
    });
  }

  /* ------------------------------------------------------------------ */
  /* 8. Boot                                                              */
  /* ------------------------------------------------------------------ */
  function boot() {
    scan();
    renderTables();
    renderStatus();
    build();
    if (!stored) showBanner(); else hideBanner();
    if (/#cookie-settings$/.test(location.hash)) openPrefs();
  }

  // Any element with data-cookie-settings, or a link to #cookie-settings, opens preferences
  d.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-cookie-settings],a[href$="#cookie-settings"]') : null;
    if (t) { e.preventDefault(); openPrefs(); }
  });

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot); else boot();

  /* ------------------------------------------------------------------ */
  /* 9. Public API                                                        */
  /* ------------------------------------------------------------------ */
  w.ConsentKit = {
    version: '1.0.0',
    open: openPrefs,
    show: showBanner,
    get: function () { return { decided: !!stored, choices: clone(state), record: stored ? clone(stored) : null }; },
    has: function (id) { return id === 'necessary' || state[id] === true; },
    set: function (choices) { save(merge(clone(state), choices || {}), 'api'); },
    acceptAll: function () { save(all(true), 'accept_all'); },
    rejectAll: function () { save(all(false), 'reject_all'); },
    reset: function () { expireCookie(cfg.cookieName); location.reload(); },
    on: function (fn) { if (typeof fn === 'function') listeners.push(fn); },
    scan: scan,
    render: function () { renderTables(); renderStatus(); }
  };
})(window, document);
