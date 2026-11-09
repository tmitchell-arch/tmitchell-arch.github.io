/* @ds-bundle: {"format":4,"namespace":"NSLFCUDesignSystem_3e6328","components":[{"name":"EmailFooter","sourcePath":"components/compliance/EmailFooter.jsx"},{"name":"NCUAStatement","sourcePath":"components/compliance/NCUAStatement.jsx"},{"name":"NonDepositDisclosure","sourcePath":"components/compliance/NonDepositDisclosure.jsx"},{"name":"RateDisclosure","sourcePath":"components/compliance/RateDisclosure.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Logo","sourcePath":"components/core/Logo.jsx"},{"name":"DataTable","sourcePath":"components/data/DataTable.jsx"},{"name":"FeatureList","sourcePath":"components/data/FeatureList.jsx"},{"name":"NumberedList","sourcePath":"components/data/NumberedList.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Accordion","sourcePath":"components/navigation/Accordion.jsx"},{"name":"Dialog","sourcePath":"components/navigation/Dialog.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"},{"name":"Callout","sourcePath":"components/surfaces/Callout.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"SectionHeader","sourcePath":"components/surfaces/SectionHeader.jsx"},{"name":"StatTile","sourcePath":"components/surfaces/StatTile.jsx"}],"sourceHashes":{"compliance/nslfcu-compliance-check.js":"aa0970c288dd","components/compliance/EmailFooter.jsx":"732e5aac283c","components/compliance/NCUAStatement.jsx":"3347f64651ce","components/compliance/NonDepositDisclosure.jsx":"42ef21d0763e","components/compliance/RateDisclosure.jsx":"56ae174b44a6","components/core/Badge.jsx":"939b4195c562","components/core/Button.jsx":"365e276706fd","components/core/Eyebrow.jsx":"40c0acaa5129","components/core/Logo.jsx":"ed7133271602","components/data/DataTable.jsx":"4bcd7ecca0b4","components/data/FeatureList.jsx":"f427615b3a19","components/data/NumberedList.jsx":"9fe5aee93618","components/forms/Checkbox.jsx":"4a5f109b2f4c","components/forms/Input.jsx":"07281acaece7","components/forms/Select.jsx":"61678fccbb2a","components/navigation/Accordion.jsx":"bdc3a6f48359","components/navigation/Dialog.jsx":"a65984c237bd","components/navigation/NavBar.jsx":"65c8fd5c32c5","components/surfaces/Callout.jsx":"8b8ebf9f5363","components/surfaces/Card.jsx":"48e6b18a681e","components/surfaces/SectionHeader.jsx":"f02f3937335c","components/surfaces/StatTile.jsx":"1bd14368e7d6","slides/fit.js":"83f65f06db28","ui_kits/member-guides/GuidePages.jsx":"ed2b30d458ea","ui_kits/website/HomeSections.jsx":"f8a007a57d63","ui_kits/website/InnerPages.jsx":"662b1257a557","ui_kits/website/SupportSections.jsx":"0a636e5c511f"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.NSLFCUDesignSystem_3e6328 = window.NSLFCUDesignSystem_3e6328 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// compliance/nslfcu-compliance-check.js
try { (() => {
/* NSLFCU automated compliance checker — NCUA §740.5, §707.8 (Truth in Savings + "free"), Part 721, CAN-SPAM.
   Usage:  <script src="compliance/nslfcu-compliance-check.js" data-auto></script>  (or add ?compliance to the URL)
           NSLFCUCompliance.check({doc}) -> {type, errors[], warnings[], passed[]}
   Declare the piece type (optional, otherwise auto-detected):
           <meta name="nslfcu-piece" content="deposit|loan|non-deposit|email-promo|email-transactional|general|exempt">
           <meta name="email-subject" content="…">  (emails)
   Heuristic, not legal review: a clean report means no detectable violations; final copy still goes to Compliance. */
(function () {
  const RX = {
    ncua: /(federally\s+)?insured\s+by\s+(the\s+)?ncua/i,
    apy: /\bAPY\b|annual percentage yield/i,
    pct: /\d+(?:\.\d+)?\s?%/g,
    rateWord: /\b(apy|annual percentage yield|dividends?|yield|rate|earn(s|ing)?|interest)\b/i,
    loan: /\b(apr|loans?|mortgages?|refinanc\w*|credit cards?|discount|off)\b/i,
    deposit: /\b(apy|annual percentage yield|dividends?|savings|checking|certificates?|share accounts?|money market|ira|open an account)\b/i,
    loanOnly: /\b(auto loans?|mortgages?|refinanc\w*|credit cards?|personal loans?|home equity|pre-?approv\w*)\b/i,
    nondep: /\b(investments?|investing|annuit(y|ies)|insurance products?|life insurance|brokerage|mutual funds?|stocks?|bonds?)\b/i,
    free: /\b(free|no[- ]cost|no[- ]fee|fee[- ]free|without fees)\b/gi,
    acct: /\b(checking|savings|accounts?|share|certificates?|cds?|money market)\b/i,
    idiom: /\b(stress|debt|guilt|hassle|worry|risk|interest|tax|toll|sugar|hands)[- ]free\b|\bfree and clear\b|\bfeel free\b|\bfree (time|alternatives?)\b/i,
    freeService: /^\s*(\w+\s){0,2}(debit cards?|online banking|mobile banking|bill pay|e-?statements?|consultations?|guides?|calculators?|resources?|downloads?|financial wellness|workshops?|seminars?|notary|coin counting|atm)/i,
    freePeriod: /for the first \d+|for \d+\s+(days|months|years)|for (members|seniors|students|ages?)\b/i
  };
  const asOf = /accurate as of/i,
    minBal = /minimum (daily |average )?balance/i,
    varFix = /\b(variable|fixed)\b/i,
    fees = /fees? (could|may|can) reduce earnings/i,
    term = /\b(certificate|\bcd\b|\d+[- ]month|term)\b/i,
    ewp = /early withdrawal/i;
  function check(opts) {
    opts = opts || {};
    const doc = opts.doc || document,
      win = doc.defaultView,
      body = doc.body;
    const errors = [],
      warnings = [],
      passed = [];
    const add = (arr, rule, msg, el) => arr.push({
      rule,
      msg,
      el: el || null
    });
    const ignore = el => el.closest && el.closest('#nslfcu-compliance-panel,[data-compliance-ignore],script,style,noscript,template');
    const visible = el => {
      const cs = win.getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    const blockOf = el => {
      let e = el;
      while (e && e !== body) {
        const d = win.getComputedStyle(e).display;
        if (d !== 'inline' && d !== 'inline-block' && d !== 'contents') return e;
        e = e.parentElement;
      }
      return body;
    };
    // Collect visible text nodes
    const nodes = [];
    const tw = doc.createTreeWalker(body, 4);
    let n;
    while (n = tw.nextNode()) {
      const t = n.nodeValue.replace(/\s+/g, ' ').trim();
      if (!t || t.length < 2) continue;
      const el = n.parentElement;
      if (!el || ignore(el) || !visible(el)) continue;
      nodes.push({
        t,
        el,
        fs: parseFloat(win.getComputedStyle(el).fontSize)
      });
    }
    const pageText = nodes.map(x => x.t).join(' ');
    const minFs = nodes.filter(x => x.t.replace(/[^A-Za-z]/g, '').length >= 3).reduce((m, x) => Math.min(m, x.fs), Infinity);
    // Piece type
    const meta = doc.querySelector('meta[name="nslfcu-piece"]');
    let type = (meta && meta.content || opts.type || 'auto').toLowerCase();
    const subjMeta = doc.querySelector('meta[name="email-subject"]');
    if (type === 'auto') {
      if (subjMeta) type = /unsubscribe/i.test(pageText) ? 'email-promo' : 'email-transactional';else if (RX.nondep.test(pageText) && !RX.deposit.test(pageText)) type = 'non-deposit';else if (RX.deposit.test(pageText)) type = 'deposit';else if (RX.loanOnly.test(pageText)) type = 'loan';else type = 'general';
    }
    if (type === 'exempt') {
      add(passed, 'scope', 'Marked exempt (stationery, business card, signage, receipt, check, small promo item, <15s broadcast, billboard).');
      return {
        type,
        minFs,
        errors,
        warnings,
        passed
      };
    }
    const isEmail = type.startsWith('email');
    const ctx = el => {
      const b = blockOf(el);
      const t = b.innerText || b.textContent || '';
      return t.length < 70 && b.parentElement ? b.parentElement.innerText || t : t;
    };
    // Contrast helper
    const rgb = s => {
      const m = s.match(/[\d.]+/g);
      return m ? m.map(Number) : [0, 0, 0, 1];
    };
    const lum = ([r, g, b]) => {
      const f = c => {
        c /= 255;
        return c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4);
      };
      return .2126 * f(r) + .7152 * f(g) + .0722 * f(b);
    };
    const bgOf = el => {
      let e = el;
      while (e) {
        const c = rgb(win.getComputedStyle(e).backgroundColor);
        if (c.length < 4 || c[3] > .5) return c;
        e = e.parentElement;
      }
      return [255, 255, 255];
    };
    const contrast = el => {
      const a = lum(rgb(win.getComputedStyle(el).color)),
        b = lum(bgOf(el));
      return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
    };
    const opacity = el => {
      let o = 1,
        e = el;
      while (e) {
        o *= parseFloat(win.getComputedStyle(e).opacity);
        e = e.parentElement;
      }
      return o;
    };
    const conspicuous = (el, label, arr) => {
      const fs = parseFloat(win.getComputedStyle(el).fontSize);
      let ok = true;
      if (fs + 0.01 < minFs) {
        add(arr || errors, 'conspicuous', `${label} is ${fs}px — smaller than the smallest body text (${minFs}px).`, el);
        ok = false;
      }
      const c = contrast(el);
      if (c < 4.5) {
        add(arr || errors, 'conspicuous', `${label} contrast ${c.toFixed(2)}:1 (needs ≥ 4.5:1).`, el);
        ok = false;
      }
      if (opacity(el) < .95) {
        add(arr || errors, 'conspicuous', `${label} is faded (opacity ${opacity(el).toFixed(2)}).`, el);
        ok = false;
      }
      return ok;
    };

    // 1. NCUA official advertising statement
    const ncuaEls = nodes.filter(x => {
      const m = x.t.match(RX.ncua);
      if (!m) return false;
      const before = x.t.slice(0, m.index).slice(-12);
      return !/\bnot\s*$/i.test(before);
    });
    const ncuaImgs = [...doc.querySelectorAll('img')].filter(i => !ignore(i) && visible(i) && /ncua/i.test(i.alt + ' ' + i.src));
    const needNCUA = type === 'deposit' || type === 'email-promo' && RX.deposit.test(pageText);
    const wantNCUA = type === 'loan' || type === 'general' || type === 'email-promo';
    if (ncuaEls.length || ncuaImgs.length) {
      let ok = ncuaImgs.length > 0;
      ncuaEls.forEach(x => {
        if (conspicuous(x.el, 'NCUA statement')) ok = true;
      });
      if (ok) add(passed, '§740.5', 'NCUA statement present and conspicuous.');
    } else if (needNCUA) add(errors, '§740.5', 'Missing "Federally insured by NCUA" (or official NCUA sign). Required on deposit advertising.');else if (wantNCUA && type !== 'non-deposit') add(warnings, '§740.5', type === 'loan' ? 'Loan-only piece: NCUA statement technically exempt (§740.5(c)(11)) but house standard is to include it.' : 'No NCUA statement. Add one unless this piece is exempt (declare <meta name="nslfcu-piece" content="exempt">).');

    // 2. Rates — APY wording + Truth-in-Savings disclosures
    let apyFound = false;
    const seenBlocks = new Set();
    nodes.forEach(x => {
      RX.pct.lastIndex = 0;
      let m;
      while (m = RX.pct.exec(x.t)) {
        const near = x.t.slice(Math.max(0, m.index - 40), m.index + m[0].length + 40);
        const c = ctx(x.el);
        if (RX.apy.test(near) || RX.apy.test(c.slice(0, 160)) && RX.rateWord.test(c)) {
          apyFound = true;
          continue;
        }
        if (RX.loan.test(near) || /\bAPR\b/.test(c)) continue;
        if (RX.rateWord.test(near) && RX.deposit.test(c)) {
          const b = blockOf(x.el);
          if (seenBlocks.has(b)) continue;
          seenBlocks.add(b);
          add(errors, '§707.8', 'Deposit rate "' + m[0] + '" not stated as "Annual Percentage Yield"/"APY".', x.el);
        }
      }
    });
    if (/\bAPY\b|annual percentage yield/i.test(pageText)) apyFound = true;
    if (apyFound && type !== 'non-deposit') {
      const disc = nodes.filter(x => /annual percentage yield/i.test(x.t));
      const miss = [];
      if (!disc.length) miss.push('"APY = Annual Percentage Yield" definition');
      if (!asOf.test(pageText)) miss.push('"accurate as of" date');
      if (!minBal.test(pageText)) miss.push('minimum balance to earn the APY');
      if (!varFix.test(pageText)) miss.push('whether the rate is variable or fixed');
      if (term.test(pageText) && !ewp.test(pageText)) miss.push('early withdrawal penalty statement (term/certificate present)');
      if (miss.length) add(errors, '§707.8', 'APY shown without required disclosures: ' + miss.join('; ') + '. Use RateDisclosure on the same surface.');else add(passed, '§707.8', 'APY disclosures present (definition, as-of date, minimum balance, variable/fixed' + (term.test(pageText) ? ', early withdrawal' : '') + ').');
      if (!fees.test(pageText)) add(warnings, '§707.8', 'No "fees could reduce earnings" statement — required if any fee can apply to the account.');
      disc.forEach(x => conspicuous(x.el, 'Rate disclosure'));
    }

    // 3. "Free"
    let freeHits = 0;
    nodes.forEach(x => {
      RX.free.lastIndex = 0;
      let m;
      while (m = RX.free.exec(x.t)) {
        const win2 = x.t.slice(Math.max(0, m.index - 40), m.index + m[0].length + 40);
        if (RX.idiom.test(win2)) continue;
        const after = x.t.slice(m.index + m[0].length);
        if (RX.freeService.test(after)) continue;
        if (!RX.acct.test(win2)) continue;
        freeHits++;
        if (RX.freePeriod.test(win2)) add(warnings, '§707.8(a)(2)', '"' + m[0] + '" near an account with a stated period/group — confirm no maintenance/activity fee applies during it.', x.el);else add(errors, '§707.8(a)(2)', '"' + m[0] + '" used near an account — prohibited if ANY maintenance or activity fee may be imposed. Verify with Compliance or remove.', x.el);
      }
    });
    if (!freeHits) add(passed, '§707.8(a)(2)', 'No "free" account claims detected.');

    // 4. Non-deposit products
    if (RX.nondep.test(pageText) && type !== 'general' || type === 'non-deposit') {
      const need = [[/not federally insured/i, 'Not federally insured by NCUA'], [/not a deposit/i, 'Not a deposit'], [/not guaranteed/i, 'Not guaranteed by the credit union'], [/may lose value|investment risk/i, 'May lose value / investment risk']];
      const miss = need.filter(([r]) => !r.test(pageText)).map(([, l]) => l);
      if (miss.length) add(type === 'non-deposit' ? errors : warnings, 'Part 721', 'Non-deposit product mentioned without: ' + miss.join('; ') + '. Use NonDepositDisclosure.');else add(passed, 'Part 721', 'Non-deposit disclosures present.');
      if (type === 'non-deposit' && ncuaEls.length) add(errors, 'Part 721', 'NCUA insurance statement appears on a non-deposit product piece — implies insurance.', ncuaEls[0].el);
    }

    // 5. Email (CAN-SPAM)
    if (isEmail) {
      const subj = subjMeta && subjMeta.content || doc.title || '';
      if (!subj) add(errors, 'CAN-SPAM', 'No subject line declared (<meta name="email-subject">).');else {
        if (/^\s*(re|fwd?)\s*:/i.test(subj)) add(errors, 'CAN-SPAM', 'Subject starts with "Re:"/"Fwd:" — misleading.');
        if (/%|\bAPY\b/i.test(subj) && !apyFound) add(errors, 'CAN-SPAM', 'Subject mentions a rate the body does not support.');
        if (/\b(urgent|final notice|act now|account (suspended|locked))\b/i.test(subj)) add(warnings, 'CAN-SPAM', 'Subject uses urgency language — confirm it is accurate.');
        if (RX.free.test(subj) && RX.acct.test(subj)) {
          RX.free.lastIndex = 0;
          add(errors, '§707.8(a)(2)', '"Free" account claim in subject line.');
        }
        RX.free.lastIndex = 0;
      }
      if (!/4929 Allentown/i.test(pageText)) add(errors, 'CAN-SPAM', 'Physical postal address missing (4929 Allentown Rd, Suitland, MD 20746).');else add(passed, 'CAN-SPAM', 'Postal address present.');
      if (type === 'email-promo') {
        const unsub = [...doc.querySelectorAll('a')].filter(a => !ignore(a) && /unsubscribe|opt[- ]?out/i.test(a.textContent));
        if (!unsub.length) add(errors, 'CAN-SPAM', 'No unsubscribe/opt-out link.');else {
          unsub.forEach(a => {
            conspicuous(a, 'Unsubscribe link');
            if (!a.getAttribute('href') || a.getAttribute('href') === '#') add(warnings, 'CAN-SPAM', 'Unsubscribe link has no real URL — wire to the ESP opt-out (valid ≥30 days, processed ≤10 business days).', a);
          });
          add(passed, 'CAN-SPAM', 'Unsubscribe link present.');
        }
      }
    }
    return {
      type,
      minFs,
      errors,
      warnings,
      passed
    };
  }
  function report(opts) {
    const doc = opts && opts.doc || document;
    const r = check(opts);
    doc.querySelectorAll('[data-nslfcu-flag]').forEach(e => {
      e.style.outline = '';
      e.removeAttribute('data-nslfcu-flag');
    });
    [...r.errors, ...r.warnings].forEach(f => {
      if (f.el) {
        f.el.style.outline = r.errors.includes(f) ? '3px solid #D93025' : '3px dashed #E8A317';
        f.el.style.outlineOffset = '2px';
        f.el.setAttribute('data-nslfcu-flag', '');
      }
    });
    let p = doc.getElementById('nslfcu-compliance-panel');
    if (p) p.remove();
    p = doc.createElement('div');
    p.id = 'nslfcu-compliance-panel';
    p.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:2147483647;width:380px;max-height:60vh;overflow:auto;background:#fff;color:#241019;border:2px solid ' + (r.errors.length ? '#D93025' : '#1E7B45') + ';border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.25);font:13px/1.45 Inter,system-ui,sans-serif;padding:14px 16px';
    const li = (f, c) => `<li style="margin:6px 0;color:${c}"><b>${f.rule}</b> — ${f.msg.replace(/</g, '&lt;')}</li>`;
    p.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><b style="font-size:14px">NSLFCU compliance · ${r.errors.length ? r.errors.length + ' error' + (r.errors.length > 1 ? 's' : '') : 'pass'}</b><button style="border:0;background:none;font-size:18px;cursor:pointer" onclick="this.closest('#nslfcu-compliance-panel').remove()">×</button></div><div style="color:#6b5a60;margin-top:2px">Piece type: ${r.type} · smallest body text ${r.minFs}px</div><ul style="padding-left:18px;margin:8px 0 0">${r.errors.map(f => li(f, '#B3261E')).join('')}${r.warnings.map(f => li(f, '#8A5A00')).join('')}${r.passed.map(f => li(f, '#1E7B45')).join('')}</ul>`;
    doc.body.appendChild(p);
    return r;
  }
  function settled(doc, cb, {
    interval = 400,
    stable = 2,
    max = 6000
  } = {}) {
    let last = -1,
      same = 0;
    const t0 = Date.now();
    const tick = () => {
      const len = (doc.body && doc.body.innerText || '').length;
      same = len === last && len > 0 ? same + 1 : 0;
      last = len;
      if (same >= stable || Date.now() - t0 >= max) cb();else setTimeout(tick, interval);
    };
    setTimeout(tick, interval);
  }
  window.NSLFCUCompliance = {
    check,
    report,
    settled,
    version: '1.1'
  };
  const me = document.currentScript;
  if (me && me.hasAttribute('data-auto') || /[?&]compliance\b/.test(location.search)) {
    const run = () => settled(document, () => report());
    document.readyState === 'complete' ? run() : window.addEventListener('load', run);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "compliance/nslfcu-compliance-check.js", error: String((e && e.message) || e) }); }

// components/compliance/EmailFooter.jsx
try { (() => {
function EmailFooter({
  unsubscribeHref = '#unsubscribe',
  preferencesHref,
  transactional = false,
  ncua = true,
  address = '4929 Allentown Rd, Suitland, MD 20746',
  size = 14,
  children
}) {
  const link = {
    color: 'var(--nsl-gold)',
    textDecoration: 'underline',
    fontWeight: 600
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--nsl-deep-maroon)',
      color: 'var(--nsl-parchment)',
      padding: '28px 32px',
      font: `400 ${size}px/1.6 var(--font-body)`
    }
  }, children && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, children), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600
    }
  }, "None Suffer Lack Federal Credit Union"), /*#__PURE__*/React.createElement("div", null, address), /*#__PURE__*/React.createElement("div", null, "nslfcu.org \xB7 (301) 899-0300"), ncua && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      fontWeight: 500
    }
  }, "Federally insured by NCUA."), !transactional && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, "You're receiving this email because you're a member of NSLFCU. ", /*#__PURE__*/React.createElement("a", {
    href: unsubscribeHref,
    style: link
  }, "Unsubscribe"), preferencesHref && /*#__PURE__*/React.createElement(React.Fragment, null, " \xB7 ", /*#__PURE__*/React.createElement("a", {
    href: preferencesHref,
    style: link
  }, "Email preferences"))));
}
Object.assign(__ds_scope, { EmailFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/compliance/EmailFooter.jsx", error: String((e && e.message) || e) }); }

// components/compliance/NCUAStatement.jsx
try { (() => {
function NCUAStatement({
  variant = 'text',
  tone = 'light',
  size = 13,
  wording = 'Federally insured by NCUA',
  logoSrc,
  style
}) {
  const color = tone === 'dark' ? 'var(--nsl-parchment)' : 'var(--text-body)';
  if (variant === 'logo' && logoSrc) return /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: "Federally insured by NCUA",
    style: {
      height: Math.max(28, size * 2.4),
      display: 'block',
      ...style
    }
  });
  return /*#__PURE__*/React.createElement("span", {
    style: {
      font: `500 ${size}px/1.4 var(--font-body)`,
      color,
      ...style
    }
  }, wording);
}
Object.assign(__ds_scope, { NCUAStatement });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/compliance/NCUAStatement.jsx", error: String((e && e.message) || e) }); }

// components/compliance/NonDepositDisclosure.jsx
try { (() => {
function NonDepositDisclosure({
  tone = 'light',
  size = 13,
  layout = 'inline',
  style
}) {
  const items = ['Not federally insured by NCUA', 'Not a deposit', 'Not guaranteed by the credit union', 'May lose value — involves investment risk'];
  const color = tone === 'dark' ? 'var(--nsl-parchment)' : 'var(--text-heading)';
  const border = tone === 'dark' ? 'var(--nsl-gold)' : 'var(--nsl-maroon)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: `1.5px solid ${border}`,
      borderRadius: 'var(--radius-md, 10px)',
      padding: '10px 14px',
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: layout === 'stack' ? 'column' : 'row',
      gap: layout === 'stack' ? 4 : '4px 18px',
      font: `600 ${size}px/1.4 var(--font-body)`,
      color,
      ...style
    }
  }, items.map(t => /*#__PURE__*/React.createElement("span", {
    key: t
  }, t)));
}
Object.assign(__ds_scope, { NonDepositDisclosure });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/compliance/NonDepositDisclosure.jsx", error: String((e && e.message) || e) }); }

// components/compliance/RateDisclosure.jsx
try { (() => {
function RateDisclosure({
  apy,
  product,
  asOf,
  minBalance,
  minOpening,
  term,
  earlyWithdrawal,
  variable = true,
  rateNote,
  feesMayReduce = true,
  marker = '*',
  tone = 'light',
  size = 13,
  showNCUA = true,
  style
}) {
  const miss = [!apy && 'apy', !asOf && 'asOf', !minBalance && 'minBalance', term && !earlyWithdrawal && 'earlyWithdrawal'].filter(Boolean);
  if (miss.length && typeof console !== 'undefined') console.warn('RateDisclosure: missing required Truth-in-Savings fields: ' + miss.join(', '));
  const parts = [`${marker}APY = Annual Percentage Yield. ${apy} APY${product ? ' on ' + product : ''} is accurate as of ${asOf || '[DATE REQUIRED]'}.`, rateNote || (variable ? 'Rate is variable and may change after the account is opened.' : 'The rate is fixed.'), `A minimum balance of ${minBalance || '[MIN BALANCE REQUIRED]'} is required to earn the stated APY.`, minOpening && `Minimum opening deposit: ${minOpening}.`, term && `Term: ${term}.`, term && (earlyWithdrawal || 'A penalty may be imposed for early withdrawal.'), !term && earlyWithdrawal, feesMayReduce && 'Fees could reduce earnings on the account.', showNCUA && 'Federally insured by NCUA.'].filter(Boolean);
  return /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: `400 ${size}px/1.55 var(--font-body)`,
      color: tone === 'dark' ? 'var(--nsl-parchment)' : 'var(--text-body)',
      textWrap: 'pretty',
      ...style
    }
  }, parts.join(' '));
}
Object.assign(__ds_scope, { RateDisclosure });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/compliance/RateDisclosure.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
const T = {
  high: ['var(--nsl-maroon)', '#fff'],
  medium: ['var(--nsl-gold)', 'var(--nsl-ink)'],
  lower: ['var(--nsl-parchment)', 'var(--nsl-ink)'],
  outline: ['transparent', 'var(--nsl-maroon)']
};
function Badge({
  tone = 'medium',
  children,
  style
}) {
  const [bg, fg] = T[tone] || T.medium;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      height: 21,
      padding: '0 10px',
      borderRadius: 'var(--radius-pill)',
      background: bg,
      color: fg,
      boxShadow: tone === 'outline' ? 'inset 0 0 0 1px var(--nsl-maroon-line)' : 'none',
      font: '600 11px/1 var(--font-body)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    h: 32,
    px: 16,
    fs: 12
  },
  md: {
    h: 40,
    px: 22,
    fs: 13
  },
  lg: {
    h: 50,
    px: 28,
    fs: 15
  }
};
const VARIANTS = {
  primary: {
    bg: 'var(--action-primary)',
    hover: 'var(--action-primary-hover)',
    fg: 'var(--action-on-primary)',
    line: 'transparent'
  },
  secondary: {
    bg: 'transparent',
    hover: 'rgba(122,32,73,.06)',
    fg: 'var(--nsl-maroon)',
    line: 'var(--nsl-maroon)'
  },
  accent: {
    bg: 'var(--action-accent)',
    hover: 'var(--action-accent-hover)',
    fg: 'var(--action-on-accent)',
    line: 'transparent'
  },
  'accent-outline': {
    bg: 'transparent',
    hover: 'rgba(201,169,104,.12)',
    fg: 'var(--nsl-gold)',
    line: 'var(--nsl-gold)'
  },
  inverse: {
    bg: 'var(--nsl-parchment)',
    hover: '#fff',
    fg: 'var(--nsl-maroon)',
    line: 'transparent'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  shape = 'pill',
  arrow = false,
  disabled = false,
  fullWidth = false,
  href,
  onClick,
  children,
  style,
  ...rest
}) {
  const [hov, setHov] = React.useState(false);
  const [down, setDown] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  if (variant === 'link') {
    const Tag = href ? 'a' : 'button';
    return /*#__PURE__*/React.createElement(Tag, _extends({
      href: href,
      onClick: onClick,
      disabled: disabled,
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => setHov(false),
      style: {
        background: 'none',
        border: 0,
        padding: 0,
        cursor: disabled ? 'default' : 'pointer',
        font: `600 ${s.fs}px/1.2 var(--font-body)`,
        color: disabled ? 'var(--text-placeholder)' : 'var(--nsl-maroon)',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        ...style
      }
    }, rest), children, /*#__PURE__*/React.createElement("span", {
      style: {
        transition: 'transform var(--duration-base) var(--ease-standard)',
        transform: hov ? 'translateX(3px)' : 'none'
      }
    }, "\u2192"));
  }
  const v = VARIANTS[variant] || VARIANTS.primary;
  const Tag = href ? 'a' : 'button';
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    onClick: disabled ? undefined : onClick,
    disabled: disabled,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => {
      setHov(false);
      setDown(false);
    },
    onMouseDown: () => setDown(true),
    onMouseUp: () => setDown(false),
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      boxSizing: 'border-box',
      height: s.h,
      padding: `0 ${s.px}px`,
      borderRadius: shape === 'pill' ? 'var(--radius-pill)' : 'var(--radius-md)',
      border: `1px solid ${v.line}`,
      background: hov && !disabled ? v.hover : v.bg,
      color: v.fg,
      font: `600 ${s.fs}px/1 var(--font-body)`,
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .45 : 1,
      transform: down && !disabled ? 'scale(.98)' : 'none',
      transition: 'background var(--duration-fast) linear, transform var(--duration-fast) var(--ease-standard)',
      ...style
    }
  }, rest), children, arrow && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2192"));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function Eyebrow({
  tone = 'maroon',
  rule = false,
  children,
  style
}) {
  const color = {
    maroon: 'var(--nsl-maroon)',
    gold: 'var(--nsl-gold)',
    muted: 'var(--nsl-ink-muted)',
    parchment: 'var(--nsl-parchment)'
  }[tone] || tone;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      font: 'var(--type-eyebrow)',
      letterSpacing: 'var(--tracking-eyebrow)',
      textTransform: 'uppercase',
      color,
      ...style
    }
  }, rule && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 2,
      background: 'var(--nsl-gold)',
      flex: 'none'
    }
  }), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Logo.jsx
try { (() => {
const FILES = {
  primary: 'logo-primary',
  secondary: 'logo-secondary',
  mark: 'logo-mark'
};
function Logo({
  variant = 'primary',
  reverse = false,
  height,
  basePath = 'assets/logos/',
  alt = 'None Suffer Lack Federal Credit Union',
  style
}) {
  const src = basePath + FILES[variant] + (reverse ? '-reverse' : '') + '.svg';
  const h = height ?? (variant === 'primary' ? 36 : variant === 'secondary' ? 56 : 40);
  return /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      height: h,
      width: 'auto',
      display: 'block',
      ...style
    }
  });
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Logo.jsx", error: String((e && e.message) || e) }); }

// components/data/DataTable.jsx
try { (() => {
function DataTable({
  columns = [],
  rows = [],
  emphasizeFirst = true,
  totalRow,
  style
}) {
  const th = {
    font: '600 11px/1.3 var(--font-body)',
    letterSpacing: '.12em',
    textTransform: 'uppercase',
    color: 'var(--nsl-maroon)',
    textAlign: 'left',
    padding: '10px 12px',
    borderBottom: '2px solid var(--nsl-gold)',
    verticalAlign: 'bottom'
  };
  const td = {
    font: '400 15px/1.4 var(--font-body)',
    color: 'var(--text-body)',
    padding: '11px 12px',
    borderBottom: '1px solid var(--border-rule)',
    verticalAlign: 'middle'
  };
  const al = c => c.align ? {
    textAlign: c.align
  } : {};
  return /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      ...style
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    style: {
      ...th,
      ...al(c),
      width: c.width
    }
  }, c.label)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, columns.map((c, j) => /*#__PURE__*/React.createElement("td", {
    key: c.key,
    style: {
      ...td,
      ...al(c),
      ...(j === 0 && emphasizeFirst ? {
        fontWeight: 600
      } : {})
    }
  }, r[c.key])))), totalRow && /*#__PURE__*/React.createElement("tr", null, columns.map((c, j) => /*#__PURE__*/React.createElement("td", {
    key: c.key,
    style: {
      ...td,
      ...al(c),
      background: 'var(--nsl-deep-maroon)',
      color: 'var(--nsl-parchment)',
      fontWeight: 600,
      borderBottom: 0,
      ...(j === 0 ? {
        borderRadius: '8px 0 0 8px'
      } : {}),
      ...(j === columns.length - 1 ? {
        borderRadius: '0 8px 8px 0'
      } : {})
    }
  }, totalRow[c.key])))));
}
Object.assign(__ds_scope, { DataTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DataTable.jsx", error: String((e && e.message) || e) }); }

// components/data/FeatureList.jsx
try { (() => {
function FeatureList({
  items = [],
  icon = 'arrow',
  iconBase = 'assets/icons/',
  columns = 1,
  tone = 'light',
  style
}) {
  const src = iconBase + (icon === 'check' ? 'tick.png' : 'up-arrow.png');
  return /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'grid',
      gridTemplateColumns: `repeat(${columns},minmax(0,1fr))`,
      gap: '12px 24px',
      ...style
    }
  }, items.map((t, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      font: '500 15px/1.4 var(--font-body)',
      color: tone === 'dark' ? 'var(--nsl-parchment)' : 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    style: {
      width: 22,
      height: 22,
      flex: 'none'
    }
  }), t)));
}
Object.assign(__ds_scope, { FeatureList });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/FeatureList.jsx", error: String((e && e.message) || e) }); }

// components/data/NumberedList.jsx
try { (() => {
function NumberedList({
  items = [],
  start = 1,
  tone = 'gold',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      ...style
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'grid',
      gridTemplateColumns: '44px 1fr',
      gap: 8,
      padding: '12px 0',
      borderBottom: '1px solid var(--border-rule)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '800 22px/1.1 var(--font-display)',
      color: tone === 'maroon' ? 'var(--nsl-maroon)' : 'var(--nsl-gold)'
    }
  }, String(start + i).padStart(2, '0')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 15px/1.35 var(--font-body)',
      color: 'var(--text-heading)'
    }
  }, it.title), it.body && /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 14px/1.55 var(--font-body)',
      color: 'var(--text-secondary)',
      marginTop: 3
    }
  }, it.body)))));
}
Object.assign(__ds_scope, { NumberedList });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/NumberedList.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = 18,
  style
}) {
  const [inner, setInner] = React.useState(defaultChecked);
  const on = checked ?? inner;
  const toggle = () => {
    if (disabled) return;
    const n = !on;
    if (checked === undefined) setInner(n);
    onChange && onChange(n);
  };
  return /*#__PURE__*/React.createElement("label", {
    onClick: toggle,
    style: {
      display: 'inline-flex',
      alignItems: 'flex-start',
      gap: 10,
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? .5 : 1,
      font: '400 15px/1.4 var(--font-body)',
      color: 'var(--text-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: "checkbox",
    "aria-checked": on,
    style: {
      flex: 'none',
      width: size,
      height: size,
      marginTop: 1,
      borderRadius: 4,
      boxSizing: 'border-box',
      border: '1.5px solid var(--nsl-maroon)',
      background: on ? 'var(--nsl-maroon)' : '#fff',
      display: 'grid',
      placeItems: 'center',
      transition: 'background var(--duration-fast)'
    }
  }, on && /*#__PURE__*/React.createElement("span", {
    style: {
      width: size * .28,
      height: size * .52,
      borderRight: '2px solid #fff',
      borderBottom: '2px solid #fff',
      transform: 'translateY(-12%) rotate(45deg)'
    }
  })), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function Input({
  label,
  placeholder,
  value,
  defaultValue,
  onChange,
  type = 'text',
  hint,
  error,
  disabled = false,
  style
}) {
  const [focus, setFocus] = React.useState(false);
  const id = React.useId();
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      display: 'grid',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 13px var(--font-body)',
      color: 'var(--text-body)'
    }
  }, label), /*#__PURE__*/React.createElement("input", {
    id: id,
    type: type,
    placeholder: placeholder,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: '100%',
      boxSizing: 'border-box',
      height: 48,
      padding: '0 16px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid ' + (error ? 'var(--nsl-maroon)' : focus ? 'var(--nsl-maroon)' : 'var(--border-field)'),
      boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none',
      background: disabled ? 'var(--nsl-parchment-soft)' : 'var(--surface-field)',
      font: '400 15px var(--font-body)',
      color: 'var(--text-body)',
      outline: 'none',
      transition: 'box-shadow var(--duration-fast), border-color var(--duration-fast)'
    }
  }), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 12px var(--font-body)',
      color: error ? 'var(--nsl-maroon)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Select({
  label,
  options = [],
  value,
  defaultValue,
  onChange,
  placeholder = 'Select one',
  disabled = false,
  error,
  style
}) {
  const [focus, setFocus] = React.useState(false);
  const id = React.useId();
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      display: 'grid',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 13px var(--font-body)',
      color: 'var(--text-body)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("select", {
    id: id,
    value: value,
    defaultValue: value === undefined ? defaultValue ?? '' : undefined,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      ...{
        width: '100%',
        boxSizing: 'border-box',
        height: 48,
        padding: '0 16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid ' + (error ? 'var(--nsl-maroon)' : focus ? 'var(--nsl-maroon)' : 'var(--border-field)'),
        boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none',
        background: disabled ? 'var(--nsl-parchment-soft)' : 'var(--surface-field)',
        font: '400 15px var(--font-body)',
        color: 'var(--text-body)',
        outline: 'none',
        transition: 'box-shadow var(--duration-fast), border-color var(--duration-fast)'
      },
      appearance: 'none',
      paddingRight: 40,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), options.map(o => typeof o === 'string' ? /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o) : /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      right: 16,
      top: '50%',
      width: 8,
      height: 8,
      borderRight: '2px solid var(--nsl-maroon)',
      borderBottom: '2px solid var(--nsl-maroon)',
      transform: 'translateY(-70%) rotate(45deg)',
      pointerEvents: 'none'
    }
  })), error && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 12px var(--font-body)',
      color: 'var(--nsl-maroon)'
    }
  }, error));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Accordion.jsx
try { (() => {
function Accordion({
  items = [],
  defaultOpen = 0,
  style
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 10,
      ...style
    }
  }, items.map((it, i) => {
    const on = open === i;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        background: on ? '#fff' : 'var(--surface-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: on ? 'inset 0 0 0 1px var(--border-card)' : 'none',
        transition: 'background var(--duration-base)'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setOpen(on ? -1 : i),
      "aria-expanded": on,
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '18px 22px',
        cursor: 'pointer',
        font: '600 16px/1.4 var(--font-body)',
        color: 'var(--text-heading)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, it.q), /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        flex: 'none',
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: on ? 'var(--nsl-maroon)' : 'transparent',
        boxShadow: on ? 'none' : 'inset 0 0 0 1px var(--nsl-maroon-line)',
        color: on ? '#fff' : 'var(--nsl-maroon)',
        display: 'grid',
        placeItems: 'center',
        font: '500 18px/1 var(--font-body)',
        transition: 'all var(--duration-base)'
      }
    }, on ? '−' : '+')), on && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 22px 20px',
        font: '400 15px/1.6 var(--font-body)',
        color: 'var(--text-secondary)',
        maxWidth: 720
      }
    }, it.a));
  }));
}
Object.assign(__ds_scope, { Accordion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Accordion.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Dialog.jsx
try { (() => {
function Dialog({
  open = true,
  onClose,
  image,
  title,
  children,
  width = 760,
  style
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(36,16,25,.55)',
      display: 'grid',
      placeItems: 'center',
      padding: 24,
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    role: "dialog",
    "aria-modal": "true",
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: width,
      background: 'var(--nsl-parchment)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: image ? 'minmax(0,1fr) minmax(0,1.1fr)' : '1fr',
      boxShadow: 'var(--shadow-float)',
      ...style
    }
  }, image && /*#__PURE__*/React.createElement("div", {
    style: {
      background: `url(${image}) center/cover`,
      minHeight: 320
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '36px 36px 32px'
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: '800 26px/1.2 var(--font-display)',
      color: 'var(--text-heading)',
      marginBottom: 18,
      paddingRight: 28
    }
  }, title), children), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      position: 'absolute',
      top: 14,
      right: 14,
      width: 36,
      height: 36,
      borderRadius: '50%',
      border: 0,
      background: '#fff',
      cursor: 'pointer',
      font: '400 20px/1 var(--font-body)',
      color: 'var(--nsl-ink)'
    }
  }, "\xD7")));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
function NavBar({
  links = [],
  active,
  onNavigate,
  logoSrc = 'assets/logos/logo-primary.svg',
  signInLabel = 'Sign in',
  ctaLabel = 'Join Now',
  onSignIn,
  onCta,
  style
}) {
  const [hov, setHov] = React.useState(null);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 32,
      height: 80,
      padding: '0 40px',
      background: 'var(--nsl-parchment)',
      borderBottom: '1px solid var(--border-rule)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate && onNavigate('Home');
    },
    style: {
      display: 'block',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: "None Suffer Lack Federal Credit Union",
    style: {
      height: 34,
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 'clamp(14px,2vw,28px)',
      flex: 1,
      minWidth: 0,
      justifyContent: 'center',
      overflow: 'hidden'
    }
  }, links.map(l => {
    const on = l === active;
    return /*#__PURE__*/React.createElement("a", {
      key: l,
      href: "#",
      onClick: e => {
        e.preventDefault();
        onNavigate && onNavigate(l);
      },
      onMouseEnter: () => setHov(l),
      onMouseLeave: () => setHov(null),
      style: {
        font: '600 14px/1 var(--font-body)',
        whiteSpace: 'nowrap',
        color: on || hov === l ? 'var(--nsl-maroon)' : 'var(--text-body)',
        textDecoration: 'none',
        padding: '8px 0',
        borderBottom: '2px solid ' + (on ? 'var(--nsl-gold)' : 'transparent')
      }
    }, l);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    size: "md",
    onClick: onSignIn
  }, signInLabel), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "md",
    onClick: onCta
  }, ctaLabel)));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Callout.jsx
try { (() => {
function Callout({
  variant = 'parchment',
  eyebrow,
  title,
  children,
  style
}) {
  const dark = variant === 'dark';
  const accent = variant === 'maroon';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-lg)',
      padding: '22px 24px',
      background: dark ? 'var(--nsl-deep-maroon)' : accent ? 'var(--nsl-maroon)' : 'var(--nsl-parchment)',
      color: dark || accent ? 'var(--nsl-parchment)' : 'var(--text-body)',
      ...style
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 11px/1.2 var(--font-body)',
      letterSpacing: 'var(--tracking-eyebrow)',
      textTransform: 'uppercase',
      color: dark || accent ? 'var(--nsl-gold)' : 'var(--nsl-maroon)',
      marginBottom: 10
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 17px/1.3 var(--font-display)',
      marginBottom: 6,
      color: dark || accent ? 'var(--nsl-parchment)' : 'var(--text-heading)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 15px/1.6 var(--font-body)'
    }
  }, children));
}
Object.assign(__ds_scope, { Callout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Callout.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function Card({
  variant = 'filled',
  title,
  subtitle,
  number,
  eyebrow,
  href,
  onClick,
  children,
  style
}) {
  const [hov, setHov] = React.useState(false);
  const interactive = !!(href || onClick);
  const V = {
    filled: {
      background: 'var(--surface-card)',
      boxShadow: 'none'
    },
    outline: {
      background: '#fff',
      boxShadow: 'inset 0 0 0 1px var(--border-card)'
    },
    dark: {
      background: 'var(--nsl-parchment-wash)',
      boxShadow: 'inset 0 0 0 1px var(--nsl-gold-line)'
    },
    white: {
      background: '#fff',
      boxShadow: 'var(--shadow-card)'
    }
  }[variant];
  const dark = variant === 'dark';
  const Tag = href ? 'a' : 'div';
  return /*#__PURE__*/React.createElement(Tag, {
    href: href,
    onClick: onClick,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      display: 'block',
      textDecoration: 'none',
      color: 'inherit',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 22px',
      ...V,
      cursor: interactive ? 'pointer' : 'default',
      transform: interactive && hov ? 'translateY(-2px)' : 'none',
      transition: 'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base)',
      ...(interactive && hov && variant !== 'dark' ? {
        boxShadow: 'var(--shadow-card)'
      } : {}),
      ...style
    }
  }, number && /*#__PURE__*/React.createElement("div", {
    style: {
      font: '800 28px/1 var(--font-display)',
      color: 'var(--nsl-gold)',
      marginBottom: 14
    }
  }, number), eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-eyebrow)',
      letterSpacing: 'var(--tracking-eyebrow)',
      textTransform: 'uppercase',
      color: dark ? 'var(--nsl-gold)' : 'var(--nsl-maroon)',
      marginBottom: 8
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 17px/1.3 var(--font-display)',
      color: dark ? 'var(--nsl-parchment)' : 'var(--text-heading)'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 14px/1.5 var(--font-body)',
      color: dark ? 'var(--text-on-dark-muted)' : 'var(--text-secondary)',
      marginTop: 4
    }
  }, subtitle), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/SectionHeader.jsx
try { (() => {
function SectionHeader({
  variant = 'panel',
  eyebrow,
  title,
  subtitle,
  number,
  style
}) {
  if (variant === 'numbered') return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 14,
      paddingBottom: 12,
      borderBottom: '2px solid var(--nsl-gold)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '800 48px/0.9 var(--font-display)',
      color: 'var(--nsl-gold)'
    }
  }, number), /*#__PURE__*/React.createElement("div", null, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 10px var(--font-body)',
      letterSpacing: 'var(--tracking-eyebrow)',
      textTransform: 'uppercase',
      color: 'var(--nsl-maroon)',
      marginBottom: 4
    }
  }, eyebrow), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '800 28px/1.1 var(--font-display)',
      color: 'var(--text-heading)'
    }
  }, title)));
  if (variant === 'plain') return /*#__PURE__*/React.createElement("div", {
    style: style
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-eyebrow)',
      letterSpacing: 'var(--tracking-eyebrow)',
      textTransform: 'uppercase',
      color: 'var(--nsl-maroon)',
      marginBottom: 10
    }
  }, eyebrow), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '800 38px/1.12 var(--font-display)',
      color: 'var(--text-heading)',
      textWrap: 'balance'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 17px/1.6 var(--font-body)',
      color: 'var(--text-secondary)',
      marginTop: 12,
      maxWidth: 640
    }
  }, subtitle));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--nsl-deep-maroon)',
      borderRadius: 'var(--radius-lg)',
      padding: '26px 28px',
      color: 'var(--nsl-parchment)',
      ...style
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 11px var(--font-body)',
      letterSpacing: 'var(--tracking-eyebrow)',
      textTransform: 'uppercase',
      color: 'var(--nsl-gold)',
      marginBottom: 10
    }
  }, eyebrow), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '800 38px/1.1 var(--font-display)',
      color: 'var(--nsl-parchment)',
      textWrap: 'balance'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 15px/1.6 var(--font-body)',
      color: 'var(--text-on-dark-muted)',
      marginTop: 12
    }
  }, subtitle));
}
Object.assign(__ds_scope, { SectionHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/SectionHeader.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/StatTile.jsx
try { (() => {
function StatTile({
  value,
  label,
  tone = 'dark',
  highlight = false,
  style
}) {
  const dark = tone === 'dark';
  const bg = highlight ? 'var(--nsl-maroon)' : dark ? 'var(--nsl-parchment-wash)' : '#fff';
  const line = highlight ? 'transparent' : dark ? 'var(--nsl-gold-line)' : 'var(--border-card)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-md)',
      padding: '16px 18px',
      background: bg,
      boxShadow: `inset 0 0 0 1px ${line}`,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 26px/1.1 var(--font-display)',
      color: dark || highlight ? 'var(--nsl-parchment)' : 'var(--nsl-maroon)'
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 13px/1.4 var(--font-body)',
      color: dark || highlight ? 'var(--text-on-dark-muted)' : 'var(--text-secondary)',
      marginTop: 6
    }
  }, label));
}
Object.assign(__ds_scope, { StatTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/StatTile.jsx", error: String((e && e.message) || e) }); }

// slides/fit.js
try { (() => {
// Scales the 1920×1080 .stage to fit the window.
(function () {
  function fit() {
    var s = document.querySelector('.stage');
    if (!s) return;
    var k = Math.min(innerWidth / 1920, innerHeight / 1080);
    s.style.transform = 'scale(' + k + ')';
    s.style.left = (innerWidth - 1920 * k) / 2 + 'px';
    s.style.top = (innerHeight - 1080 * k) / 2 + 'px';
  }
  addEventListener('resize', fit);
  addEventListener('DOMContentLoaded', fit);
  fit();
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/fit.js", error: String((e && e.message) || e) }); }

// ui_kits/member-guides/GuidePages.jsx
try { (() => {
(() => {
  const {
    Eyebrow,
    SectionHeader,
    Callout,
    NumberedList,
    DataTable,
    Badge,
    Card,
    Checkbox,
    Logo,
    StatTile
  } = window.NSLFCUDesignSystem_3e6328;
  const A = '../../assets/';
  const page = {
    width: 816,
    height: 1056,
    background: '#fff',
    position: 'relative',
    boxSizing: 'border-box',
    padding: '72px 72px 96px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(36,16,25,.12)',
    flex: 'none'
  };
  const body = {
    font: '400 16px/1.6 var(--font-body)',
    color: 'var(--nsl-ink)',
    margin: '0 0 16px',
    textWrap: 'pretty'
  };
  const h3 = {
    font: '700 22px/1.3 var(--font-display)',
    color: 'var(--nsl-ink)',
    margin: '28px 0 8px'
  };
  function PageFooter({
    guide,
    n
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 72,
        right: 72,
        bottom: 36,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid var(--nsl-rule)',
        paddingTop: 12,
        font: '500 11px var(--font-body)',
        letterSpacing: '.06em',
        color: 'var(--nsl-maroon)',
        textTransform: 'uppercase'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: A + 'logos/logo-mark.svg',
      style: {
        height: 12,
        opacity: .8
      },
      alt: ""
    }), "NSLFCU \xB7 ", guide.title), /*#__PURE__*/React.createElement("span", {
      style: {
        textTransform: 'none'
      }
    }, "nslfcu.org \xB7 (301) 899-0300 \xB7 Federally insured by NCUA \xB7 ", String(n).padStart(2, '0')));
  }
  function Cover({
    guide
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...page,
        background: 'var(--nsl-deep-maroon)',
        color: 'var(--nsl-parchment)'
      },
      "data-screen-label": "Cover"
    }, /*#__PURE__*/React.createElement("img", {
      src: A + 'logos/logo-mark-reverse.svg',
      alt: "",
      style: {
        position: 'absolute',
        right: -60,
        bottom: -40,
        width: 420,
        opacity: .1
      }
    }), /*#__PURE__*/React.createElement(Logo, {
      variant: "secondary",
      reverse: true,
      basePath: A + 'logos/',
      height: 64
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 72,
        right: 72,
        top: 380
      }
    }, /*#__PURE__*/React.createElement(Eyebrow, {
      tone: "gold"
    }, guide.kicker), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '800 58px/1.05 var(--font-display)',
        margin: '16px 0 20px',
        color: 'var(--nsl-parchment)'
      }
    }, guide.cover), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '500 20px/1.4 var(--font-body)',
        color: '#fff'
      }
    }, guide.sub), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '400 16px/1.6 var(--font-body)',
        color: 'var(--text-on-dark-muted)',
        marginTop: 16,
        maxWidth: 420
      }
    }, guide.blurb), /*#__PURE__*/React.createElement(Eyebrow, {
      tone: "gold",
      rule: true,
      style: {
        marginTop: 44
      }
    }, "What's inside"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        columnGap: 28,
        marginTop: 10
      }
    }, guide.inside.map(t => /*#__PURE__*/React.createElement("div", {
      key: t,
      style: {
        font: '400 14px var(--font-body)',
        padding: '10px 0',
        borderBottom: '1px solid var(--nsl-parchment-line)'
      }
    }, t)))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 72,
        bottom: 56,
        font: '400 12px/1.7 var(--font-body)',
        color: 'var(--text-on-dark-muted)'
      }
    }, /*#__PURE__*/React.createElement("b", {
      style: {
        color: 'var(--nsl-parchment)',
        fontWeight: 600
      }
    }, "Open a savings account and start building your future today."), /*#__PURE__*/React.createElement("br", null), "nslfcu.org \xB7 (301) 899-0300 \xB7 4929 Allentown Rd, Suitland, MD 20746"));
  }
  function Contents({
    guide
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: page,
      "data-screen-label": "Contents"
    }, /*#__PURE__*/React.createElement(Eyebrow, null, "Contents"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '800 38px/1.1 var(--font-display)',
        margin: '12px 0 28px'
      }
    }, guide.toc), /*#__PURE__*/React.createElement(NumberedList, {
      tone: "maroon",
      items: guide.sections
    }), /*#__PURE__*/React.createElement(Callout, {
      eyebrow: "You've got this.",
      style: {
        marginTop: 36
      }
    }, "If you've tried to budget before and it fell apart \u2014 you're not alone and you're not bad with money. Most budgets fail because of bad design, not bad people. No shame spirals, no perfection required. Just a clear plan, the right tools, and the knowledge that None Suffer Lack FCU is in your corner every step of the way."), /*#__PURE__*/React.createElement(PageFooter, {
      guide: guide,
      n: 2
    }));
  }
  function SectionPage({
    guide
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: page,
      "data-screen-label": "Section"
    }, /*#__PURE__*/React.createElement(SectionHeader, {
      eyebrow: "Section 01",
      title: "Why Most Budgets Fail",
      subtitle: "Before we build your budget, let's make sure it doesn't have the same design flaws that sink most budgets in the first two weeks."
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        ...body,
        marginTop: 24
      }
    }, "Here's the truth no one tells you: most budgets fail not because the person using them is undisciplined \u2014 but because the budget itself was built wrong. Too rigid. Too complicated. Let's name every trap so you can avoid them all."), /*#__PURE__*/React.createElement("div", {
      style: h3
    }, "The 7 Budget Killers"), /*#__PURE__*/React.createElement(NumberedList, {
      items: [{
        title: "It's too restrictive",
        body: 'Budgets that cut everything fun feel like punishment. A good budget includes guilt-free spending for things you enjoy — just on purpose.'
      }, {
        title: "It doesn't account for irregular expenses",
        body: "Car registration. Holiday gifts. Annual subscriptions. These aren't surprises — they're predictable."
      }, {
        title: 'It was built on fantasy income or expenses',
        body: 'Your budget has to start with your real numbers, not the numbers you wish were true.'
      }]
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 16px var(--font-body)',
        color: 'var(--nsl-maroon)',
        margin: '20px 0 16px'
      }
    }, "The fix for every single one of these? It's in the next three sections. Let's go."), /*#__PURE__*/React.createElement(Callout, {
      variant: "dark",
      eyebrow: "None Suffer Lack FCU can help"
    }, "NSLFCU members have access to free financial wellness consultations \u2014 including one-on-one budgeting help. Whether you're starting from zero or rebuilding after a rough stretch, we've seen it all and we're here to help."), /*#__PURE__*/React.createElement(PageFooter, {
      guide: guide,
      n: 3
    }));
  }
  function TablePage({
    guide
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: page,
      "data-screen-label": "Table"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...h3,
        marginTop: 0
      }
    }, "Types of Debt \u2014 Not All Debt Is Equal"), /*#__PURE__*/React.createElement("p", {
      style: body
    }, "Understanding what kind of debt you have helps you prioritize which to attack first."), /*#__PURE__*/React.createElement(DataTable, {
      columns: [{
        key: 't',
        label: 'Debt type'
      }, {
        key: 'r',
        label: 'Typical rate'
      }, {
        key: 'p',
        label: 'Priority'
      }, {
        key: 'n',
        label: 'Notes'
      }],
      rows: [{
        t: 'Credit Cards',
        r: '18%–29%',
        p: /*#__PURE__*/React.createElement(Badge, {
          tone: "high"
        }, "High"),
        n: 'Highest rates — attack first'
      }, {
        t: 'Personal Loans',
        r: '8%–20%',
        p: /*#__PURE__*/React.createElement(Badge, {
          tone: "medium"
        }, "Medium"),
        n: 'Fixed term — manageable with a plan'
      }, {
        t: 'Auto Loans',
        r: '5%–12%',
        p: /*#__PURE__*/React.createElement(Badge, {
          tone: "medium"
        }, "Medium"),
        n: 'Secured — keep current to protect asset'
      }, {
        t: 'Student Loans',
        r: '4%–8%',
        p: /*#__PURE__*/React.createElement(Badge, {
          tone: "lower"
        }, "Lower"),
        n: 'Lower rates — focus on high-interest first'
      }]
    }), /*#__PURE__*/React.createElement("div", {
      style: h3
    }, "Your Debt Snapshot: Three Numbers That Matter"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Card, {
      variant: "outline",
      number: "01",
      title: "Total balance owed",
      subtitle: "Add up every debt. This is your starting line."
    }), /*#__PURE__*/React.createElement(Card, {
      variant: "outline",
      number: "02",
      title: "Total minimum payments",
      subtitle: "This is the monthly floor you're working with."
    }), /*#__PURE__*/React.createElement(Card, {
      variant: "outline",
      number: "03",
      title: "Weighted average rate",
      subtitle: "How expensive your debt really is."
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: 14,
        marginTop: 20
      }
    }, /*#__PURE__*/React.createElement(StatTile, {
      tone: "light",
      value: "$500\u2013$1,000",
      label: "Starter emergency fund"
    }), /*#__PURE__*/React.createElement(StatTile, {
      tone: "light",
      value: "3 months",
      label: "of expenses \u2014 next milestone"
    }), /*#__PURE__*/React.createElement(StatTile, {
      highlight: true,
      value: "3\u20136 months",
      label: "of expenses \u2014 fully protected"
    })), /*#__PURE__*/React.createElement(PageFooter, {
      guide: guide,
      n: 4
    }));
  }
  function Worksheet({
    guide
  }) {
    const groups = {
      'Before the week starts': ['Checked my account balance', 'Reviewed upcoming bills', 'Set my spending limit for the week'],
      'End of the week': ['Logged every purchase', 'Compared spending to my plan', 'Moved leftover money to savings', 'Celebrated one win — any size']
    };
    return /*#__PURE__*/React.createElement("div", {
      style: page,
      "data-screen-label": "Worksheet"
    }, /*#__PURE__*/React.createElement(SectionHeader, {
      variant: "numbered",
      number: "02",
      eyebrow: "Tool 2",
      title: "Weekly Money Check-In Checklist"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        ...body,
        marginTop: 18
      }
    }, "Set aside 10 minutes every week \u2014 same day, same time. Small, steady check-ins beat one big panic every month."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 28,
        marginTop: 12
      }
    }, Object.entries(groups).map(([g, items]) => /*#__PURE__*/React.createElement("div", {
      key: g
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '700 17px var(--font-display)',
        margin: '0 0 12px',
        paddingBottom: 8,
        borderBottom: '2px solid var(--nsl-gold)'
      }
    }, g), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gap: 12
      }
    }, items.map(t => /*#__PURE__*/React.createElement(Checkbox, {
      key: t,
      label: t
    })))))), /*#__PURE__*/React.createElement(Callout, {
      eyebrow: "Monthly add-on",
      title: "Do This at the End of Each Month",
      style: {
        marginTop: 36
      }
    }, "The weekly check-in keeps you aware. The monthly review keeps you on track. Answer the 5 Monthly Budget Review questions and update next month's template with any changes."), /*#__PURE__*/React.createElement(PageFooter, {
      guide: guide,
      n: 20
    }));
  }
  Object.assign(window, {
    GuideCover: Cover,
    GuideContents: Contents,
    GuideSection: SectionPage,
    GuideTable: TablePage,
    GuideWorksheet: Worksheet
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/member-guides/GuidePages.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/HomeSections.jsx
try { (() => {
(() => {
  // nslfcu.org home page sections. Composes DS primitives from window.NSLFCU bundle.
  const {
    Button,
    Eyebrow,
    Card,
    FeatureList,
    SectionHeader,
    StatTile,
    RateDisclosure
  } = window.NSLFCUDesignSystem_3e6328;
  const A = '../../assets/';
  const wrap = {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 40px',
    boxSizing: 'border-box'
  };
  function Hero({
    onJoin
  }) {
    return /*#__PURE__*/React.createElement("section", {
      style: {
        background: 'var(--nsl-parchment)',
        padding: '72px 0 64px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrap,
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1fr)',
        gap: 56,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Digital banking"), /*#__PURE__*/React.createElement("h1", {
      style: {
        font: '800 60px/1.05 var(--font-display)',
        color: 'var(--nsl-ink)',
        margin: '16px 0 20px',
        letterSpacing: '-.01em',
        textWrap: 'balance'
      }
    }, "Bank Smarter. Anytime, Anywhere."), /*#__PURE__*/React.createElement("p", {
      style: {
        font: '400 18px/1.6 var(--font-body)',
        color: 'var(--text-secondary)',
        margin: 0,
        maxWidth: 520
      }
    }, "Manage your finances with confidence through NSLFCU's secure digital banking platform. Access your accounts, apply for loans, transfer funds, deposit checks, and more \u2014 anytime, anywhere."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        marginTop: 32
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      onClick: onJoin
    }, "Join Today"), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      variant: "secondary"
    }, "Schedule a Visit"))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        aspectRatio: '1 / 1',
        background: `url(${A}photos/family-hero.png) 60% bottom/cover, var(--nsl-deep-maroon)`
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: A + 'screens/app-home.png',
      alt: "",
      style: {
        position: 'absolute',
        left: 24,
        bottom: -40,
        width: '38%',
        filter: 'drop-shadow(0 18px 30px rgba(36,16,25,.35))'
      }
    }))));
  }
  function Products({
    onNavigate
  }) {
    const items = [['Auto Loans', 'Purchase or refinance with flexible terms and affordable rates.', 'site/auto-loan.jpg', 'Loans'], ['Mortgage Loans', 'Personalized guidance for homebuyers and homeowners.', 'site/mortgage.jpg', 'Loans'], ['Personal Loans', 'Flexibility for consolidation, emergencies, or projects.', 'site/personal-loan.jpg', 'Loans'], ['Digital Banking', 'Transfer funds, deposit checks and apply — anytime.', 'site/digital-banking.jpg', 'Accounts']];
    return /*#__PURE__*/React.createElement("section", {
      style: {
        background: '#fff',
        padding: '88px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: wrap
    }, /*#__PURE__*/React.createElement(SectionHeader, {
      variant: "plain",
      eyebrow: "What we offer",
      title: "Financial Products and Services",
      subtitle: "A range of financial services designed to support everyday needs and major life milestones."
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
        gap: 20,
        marginTop: 40
      }
    }, items.map(([t, s, img, to]) => /*#__PURE__*/React.createElement(Card, {
      key: t,
      onClick: () => onNavigate(to),
      style: {
        padding: 0,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        aspectRatio: '4 / 3',
        background: `url(${A + img}) center/cover`
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '18px 20px 22px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '700 18px/1.3 var(--font-display)'
      }
    }, t), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '400 14px/1.5 var(--font-body)',
        color: 'var(--text-secondary)',
        margin: '6px 0 14px'
      }
    }, s), /*#__PURE__*/React.createElement(Button, {
      variant: "link"
    }, "Learn more")))))));
  }
  function Resources({
    onDownload
  }) {
    const guides = [['Budgeting that actually works', 'A no-guilt, no-jargon guide to taking control of your money — starting today.', 'site/guide-budgeting.jpg'], ['Debt freedom strategy guide', "Whether you're tackling credit cards, medical bills, or loans — a clear, honest path forward.", 'site/guide-debt.jpg'], ['The first-time homebuyer roadmap', 'From budgeting and mortgages to closing day and beyond — we walk every step with you.', 'site/guide-homebuyer.jpg'], ["The smart car buyer's handbook", 'Set your budget, spot dealer tactics, and choose the right loan.', 'site/guide-car.jpg']];
    return /*#__PURE__*/React.createElement("section", {
      style: {
        background: 'var(--nsl-parchment)',
        padding: '88px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: wrap
    }, /*#__PURE__*/React.createElement(SectionHeader, {
      variant: "plain",
      eyebrow: "Free member resources",
      title: "Knowledge Is Power. Growth Is Possible.",
      subtitle: "Free downloadable guides to help you plan smarter, borrow wisely, and build confidently. When one member grows stronger, our entire community grows with them."
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
        gap: 20,
        marginTop: 40
      }
    }, guides.map(([t, s, img]) => /*#__PURE__*/React.createElement("div", {
      key: t,
      style: {
        display: 'grid',
        gridTemplateColumns: '180px 1fr',
        gap: 22,
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        padding: 16,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        aspectRatio: '1 / 1',
        borderRadius: 12,
        background: `url(${A + img}) center/cover`
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '700 20px/1.25 var(--font-display)'
      }
    }, t), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '400 14px/1.55 var(--font-body)',
        color: 'var(--text-secondary)',
        margin: '8px 0 16px'
      }
    }, s), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      onClick: () => onDownload({
        t,
        s,
        img
      })
    }, "Download")))))));
  }
  function DigitalBanking() {
    return /*#__PURE__*/React.createElement("section", {
      style: {
        background: '#fff',
        padding: '88px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrap,
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
        gap: 64,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--nsl-parchment)',
        borderRadius: 'var(--radius-xl)',
        padding: '40px 0 0',
        display: 'flex',
        justifyContent: 'center',
        gap: 20,
        overflow: 'hidden',
        height: 460,
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: A + 'screens/app-premium-checking.png',
      alt: "",
      style: {
        height: 480
      }
    }), /*#__PURE__*/React.createElement("img", {
      src: A + 'screens/app-funding.png',
      alt: "",
      style: {
        height: 480,
        marginTop: 50
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeader, {
      variant: "plain",
      eyebrow: "Mobile & online",
      title: "Your Credit Union. Anywhere You Are.",
      subtitle: "Banking should be simple, secure, and accessible \u2014 from loan applications to mobile deposits and everything in between."
    }), /*#__PURE__*/React.createElement(FeatureList, {
      style: {
        marginTop: 28
      },
      columns: 2,
      iconBase: A + 'icons/',
      items: ['Mobile Check Deposit', 'Card Management', 'Send & Receive Payments', 'Budget & Track Spending', 'Secure 24/7 Access']
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        marginTop: 32
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: A + 'badges/app-store.png',
      alt: "Download on the App Store",
      style: {
        height: 44
      }
    }), /*#__PURE__*/React.createElement("img", {
      src: A + 'badges/google-play.png',
      alt: "Get it on Google Play",
      style: {
        height: 44
      }
    })))));
  }
  function Community() {
    return /*#__PURE__*/React.createElement("section", {
      style: {
        background: 'var(--nsl-deep-maroon)',
        padding: '96px 0',
        position: 'relative',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: A + 'logos/logo-mark-reverse.svg',
      alt: "",
      style: {
        position: 'absolute',
        right: -80,
        bottom: -120,
        width: 520,
        opacity: .08
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrap,
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
        gap: 64,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
      tone: "gold"
    }, "This isn't banking for profit. It's banking with purpose."), /*#__PURE__*/React.createElement("h2", {
      style: {
        font: '800 44px/1.1 var(--font-display)',
        color: 'var(--nsl-parchment)',
        margin: '16px 0 18px',
        textWrap: 'balance'
      }
    }, "Built on Faith. Powered by Community."), /*#__PURE__*/React.createElement("p", {
      style: {
        font: '400 17px/1.65 var(--font-body)',
        color: 'var(--text-on-dark-muted)',
        margin: 0
      }
    }, "None Suffer Lack Federal Credit Union exists to serve members of From The Heart Church Ministries and their families. As a member-owned institution, every decision we make is centered around your growth and well-being."), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 32
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      size: "lg"
    }, "Book a call"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(StatTile, {
      value: "$28.2M",
      label: "Total assets, fiscal year-end 2026"
    }), /*#__PURE__*/React.createElement(StatTile, {
      value: "$10",
      label: "New minimum share value to open an account"
    }), /*#__PURE__*/React.createElement(StatTile, {
      value: "3.25% APY*",
      label: "Premium Checking Annual Percentage Yield"
    }), /*#__PURE__*/React.createElement(StatTile, {
      value: "Suitland, MD",
      label: "4929 Allentown Rd"
    }), /*#__PURE__*/React.createElement(RateDisclosure, {
      tone: "dark",
      size: 13,
      apy: "3.25%",
      product: "Premium Checking",
      asOf: "10/01/2026",
      minBalance: "$1,000",
      variable: false,
      rateNote: "The rate is fixed as long as the $1,000 minimum balance is maintained.",
      style: {
        gridColumn: '1 / -1'
      }
    }))));
  }
  Object.assign(window, {
    Hero,
    Products,
    Resources,
    DigitalBanking,
    Community,
    kitWrap: wrap,
    KIT_ASSETS: A
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/HomeSections.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/InnerPages.jsx
try { (() => {
(() => {
  const {
    Button,
    Eyebrow,
    Card,
    FeatureList,
    SectionHeader,
    StatTile,
    DataTable,
    NumberedList,
    Callout,
    RateDisclosure
  } = window.NSLFCUDesignSystem_3e6328;
  function PageHero({
    eyebrow,
    title,
    body,
    img,
    children
  }) {
    return /*#__PURE__*/React.createElement("section", {
      style: {
        background: 'var(--nsl-parchment)',
        padding: '64px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...window.kitWrap,
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
        gap: 56,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, eyebrow), /*#__PURE__*/React.createElement("h1", {
      style: {
        font: '800 52px/1.08 var(--font-display)',
        margin: '16px 0 18px',
        textWrap: 'balance'
      }
    }, title), /*#__PURE__*/React.createElement("p", {
      style: {
        font: '400 18px/1.6 var(--font-body)',
        color: 'var(--text-secondary)',
        margin: 0,
        maxWidth: 520
      }
    }, body), children), /*#__PURE__*/React.createElement("div", {
      style: {
        aspectRatio: '5 / 4',
        borderRadius: 'var(--radius-xl)',
        background: `url(${window.KIT_ASSETS + img}) center/cover`
      }
    })));
  }
  function LoansPage() {
    const A = window.KIT_ASSETS;
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHero, {
      eyebrow: "Auto loans",
      title: "Affordable Auto Loans Built for You",
      body: "Drive the car you need with flexible terms, competitive rates, and a simple online application process.",
      img: "photos/car-keys-handoff.jpg"
    }, /*#__PURE__*/React.createElement(FeatureList, {
      style: {
        marginTop: 24
      },
      iconBase: A + 'icons/',
      items: ['Rate matching available', 'Flexible repayment options', 'Fast, member-focused approvals']
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        marginTop: 28
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "lg"
    }, "Apply Now"), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      variant: "secondary"
    }, "Book a call"))), /*#__PURE__*/React.createElement("section", {
      style: {
        background: '#fff',
        padding: '88px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: window.kitWrap
    }, /*#__PURE__*/React.createElement(SectionHeader, {
      variant: "plain",
      eyebrow: "How it works",
      title: "Getting Started Is Easy."
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
        gap: 20,
        marginTop: 36
      }
    }, [['01', 'Step One', 'Complete your secure online application in minutes.'], ['02', 'Step Two', 'Connect with one of our knowledgeable loan officers for personalized support.'], ['03', 'Step Three', 'Receive your approval and move forward with confidence.']].map(([n, t, s]) => /*#__PURE__*/React.createElement(Card, {
      key: n,
      variant: "outline",
      number: n,
      title: t,
      subtitle: s
    }))))), /*#__PURE__*/React.createElement("section", {
      style: {
        background: 'var(--nsl-parchment)',
        padding: '88px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...window.kitWrap,
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)',
        gap: 48,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        padding: 28
      }
    }, /*#__PURE__*/React.createElement(SectionHeader, {
      variant: "plain",
      eyebrow: "Loan types",
      title: "Funding What Matters"
    }), /*#__PURE__*/React.createElement(DataTable, {
      style: {
        marginTop: 20
      },
      columns: [{
        key: 'l',
        label: 'Loan'
      }, {
        key: 'f',
        label: 'Best for'
      }, {
        key: 'n',
        label: 'Notes'
      }],
      rows: [{
        l: 'Auto Loans',
        f: 'New & used vehicles',
        n: 'Competitive rates; refinance available'
      }, {
        l: 'Mortgage Loans',
        f: 'Buying or refinancing',
        n: 'Through our partner CUMA'
      }, {
        l: 'Personal Loans',
        f: "Life's unexpected moments",
        n: 'Clear terms, predictable payments'
      }]
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Callout, {
      variant: "dark",
      eyebrow: "Ready to drive forward?",
      title: "Auto loan requirements"
    }, /*#__PURE__*/React.createElement(NumberedList, {
      tone: "gold",
      style: {
        marginTop: 6
      },
      items: [{
        title: /*#__PURE__*/React.createElement("span", {
          style: {
            color: 'var(--nsl-parchment)'
          }
        }, "Minimum 6-month membership")
      }, {
        title: /*#__PURE__*/React.createElement("span", {
          style: {
            color: 'var(--nsl-parchment)'
          }
        }, "One loan permitted")
      }, {
        title: /*#__PURE__*/React.createElement("span", {
          style: {
            color: 'var(--nsl-parchment)'
          }
        }, "$20 application fee")
      }]
    })), /*#__PURE__*/React.createElement(Callout, {
      eyebrow: "Free member resource",
      title: "The Smart Car Buyer's Handbook"
    }, "Set your budget, spot dealer tactics, and drive off the lot knowing you got a great deal.")))));
  }
  function AccountsPage() {
    const A = window.KIT_ASSETS;
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHero, {
      eyebrow: "Accounts & services",
      title: "Everyday Banking, Made Simple",
      body: "Savings, checking and membership built for From The Heart Church Ministries members and their families.",
      img: "photos/member-portrait.jpg"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        marginTop: 28
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "lg"
    }, "Open an Account"), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      variant: "link"
    }, "Compare accounts"))), /*#__PURE__*/React.createElement("section", {
      style: {
        background: '#fff',
        padding: '72px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...window.kitWrap,
        display: 'grid',
        gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
        gap: 20
      }
    }, /*#__PURE__*/React.createElement(Card, {
      title: "Savings",
      subtitle: "Grow steadily with regular and holiday club shares.",
      href: "#"
    }), /*#__PURE__*/React.createElement(Card, {
      title: "Checking",
      subtitle: "Everyday access with no hidden fees.",
      href: "#"
    }), /*#__PURE__*/React.createElement(Card, {
      title: "Membership",
      subtitle: "Open to From The Heart Church Ministries members & families.",
      href: "#"
    }))), /*#__PURE__*/React.createElement("section", {
      style: {
        background: 'var(--nsl-deep-maroon)',
        padding: '88px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...window.kitWrap,
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)',
        gap: 56,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
      tone: "gold"
    }, "New this year"), /*#__PURE__*/React.createElement("h2", {
      style: {
        font: '800 44px/1.1 var(--font-display)',
        color: 'var(--nsl-parchment)',
        margin: '16px 0'
      }
    }, "Introducing Premium Checking"), /*#__PURE__*/React.createElement("p", {
      style: {
        font: '400 17px/1.65 var(--font-body)',
        color: 'var(--text-on-dark-muted)',
        margin: '0 0 28px'
      }
    }, "For members who keep a $1,000 minimum balance and want that balance to earn something. Dividends are compounded and credited monthly."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(StatTile, {
      value: "3.25% APY*",
      label: "Annual Percentage Yield, with a $1,000 minimum balance"
    }), /*#__PURE__*/React.createElement(StatTile, {
      value: "$250",
      label: "Overdraft protection, no credit pull"
    }), /*#__PURE__*/React.createElement(StatTile, {
      value: "0.50% off",
      label: "Rate discount on all loans"
    }), /*#__PURE__*/React.createElement(StatTile, {
      value: "Unlimited",
      label: "Transactions, with a VISA debit card"
    })), /*#__PURE__*/React.createElement(RateDisclosure, {
      tone: "dark",
      size: 13,
      apy: "3.25%",
      product: "Premium Checking",
      asOf: "10/01/2026",
      minBalance: "$1,000",
      variable: false,
      rateNote: "The rate is fixed as long as the $1,000 minimum balance is maintained.",
      style: {
        marginTop: 20
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        marginTop: 28
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "accent"
    }, "Switch to Premium"), /*#__PURE__*/React.createElement(Button, {
      variant: "accent-outline"
    }, "Talk to us"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: A + 'screens/app-premium-checking.png',
      alt: "",
      style: {
        height: 520
      }
    })))));
  }
  Object.assign(window, {
    LoansPage,
    AccountsPage
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/InnerPages.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SupportSections.jsx
try { (() => {
(() => {
  const {
    Button,
    Eyebrow,
    Accordion,
    SectionHeader,
    Logo,
    Dialog,
    Input,
    Select
  } = window.NSLFCUDesignSystem_3e6328;
  function Testimonials() {
    const quotes = [['The auto loan process was simple and stress-free. NSLFCU truly cares about its members.', 'Member, auto loan'], ["I've been a member since I was a teenager and there isn't a group that I trust more with helping me make financial decisions.", 'Jon Hines'], ["Love, love how I'm treated and respected. A place where I am greeted by name.", 'Novella Anderson']];
    const [i, setI] = React.useState(0);
    const A = window.KIT_ASSETS;
    return /*#__PURE__*/React.createElement("section", {
      style: {
        background: 'var(--nsl-parchment)',
        padding: '88px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...window.kitWrap,
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) 380px',
        gap: 64,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "What our members are saying"), /*#__PURE__*/React.createElement("img", {
      src: A + 'icons/quote-left.png',
      alt: "",
      style: {
        height: 36,
        marginTop: 28
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        font: '700 32px/1.3 var(--font-display)',
        color: 'var(--nsl-ink)',
        margin: '16px 0 20px',
        minHeight: 126,
        textWrap: 'pretty'
      }
    }, quotes[i][0]), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 15px var(--font-body)',
        color: 'var(--nsl-maroon)'
      }
    }, "\u2014 ", quotes[i][1]), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        marginTop: 28
      }
    }, [-1, 1].map(d => /*#__PURE__*/React.createElement("button", {
      key: d,
      onClick: () => setI((i + d + quotes.length) % quotes.length),
      "aria-label": d < 0 ? 'Previous' : 'Next',
      style: {
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: 0,
        background: '#fff',
        boxShadow: 'inset 0 0 0 1px var(--nsl-maroon-line)',
        cursor: 'pointer',
        display: 'grid',
        placeItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: A + 'icons/chevron-' + (d < 0 ? 'left' : 'right') + '.png',
      alt: "",
      style: {
        height: 14
      }
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
        aspectRatio: '4 / 5',
        borderRadius: 'var(--radius-xl)',
        background: `url(${A}site/testimonial.png) center/cover`
      }
    })));
  }
  function FAQ() {
    const tabs = {
      'Enrollment & Access': [['How do I enroll in the new digital banking?', 'Download the new app or visit our website. Click “Enroll,” enter your Membership Number, SSN, and Date of Birth, then create your username and password.'], ['Where can I find my membership number?', 'Log in to online banking and click the “Show Account Number” tab, or call the Membership Coordinator directly at 301-899-0300.'], ['Do I need to enroll separately for mobile and online banking?', 'No. One enrollment provides access to both platforms.']],
      'Transfers & Payments': [['How do I add an external account?', 'Go to My Finance → External Accounts → Add Account and follow Plaid verification. If unavailable, you may use micro-deposit verification.'], ['What happens to scheduled bill payments?', 'Existing bill payments will remain scheduled.']],
      'Mobile Features': [['Will Mobile Check Deposit still work?', 'Yes. From the mobile app, select the plus menu and mobile deposit.'], ['My mobile deposit shows pending.', 'Please allow 2–3 business days for funds to be available.']]
    };
    const [tab, setTab] = React.useState('Enrollment & Access');
    return /*#__PURE__*/React.createElement("section", {
      style: {
        background: '#fff',
        padding: '88px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...window.kitWrap,
        display: 'grid',
        gridTemplateColumns: '360px minmax(0,1fr)',
        gap: 64
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeader, {
      variant: "plain",
      eyebrow: "Help center",
      title: "Questions? We've got answers."
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gap: 6,
        marginTop: 28
      }
    }, Object.keys(tabs).map(t => /*#__PURE__*/React.createElement("button", {
      key: t,
      onClick: () => setTab(t),
      style: {
        all: 'unset',
        cursor: 'pointer',
        padding: '12px 18px',
        borderRadius: 'var(--radius-pill)',
        font: '600 14px var(--font-body)',
        background: t === tab ? 'var(--nsl-maroon)' : 'transparent',
        color: t === tab ? '#fff' : 'var(--nsl-ink)'
      }
    }, t)))), /*#__PURE__*/React.createElement(Accordion, {
      key: tab,
      items: tabs[tab].map(([q, a]) => ({
        q,
        a
      }))
    })));
  }
  function Footer({
    onNavigate
  }) {
    const col = (h, links) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 12px var(--font-body)',
        letterSpacing: '.2em',
        textTransform: 'uppercase',
        color: 'var(--nsl-gold)',
        marginBottom: 16
      }
    }, h), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gap: 10
      }
    }, links.map(l => /*#__PURE__*/React.createElement("a", {
      key: l,
      href: "#",
      onClick: e => {
        e.preventDefault();
        onNavigate && onNavigate(l.includes('Loan') ? 'Loans' : 'Home');
      },
      style: {
        font: '400 14px var(--font-body)',
        color: 'var(--nsl-parchment)',
        textDecoration: 'none'
      }
    }, l))));
    const A = window.KIT_ASSETS;
    return /*#__PURE__*/React.createElement("footer", {
      style: {
        background: 'var(--nsl-deep-maroon)',
        color: 'var(--nsl-parchment)',
        padding: '72px 0 32px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...window.kitWrap
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.6fr 1fr 1fr',
        gap: 48
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Logo, {
      reverse: true,
      basePath: A + 'logos/',
      height: 40
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '400 14px/1.8 var(--font-body)',
        color: 'var(--text-on-dark-muted)',
        marginTop: 24
      }
    }, "4929 Allentown Rd, Suitland, MD 20746", /*#__PURE__*/React.createElement("br", null), "Routing Number: 055080376", /*#__PURE__*/React.createElement("br", null), "hello@nslfcu.org \xB7 (301) 899-0300"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        marginTop: 20
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: A + 'badges/app-store.png',
      alt: "",
      style: {
        height: 38
      }
    }), /*#__PURE__*/React.createElement("img", {
      src: A + 'badges/google-play.png',
      alt: "",
      style: {
        height: 38
      }
    }))), col('NSLFCU', ['Welcome', 'How to Join', 'Disclosures', 'Contact us']), col('Loan Info', ['Personal Loan', 'Loan Rate Sheet', 'Auto Loan & Rates', 'Mortgage Loan'])), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid var(--nsl-parchment-line)',
        marginTop: 56,
        paddingTop: 24,
        font: '400 13px var(--font-body)',
        color: 'var(--text-on-dark-muted)'
      }
    }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 NSLFCU. All rights reserved. Federally insured by NCUA."), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        gap: 24
      }
    }, /*#__PURE__*/React.createElement("a", {
      href: "#",
      style: {
        color: 'inherit'
      }
    }, "Privacy Policy"), /*#__PURE__*/React.createElement("a", {
      href: "#",
      style: {
        color: 'inherit'
      }
    }, "Terms of Service")))));
  }
  function GuideDialog({
    guide,
    onClose
  }) {
    const [sent, setSent] = React.useState(false);
    if (!guide) return null;
    return /*#__PURE__*/React.createElement(Dialog, {
      open: true,
      image: window.KIT_ASSETS + guide.img,
      title: guide.t,
      onClose: onClose
    }, sent ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Eyebrow, null, "Thank you!"), /*#__PURE__*/React.createElement("p", {
      style: {
        font: '400 16px/1.6 var(--font-body)',
        margin: 0
      }
    }, "Your guide is on its way to your inbox. Questions? Stop by 4929 Allentown Rd or call (301) 899-0300."), /*#__PURE__*/React.createElement(Button, {
      onClick: onClose
    }, "Done")) : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        font: '400 15px/1.55 var(--font-body)',
        color: 'var(--text-secondary)',
        margin: '-6px 0 4px'
      }
    }, guide.s), /*#__PURE__*/React.createElement(Input, {
      placeholder: "Full name"
    }), /*#__PURE__*/React.createElement(Input, {
      placeholder: "Email",
      type: "email"
    }), /*#__PURE__*/React.createElement(Input, {
      placeholder: "Phone number"
    }), /*#__PURE__*/React.createElement(Select, {
      placeholder: "Which best describes you?",
      options: ['Current member', 'Church member, not yet a member', 'Family of a member']
    }), /*#__PURE__*/React.createElement(Button, {
      fullWidth: true,
      size: "lg",
      onClick: () => setSent(true)
    }, "Download")));
  }
  Object.assign(window, {
    Testimonials,
    FAQ,
    Footer,
    GuideDialog
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SupportSections.jsx", error: String((e && e.message) || e) }); }

__ds_ns.EmailFooter = __ds_scope.EmailFooter;

__ds_ns.NCUAStatement = __ds_scope.NCUAStatement;

__ds_ns.NonDepositDisclosure = __ds_scope.NonDepositDisclosure;

__ds_ns.RateDisclosure = __ds_scope.RateDisclosure;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.DataTable = __ds_scope.DataTable;

__ds_ns.FeatureList = __ds_scope.FeatureList;

__ds_ns.NumberedList = __ds_scope.NumberedList;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Accordion = __ds_scope.Accordion;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.Callout = __ds_scope.Callout;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.SectionHeader = __ds_scope.SectionHeader;

__ds_ns.StatTile = __ds_scope.StatTile;

})();
