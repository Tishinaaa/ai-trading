// ============================================================
// CONCLAVE — Hooks: language, reveal-on-scroll, live verdicts
// ============================================================

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// Bilingual context (simplified — global state via window)
window.useLang = function () {
  const [lang, setLangState] = useState(() => window.__lang || 'ru');
  useEffect(() => {
    const onChange = (e) => setLangState(e.detail);
    window.addEventListener('langchange', onChange);
    return () => window.removeEventListener('langchange', onChange);
  }, []);
  const setLang = useCallback((l) => {
    window.__lang = l;
    window.dispatchEvent(new CustomEvent('langchange', { detail: l }));
  }, []);
  const t = useCallback((key) => (window.COPY[lang] && window.COPY[lang][key]) || key, [lang]);
  const tr = useCallback((obj) => (obj && obj[lang]) || (obj && obj.en) || '', [lang]);
  return { lang, setLang, t, tr };
};

// Reveal on scroll
window.useReveal = function () {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
};

// Live verdicts — agents shuffle their votes every few seconds
window.useLiveCouncil = function (seed = 0) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((x) => x + 1), 2400);
    return () => clearInterval(id);
  }, []);

  return useMemo(() => {
    const r = (i) => {
      const x = Math.sin((tick + 1) * 9.7 + i * 12.3 + seed) * 10000;
      return x - Math.floor(x);
    };
    const votes = window.AGENTS.map((a, i) => {
      const v = r(i);
      const dir = v < 0.55 ? 'LONG' : v < 0.78 ? 'SHORT' : 'SKIP';
      const conf = Math.round(40 + r(i + 30) * 55);
      return { id: a.id, dir, conf, weight: a.weight };
    });
    let long = 0, short = 0, skip = 0;
    votes.forEach((v) => {
      const w = v.weight * (v.conf / 100);
      if (v.dir === 'LONG') long += w;
      else if (v.dir === 'SHORT') short += w;
      else skip += w;
    });
    const total = long + short + skip || 1;
    const longPct = long / total;
    const shortPct = short / total;
    const skipPct = skip / total;
    let verdict = 'SKIP';
    let conf = Math.round(skipPct * 100);
    if (longPct > 0.5 && longPct > shortPct + 0.12) { verdict = 'LONG'; conf = Math.round(longPct * 100); }
    else if (shortPct > 0.5 && shortPct > longPct + 0.12) { verdict = 'SHORT'; conf = Math.round(shortPct * 100); }
    else { verdict = 'SKIP'; conf = Math.round(Math.max(longPct, shortPct, skipPct) * 100); }
    return { tick, votes, verdict, conf, longPct, shortPct, skipPct };
  }, [tick, seed]);
};

// Animated number counter — runs immediately if already in viewport
window.useCount = function (target, duration = 1400, start = 0) {
  const [value, setValue] = useState(start);
  const ref = useRef(null);
  const ranRef = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || ranRef.current) return;
    const run = () => {
      if (ranRef.current) return;
      ranRef.current = true;
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(start + (target - start) * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    // Already visible? run immediately.
    const r = el.getBoundingClientRect();
    const inView = r.top < window.innerHeight && r.bottom > 0;
    if (inView) { run(); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { run(); io.disconnect(); } });
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration, start]);
  return [value, ref];
};
