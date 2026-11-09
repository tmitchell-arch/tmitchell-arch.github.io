/* @ds-bundle: {"format":4,"namespace":"ClarkeSchoolsDesignSystem_1c554e","components":[{"name":"CTAButton","sourcePath":"components/actions/CTAButton.jsx"},{"name":"SwipeArrow","sourcePath":"components/actions/SwipeArrow.jsx"},{"name":"Eyebrow","sourcePath":"components/brand/Eyebrow.jsx"},{"name":"LocationsBar","sourcePath":"components/brand/LocationsBar.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"BoldLabel","sourcePath":"components/content/BoldLabel.jsx"},{"name":"ExpertCard","sourcePath":"components/content/ExpertCard.jsx"},{"name":"InfoCard","sourcePath":"components/content/InfoCard.jsx"},{"name":"IntroRule","sourcePath":"components/content/IntroRule.jsx"},{"name":"NumberedItem","sourcePath":"components/content/NumberedItem.jsx"},{"name":"BRAND_ICON_NAMES","sourcePath":"components/icons/BrandIcon.jsx"},{"name":"BrandIcon","sourcePath":"components/icons/BrandIcon.jsx"},{"name":"SocialIcons","sourcePath":"components/icons/SocialIcons.jsx"},{"name":"HighlightBar","sourcePath":"components/labels/HighlightBar.jsx"},{"name":"SectionPill","sourcePath":"components/labels/SectionPill.jsx"},{"name":"TextPlate","sourcePath":"components/labels/TextPlate.jsx"}],"sourceHashes":{"components/actions/CTAButton.jsx":"8332a38ba75f","components/actions/SwipeArrow.jsx":"f5afde8b9b04","components/brand/Eyebrow.jsx":"dcbd4c90fb8c","components/brand/LocationsBar.jsx":"8a115104c50d","components/brand/Logo.jsx":"a4c23851401b","components/content/BoldLabel.jsx":"f9e6871a12b1","components/content/ExpertCard.jsx":"d680019cd311","components/content/InfoCard.jsx":"d5e81dfbfd6c","components/content/IntroRule.jsx":"1198b0b15e1b","components/content/NumberedItem.jsx":"493f06359041","components/icons/BrandIcon.jsx":"b8e3e6d9fc1f","components/icons/SocialIcons.jsx":"ce0285b69f98","components/labels/HighlightBar.jsx":"2857a871a268","components/labels/SectionPill.jsx":"6222fdd2883f","components/labels/TextPlate.jsx":"3189fb6cae81"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ClarkeSchoolsDesignSystem_1c554e = window.ClarkeSchoolsDesignSystem_1c554e || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/CTAButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function CTAButton({
  variant = 'split',
  children = 'Join us now',
  size = 'md',
  icon,
  href,
  onClick,
  style
}) {
  const S = {
    sm: {
      fs: 14,
      pad: '10px 16px',
      h: 40
    },
    md: {
      fs: 20,
      pad: '14px 22px',
      h: 56
    },
    lg: {
      fs: 32,
      pad: '20px 30px',
      h: 84
    }
  }[size];
  const Tag = href ? 'a' : 'button';
  const reset = {
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    fontFamily: 'var(--font-brand)',
    display: 'inline-flex',
    alignItems: 'stretch',
    padding: 0,
    borderRadius: 'var(--radius-sm)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-soft)',
    transition: 'filter .2s ease-out'
  };
  const hov = {
    onMouseEnter: e => e.currentTarget.style.filter = 'brightness(.96)',
    onMouseLeave: e => e.currentTarget.style.filter = ''
  };
  if (variant === 'split') return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    onClick: onClick
  }, hov, {
    style: {
      ...reset,
      background: 'var(--clarke-offwhite)',
      height: S.h,
      ...style
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: S.pad,
      fontWeight: 700,
      fontSize: S.fs,
      color: 'var(--clarke-green-700)',
      letterSpacing: '-.01em'
    }
  }, children), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: S.h * 1.1,
      background: 'var(--clarke-gray-200)',
      color: 'var(--clarke-green-700)',
      fontSize: S.fs * 1.4,
      fontWeight: 700
    }
  }, "\u2192"));
  if (variant === 'block') return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    onClick: onClick
  }, hov, {
    style: {
      ...reset,
      background: 'var(--clarke-offwhite)',
      height: S.h,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 ' + S.h * 1.4 + 'px',
      fontWeight: 700,
      fontSize: S.fs,
      color: 'var(--clarke-navy-900)',
      ...style
    }
  }), children);
  if (variant === 'apply') return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    onClick: onClick
  }, hov, {
    style: {
      ...reset,
      background: '#fff',
      height: S.h,
      alignItems: 'center',
      ...style
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      alignSelf: 'stretch',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: S.h * 0.18,
      background: 'linear-gradient(90deg,var(--clarke-green-200) 0 60%,transparent 60%)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: S.h * 0.72,
      height: S.h * 0.72,
      borderRadius: '50%',
      background: 'var(--clarke-green-700)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: S.fs * 1.2,
      fontWeight: 400
    }
  }, "+")), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '0 ' + S.h * 0.22 + 'px 0 ' + S.h * 0.2 + 'px',
      fontWeight: 700,
      fontSize: S.fs,
      color: 'var(--clarke-green-500)',
      textTransform: 'uppercase',
      fontFamily: 'var(--font-social)'
    }
  }, children));
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    onClick: onClick
  }, hov, {
    style: {
      ...reset,
      background: 'var(--gradient-purple-green)',
      color: '#fff',
      alignItems: 'center',
      gap: S.fs * 0.6,
      padding: S.pad,
      fontFamily: 'var(--font-social)',
      fontWeight: 700,
      fontSize: S.fs,
      lineHeight: 1.2,
      textAlign: 'left',
      ...style
    }
  }), icon, /*#__PURE__*/React.createElement("span", null, children));
}
Object.assign(__ds_scope, { CTAButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/CTAButton.jsx", error: String((e && e.message) || e) }); }

// components/actions/SwipeArrow.jsx
try { (() => {
function SwipeArrow({
  variant = 'white',
  size = 96,
  style
}) {
  if (variant === 'tab') return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      background: 'var(--clarke-purple-500)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.55,
      fontWeight: 700,
      fontFamily: 'var(--font-brand)',
      ...style
    }
  }, "\u2192");
  const outline = variant === 'green';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: size * 1.6,
      lineHeight: .8,
      fontWeight: 900,
      fontFamily: 'var(--font-brand)',
      color: outline ? 'var(--clarke-green-700)' : '#fff',
      WebkitTextStroke: outline ? size * 0.07 + 'px #fff' : undefined,
      paintOrder: 'stroke fill',
      textShadow: outline ? '0 2px 6px rgba(0,0,0,.2)' : 'none',
      ...style
    }
  }, "\u2192");
}
Object.assign(__ds_scope, { SwipeArrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/SwipeArrow.jsx", error: String((e && e.message) || e) }); }

// components/brand/Eyebrow.jsx
try { (() => {
function Eyebrow({
  children = 'INNOVATE. INSPIRE. IMPACT',
  color = 'var(--clarke-green-500)',
  size = 16,
  align = 'left',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 700,
      fontSize: size,
      letterSpacing: 'var(--tracking-eyebrow)',
      textTransform: 'uppercase',
      color,
      textAlign: align,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/brand/LocationsBar.jsx
try { (() => {
function LocationsBar({
  tone = 'navy',
  showUrl = true,
  url = 'clarkeschools.org',
  align = 'left',
  style
}) {
  const bg = {
    navy: 'var(--clarke-navy-900)',
    purple: 'var(--clarke-purple-800)',
    none: 'transparent'
  }[tone];
  const fg = tone === 'none' ? 'var(--text-body)' : '#fff';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      color: fg,
      fontFamily: 'var(--font-brand)',
      padding: tone === 'none' ? 0 : '14px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      alignItems: align === 'center' ? 'center' : 'flex-start',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 12
    }
  }, "Florida \u2022 Massachusetts \u2022 New York \u2022 Pennsylvania \u2022 Teleservices"), showUrl && /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 500,
      fontSize: 12,
      color: tone === 'none' ? 'var(--clarke-green-500)' : 'var(--clarke-green-300)'
    }
  }, url));
}
Object.assign(__ds_scope, { LocationsBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/LocationsBar.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
const base = p => p.assetBase ?? (typeof window !== 'undefined' && window.CLARKE_ASSET_BASE) ?? 'assets/';
const FILES = {
  lockup: 'clarke-lockup',
  logo: 'clarke-logo',
  blossom: 'clarke-blossom'
};
function Logo(props) {
  const {
    variant = 'lockup',
    tone = 'color',
    height,
    width,
    style,
    alt = 'Clarke Schools for Hearing & Speech'
  } = props;
  const src = variant === 'lockup' ? base(props) + 'logo/official/Clarke-Logo-' + {
    color: 'RGB',
    white: 'WHITE',
    black: 'BLACK'
  }[tone] + '.png' : base(props) + 'logo/' + FILES[variant] + '-' + (tone === 'black' ? 'color' : tone) + '.png';
  return /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      display: 'block',
      height: height,
      width: width ?? (height ? 'auto' : variant === 'blossom' ? 64 : 200),
      ...style
    }
  });
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/content/BoldLabel.jsx
try { (() => {
function BoldLabel({
  label,
  children,
  size = 16,
  color = 'inherit',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-social)',
      fontSize: size,
      lineHeight: 1.2,
      color,
      ...style
    }
  }, /*#__PURE__*/React.createElement("b", null, label, ":"), " ", children);
}
Object.assign(__ds_scope, { BoldLabel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/BoldLabel.jsx", error: String((e && e.message) || e) }); }

// components/content/ExpertCard.jsx
try { (() => {
const base = p => p.assetBase ?? (typeof window !== 'undefined' && window.CLARKE_ASSET_BASE) ?? 'assets/';
function ExpertCard(props) {
  const {
    photo,
    name,
    credential,
    width = 160,
    style
  } = props;
  const b = base(props);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Helvetica, Arial, sans-serif',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: width * 1.18,
      backgroundImage: 'url(' + (photo || '') + '), url(' + b + 'imagery/headshot-green-backdrop.png)',
      backgroundSize: 'cover, 100% 100%',
      backgroundPosition: 'center bottom, center',
      backgroundRepeat: 'no-repeat'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: '0 0 4px 4px',
      padding: '10px 10px 12px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: width * 0.085,
      color: '#111',
      paddingBottom: 6,
      borderBottom: '1px solid #333'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: width * 0.055,
      color: '#333',
      marginTop: 6,
      lineHeight: 1.3
    }
  }, credential)));
}
Object.assign(__ds_scope, { ExpertCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/ExpertCard.jsx", error: String((e && e.message) || e) }); }

// components/content/InfoCard.jsx
try { (() => {
function InfoCard({
  title,
  items = [],
  tint = 'lavender',
  titleColor,
  columns = 1,
  footnote,
  children,
  style
}) {
  const bg = {
    lavender: 'var(--surface-card-lavender)',
    green: 'var(--surface-card-green)',
    gray: 'var(--surface-card-gray)',
    white: '#fff'
  }[tint];
  const tc = titleColor || {
    lavender: 'var(--clarke-purple-700)',
    green: 'var(--clarke-green-500)',
    gray: 'var(--clarke-teal-600)',
    white: 'var(--clarke-navy-900)'
  }[tint];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      borderRadius: 'var(--radius-md)',
      padding: '18px 20px',
      fontFamily: 'var(--font-brand)',
      color: 'var(--text-body)',
      ...style
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 18,
      color: tc,
      marginBottom: 10
    }
  }, title), items.length > 0 && /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      paddingLeft: 16,
      display: 'grid',
      gridTemplateColumns: 'repeat(' + columns + ',1fr)',
      columnGap: 18,
      rowGap: 7,
      fontSize: 11,
      lineHeight: 1.35
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, it))), children, footnote && /*#__PURE__*/React.createElement("div", {
    style: {
      fontStyle: 'italic',
      fontSize: 11,
      marginTop: 14
    }
  }, footnote));
}
Object.assign(__ds_scope, { InfoCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/InfoCard.jsx", error: String((e && e.message) || e) }); }

// components/content/IntroRule.jsx
try { (() => {
function IntroRule({
  lead,
  children,
  ruleColor = 'var(--clarke-teal-600)',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderLeft: '4px solid ' + ruleColor,
      paddingLeft: 14,
      fontFamily: 'var(--font-brand)',
      fontSize: 12,
      lineHeight: 1.4,
      color: 'var(--text-body)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      ...style
    }
  }, React.Children.map(children, (c, i) => /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, i === 0 && lead && /*#__PURE__*/React.createElement("b", null, lead, " "), c)));
}
Object.assign(__ds_scope, { IntroRule });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/IntroRule.jsx", error: String((e && e.message) || e) }); }

// components/content/NumberedItem.jsx
try { (() => {
function NumberedItem({
  n,
  title,
  children,
  dot = 'green',
  style
}) {
  const bg = dot === 'green' ? 'var(--clarke-green-300)' : 'var(--clarke-navy-900)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      fontFamily: 'var(--font-brand)',
      fontSize: 11,
      lineHeight: 1.35,
      color: 'var(--text-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'none',
      width: 30,
      height: 30,
      borderRadius: '50%',
      background: bg,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: 14
    }
  }, n), /*#__PURE__*/React.createElement("div", null, title && /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--clarke-purple-700)'
    }
  }, title), " ", children));
}
Object.assign(__ds_scope, { NumberedItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/NumberedItem.jsx", error: String((e && e.message) || e) }); }

// components/icons/BrandIcon.jsx
try { (() => {
const base = p => p.assetBase ?? (typeof window !== 'undefined' && window.CLARKE_ASSET_BASE) ?? 'assets/';
const ICONS = {
  "community": "09-Community",
  "access": "10-Access",
  "achievement": "11-Achievement",
  "advice": "12-Advice",
  "advocate": "13-Advocate",
  "coaching": "14-Coaching",
  "confidence": "15-Confidence",
  "evaluation": "16-Evaluation",
  "excellence": "17-Excellence",
  "friendship": "18-Friendship",
  "goals": "19-Goals",
  "graduation": "20-Graduation",
  "identity": "21-Identity",
  "job": "22-Job",
  "ourhistory": "23-OurHistory",
  "ourmission": "24-OurMission",
  "ourphilosophy": "25-OurPhilosophy",
  "support": "26-Support",
  "teaching": "27-Teaching",
  "training": "28-Training",
  "leadership": "32-Leadership"
};
const BRAND_ICON_NAMES = Object.keys(ICONS);
function BrandIcon(props) {
  const {
    name = 'community',
    size = 64,
    bg = 'var(--clarke-green-500)',
    shape = 'circle',
    padding = 0.18,
    label,
    style
  } = props;
  const f = ICONS[name];
  const img = /*#__PURE__*/React.createElement("img", {
    src: base(props) + 'icons/brand/ICON-' + f + '.png',
    alt: label || name,
    style: {
      width: '100%',
      height: '100%',
      display: 'block'
    }
  });
  if (bg === 'none') return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      ...style
    }
  }, img);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      background: bg,
      borderRadius: shape === 'circle' ? '50%' : shape === 'rounded' ? 'var(--radius-md)' : 0,
      padding: size * padding,
      boxSizing: 'border-box',
      flex: 'none',
      ...style
    }
  }, img);
}
Object.assign(__ds_scope, { BRAND_ICON_NAMES, BrandIcon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/BrandIcon.jsx", error: String((e && e.message) || e) }); }

// components/icons/SocialIcons.jsx
try { (() => {
const base = p => p.assetBase ?? (typeof window !== 'undefined' && window.CLARKE_ASSET_BASE) ?? 'assets/';
const ALL = ['instagram', 'facebook', 'x', 'linkedin', 'vimeo'];
const URLS = {
  instagram: 'https://clarkeschools.org/instagram',
  facebook: 'https://clarkeschools.org/fb',
  x: 'https://clarkeschools.org/twitter',
  linkedin: 'https://clarkeschools.org/linkedin',
  vimeo: 'https://clarkeschools.org/vimeo'
};
function SocialIcons(props) {
  const {
    networks = ALL,
    size = 32,
    gap,
    color = 'var(--clarke-gray-600)',
    linked = true,
    style
  } = props;
  const b = base(props);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: gap ?? size * 0.3,
      alignItems: 'center',
      ...style
    }
  }, networks.map(n => {
    const dot = /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        backgroundImage: 'url(' + b + 'icons/social/' + n + '-glyph-white.png)',
        backgroundSize: '100% 100%'
      }
    });
    return linked ? /*#__PURE__*/React.createElement("a", {
      key: n,
      href: URLS[n],
      "aria-label": n === 'x' ? 'X' : n,
      style: {
        display: 'block',
        transition: 'opacity .2s'
      },
      onMouseEnter: e => e.currentTarget.style.opacity = .8,
      onMouseLeave: e => e.currentTarget.style.opacity = 1
    }, dot) : /*#__PURE__*/React.createElement("span", {
      key: n,
      "aria-label": n
    }, dot);
  }));
}
Object.assign(__ds_scope, { SocialIcons });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/SocialIcons.jsx", error: String((e && e.message) || e) }); }

// components/labels/HighlightBar.jsx
try { (() => {
function HighlightBar({
  children,
  tone = 'green',
  size = 28,
  fade = false,
  caps = true,
  style
}) {
  const bg = tone === 'green' ? 'var(--clarke-green-500)' : tone === 'navy' ? 'var(--clarke-navy-900)' : 'var(--clarke-purple-800)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block',
      background: fade ? 'linear-gradient(90deg,transparent 0,' + bg + ' 30%)' : bg,
      color: '#fff',
      fontFamily: 'var(--font-brand)',
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.2,
      padding: size * 0.28 + 'px ' + size * 0.6 + 'px',
      borderRadius: 2,
      textTransform: caps ? 'uppercase' : 'none',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { HighlightBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/labels/HighlightBar.jsx", error: String((e && e.message) || e) }); }

// components/labels/SectionPill.jsx
try { (() => {
function SectionPill({
  children,
  tone = 'navy',
  size = 16,
  align = 'center',
  style
}) {
  const bg = tone === 'navy' ? 'var(--clarke-navy-900)' : tone === 'purple' ? 'var(--clarke-purple-800)' : 'var(--clarke-green-500)';
  const r = align === 'left' ? '0 999px 999px 0' : align === 'right' ? '999px 0 0 999px' : '999px';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block',
      background: bg,
      color: '#fff',
      fontFamily: 'var(--font-brand)',
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.15,
      padding: size * 0.4 + 'px ' + size * 0.9 + 'px',
      borderRadius: r,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { SectionPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/labels/SectionPill.jsx", error: String((e && e.message) || e) }); }

// components/labels/TextPlate.jsx
try { (() => {
function TextPlate({
  lines,
  children,
  color = '#fff',
  gradientText = false,
  size = 48,
  weight = 700,
  stepped = false,
  style
}) {
  const L = lines || [children];
  const txt = gradientText ? {
    background: 'linear-gradient(180deg,#E9F6DF 0%,#8CCB6A 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent'
  } : {
    color
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      ...style
    }
  }, L.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: 'var(--clarke-navy-900)',
      borderRadius: 'var(--radius-sm)',
      padding: size * 0.1 + 'px ' + size * 0.3 + 'px',
      marginLeft: stepped ? i * size * 0.12 : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: weight,
      fontSize: size,
      lineHeight: 1.12,
      letterSpacing: '-.01em',
      display: 'block',
      ...txt
    }
  }, l))));
}
Object.assign(__ds_scope, { TextPlate });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/labels/TextPlate.jsx", error: String((e && e.message) || e) }); }

__ds_ns.CTAButton = __ds_scope.CTAButton;

__ds_ns.SwipeArrow = __ds_scope.SwipeArrow;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.LocationsBar = __ds_scope.LocationsBar;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.BoldLabel = __ds_scope.BoldLabel;

__ds_ns.ExpertCard = __ds_scope.ExpertCard;

__ds_ns.InfoCard = __ds_scope.InfoCard;

__ds_ns.IntroRule = __ds_scope.IntroRule;

__ds_ns.NumberedItem = __ds_scope.NumberedItem;

__ds_ns.BRAND_ICON_NAMES = __ds_scope.BRAND_ICON_NAMES;

__ds_ns.BrandIcon = __ds_scope.BrandIcon;

__ds_ns.SocialIcons = __ds_scope.SocialIcons;

__ds_ns.HighlightBar = __ds_scope.HighlightBar;

__ds_ns.SectionPill = __ds_scope.SectionPill;

__ds_ns.TextPlate = __ds_scope.TextPlate;

})();
