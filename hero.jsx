// ============================================================
// CONCLAVE — Masthead, Hero, Ticker
// ============================================================

const { useState: useStateA, useEffect: useEffectA, useRef: useRefA } = React;

// ── Masthead (top bar mimicking a newspaper masthead) ────────
function Masthead() {
  const { lang, setLang, t } = window.useLang();
  return (
    <header className="masthead">
      <div className="page masthead-row">
        <div className="masthead-left mono small">
          <span>{t('issue')}</span>
          <span className="dim">·</span>
          <span>{t('edition')}</span>
        </div>
        <a href="#top" className="masthead-logo serif">Conclave<span className="logo-dot">.</span></a>
        <div className="masthead-right">
          <nav className="masthead-nav">
            <a href="#manifesto">{t('nav_manifesto')}</a>
            <a href="#council">{t('nav_council')}</a>
            <a href="#method">{t('nav_method')}</a>
            <a href="#dashboard">{t('nav_dashboard')}</a>
            <a href="#roadmap">{t('nav_roadmap')}</a>
          </nav>
          <div className="lang-switch mono">
            <button className={lang === 'ru' ? 'on' : ''} onClick={() => setLang('ru')}>RU</button>
            <span>/</span>
            <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
          </div>
        </div>
      </div>
      <div className="rule"></div>
    </header>
  );
}

// ── Live ticker (verdicts marquee) ───────────────────────────
function VerdictTicker() {
  const { tr, t } = window.useLang();
  const items = [...window.VERDICTS, ...window.VERDICTS];
  return (
    <div className="marquee" aria-label="Live verdicts">
      <div className="marquee-track">
        {items.map((v, i) => (
          <span key={i} className="marquee-item">
            <span className="m-pair">{v.pair}</span>
            <span className={`m-dir m-${v.dir.toLowerCase()}`}>{t(v.dir.toLowerCase())}</span>
            <span className="m-conf">· {v.conf}%</span>
            <span className="m-note">— {tr(v.note)}</span>
            <span className="m-aster">✱</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Tiny inline sparkline for hero stat ──────────────────────
function Spark({ data, color = 'currentColor' }) {
  const w = 80, h = 24;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="spark">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.2"/>
    </svg>
  );
}

// ── Hero ─────────────────────────────────────────────────────
function Hero({ bgStyle }) {
  const { t, tr, lang } = window.useLang();
  const reveal = window.useReveal();
  const [agents, agentsRef] = window.useCount(7, 900);
  const [signals, signalsRef] = window.useCount(2840, 1600);
  const [acc, accRef] = window.useCount(73.4, 1600);
  const [skip, skipRef] = window.useCount(38, 1400);
  const today = new Date();
  const dateStr = today.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <section id="top" className="hero">
      <HeroBackground style={bgStyle} />
      <div className="page hero-inner">
        <div className="hero-eyebrow eyebrow"><span className="dot"></span>{t('eyebrow_live')}</div>
        <h1 className="h1 hero-h1" ref={reveal}>
          {t('hero_h1_a')}<em>{t('hero_h1_em')}</em>{t('hero_h1_b')}
        </h1>
        <div className="hero-grid">
          <div className="hero-lede-col">
            <p className="lede hero-lede">{t('hero_lede')}</p>
            <div className="hero-cta">
              <a className="btn" href="#cta">
                {t('hero_cta_1')} <span className="arrow">→</span>
              </a>
              <a className="btn btn-ghost" href="#dashboard">
                {t('hero_cta_2')} <span className="arrow">→</span>
              </a>
            </div>
          </div>
          <aside className="hero-meta">
            <div className="hm-eyebrow mono small">{lang === 'ru' ? '— ВЫХОДНЫЕ ДАННЫЕ —' : '— COLOPHON —'}</div>
            <dl className="hm-list">
              <div className="hm-row"><dt>{lang === 'ru' ? 'Дата' : 'Date'}</dt><dd>{dateStr}</dd></div>
              <div className="hm-row"><dt>{lang === 'ru' ? 'Состав' : 'Composition'}</dt><dd>7 × LLM · 1 × Supervisor</dd></div>
              <div className="hm-row"><dt>{lang === 'ru' ? 'Биржи' : 'Venues'}</dt><dd>Binance · Bybit · OKX</dd></div>
              <div className="hm-row"><dt>{lang === 'ru' ? 'Стадия' : 'Stage'}</dt><dd>Closed alpha · Q1 2026</dd></div>
              <div className="hm-row"><dt>{lang === 'ru' ? 'Тираж' : 'Print run'}</dt><dd>100 / {lang === 'ru' ? 'мест' : 'seats'}</dd></div>
            </dl>
          </aside>
        </div>
      </div>

      <div className="page hero-stats">
        <div className="stat" ref={agentsRef}>
          <div className="stat-num serif">{Math.round(agents)}</div>
          <div className="stat-lbl small">{t('stat_agents')}</div>
        </div>
        <div className="stat" ref={signalsRef}>
          <div className="stat-num serif">{Math.round(signals).toLocaleString()}</div>
          <div className="stat-lbl small">{t('stat_signals')}</div>
        </div>
        <div className="stat" ref={accRef}>
          <div className="stat-num serif">{acc.toFixed(1)}<span className="stat-unit">%</span></div>
          <div className="stat-lbl small">{t('stat_accuracy')}</div>
          <Spark data={[60,62,58,65,68,66,70,72,69,73]} color="var(--orange)" />
        </div>
        <div className="stat" ref={skipRef}>
          <div className="stat-num serif">{Math.round(skip)}<span className="stat-unit">%</span></div>
          <div className="stat-lbl small">{t('stat_skip')}</div>
        </div>
      </div>
    </section>
  );
}

// ── Hero animated background (canvas — neural net particles) ─
function HeroBackground({ style }) {
  const ref = useRefA(null);
  useEffectA(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes = [];

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(80, Math.round((r.width * r.height) / 8000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * r.width,
        y: Math.random() * r.height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.8 + 0.8,
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    const cs = getComputedStyle(document.documentElement);
    const ink = cs.getPropertyValue('--ink').trim() || '#14130F';
    const orange = cs.getPropertyValue('--orange').trim() || '#E04E1B';

    const tick = () => {
      const r = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);

      const linkDist = 140;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > r.width) a.vx *= -1;
        if (a.y < 0 || a.y > r.height) a.vy *= -1;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < linkDist) {
            const op = (1 - d / linkDist) * 0.36;
            ctx.strokeStyle = `rgba(20,19,15,${op})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      nodes.forEach((n, i) => {
        ctx.fillStyle = i % 9 === 0 ? orange : ink;
        ctx.globalAlpha = i % 9 === 0 ? 0.75 : 0.6;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [style]);

  if (style === 'grid') {
    return <div className="hero-bg hero-bg-grid" />;
  }
  if (style === 'orbits') {
    return (
      <svg className="hero-bg hero-bg-orbits" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="var(--ink)" strokeOpacity="0.18" strokeWidth="0.6">
          <circle cx="780" cy="340" r="120"/>
          <circle cx="780" cy="340" r="200"/>
          <circle cx="780" cy="340" r="280"/>
          <circle cx="780" cy="340" r="360"/>
        </g>
        <g fill="var(--ink)">
          <circle cx="780" cy="340" r="3"/>
          <circle cx="900" cy="340" r="2.4"/>
          <circle cx="588" cy="240" r="2.2"/>
          <circle cx="608" cy="430" r="2"/>
        </g>
        <circle cx="780" cy="340" r="6" fill="var(--orange)"/>
      </svg>
    );
  }
  return <canvas ref={ref} className="hero-bg" />;
}

Object.assign(window, { Masthead, Hero, VerdictTicker, Spark });
