// ============================================================
// CONCLAVE — Live Dashboard mockup
// ============================================================

const { useState: useStateD, useEffect: useEffectD, useRef: useRefD, useMemo: useMemoD } = React;

function usePriceSeries(n = 120, base = 67400, vol = 120) {
  const [data, setData] = useStateD(() => {
    let p = base;
    const arr = [];
    for (let i = 0; i < n; i++) {
      p += (Math.random() - 0.5) * vol;
      arr.push(p);
    }
    return arr;
  });
  useEffectD(() => {
    const id = setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1];
        const next = last + (Math.random() - 0.48) * vol;
        return [...prev.slice(1), next];
      });
    }, 800);
    return () => clearInterval(id);
  }, [vol]);
  return data;
}

function PriceChart({ data, decision }) {
  const w = 760, h = 280, pad = 12;
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const scaleX = (i) => pad + (i / (data.length - 1)) * (w - pad * 2);
  const scaleY = (v) => pad + (1 - (v - min) / span) * (h - pad * 2);
  const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i).toFixed(1)} ${scaleY(v).toFixed(1)}`).join(' ');
  const fillPath = `${path} L ${scaleX(data.length - 1).toFixed(1)} ${h - pad} L ${pad} ${h - pad} Z`;
  const last = data[data.length - 1];
  const first = data[0];
  const change = last - first;
  const changePct = (change / first) * 100;

  const color = decision === 'LONG' ? 'var(--green)' : decision === 'SHORT' ? 'var(--red)' : 'var(--ink)';

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" preserveAspectRatio="none" className="chart-svg">
        <defs>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((p, i) => (
          <line key={i} x1={pad} y1={pad + p * (h - pad * 2)} x2={w - pad} y2={pad + p * (h - pad * 2)} stroke="var(--hair)" strokeWidth="0.6" strokeDasharray="2 4"/>
        ))}
        <path d={fillPath} fill="url(#chart-fill)"/>
        <path d={path} fill="none" stroke={color} strokeWidth="1.2"/>
        {/* last dot */}
        <circle cx={scaleX(data.length - 1)} cy={scaleY(last)} r="3" fill={color}/>
        <circle cx={scaleX(data.length - 1)} cy={scaleY(last)} r="6" fill="none" stroke={color} strokeOpacity="0.4">
          <animate attributeName="r" values="3;10;3" dur="1.6s" repeatCount="indefinite"/>
          <animate attributeName="stroke-opacity" values="0.5;0;0.5" dur="1.6s" repeatCount="indefinite"/>
        </circle>
      </svg>
      <div className="chart-meta">
        <div className="cm-pair mono">BTC / USDT</div>
        <div className="cm-price serif">${last.toFixed(0)}</div>
        <div className={`cm-chg mono ${change >= 0 ? 'pos' : 'neg'}`}>
          {change >= 0 ? '+' : ''}{change.toFixed(0)} · {changePct >= 0 ? '+' : ''}{changePct.toFixed(2)}%
        </div>
      </div>
    </div>
  );
}

function VoteBars({ live }) {
  const { tr } = window.useLang();
  return (
    <div className="vote-bars">
      {window.AGENTS.map((a, i) => {
        const v = live.votes[i];
        const cls = v.dir === 'LONG' ? 'long' : v.dir === 'SHORT' ? 'short' : 'skip';
        return (
          <div key={a.id} className={`vote-row vote-${cls}`}>
            <span className="vr-id mono">{a.id}</span>
            <span className="vr-name small">{tr(a.name)}</span>
            <span className="vr-bar"><span className="vr-fill" style={{ width: `${v.conf}%` }}></span></span>
            <span className="vr-dir mono">{v.dir}</span>
            <span className="vr-conf mono">{v.conf}%</span>
          </div>
        );
      })}
    </div>
  );
}

function TradeLog() {
  const baseLog = useMemoD(() => ([
    { time: '14:32:18', pair: 'BTC/USDT',  dir: 'LONG',  conf: 84, pnl: '+1.42%' },
    { time: '14:18:02', pair: 'AVAX/USDT', dir: 'LONG',  conf: 68, pnl: '+0.71%' },
    { time: '13:51:44', pair: 'ETH/USDT',  dir: 'SKIP',  conf: 41, pnl: '—'      },
    { time: '13:22:09', pair: 'SOL/USDT',  dir: 'SHORT', conf: 71, pnl: '+0.96%' },
    { time: '12:48:33', pair: 'TIA/USDT',  dir: 'LONG',  conf: 76, pnl: '+2.18%' },
    { time: '12:11:50', pair: 'ARB/USDT',  dir: 'LONG',  conf: 62, pnl: '−0.34%' },
    { time: '11:39:05', pair: 'DOGE/USDT', dir: 'SHORT', conf: 58, pnl: '+0.52%' },
  ]), []);
  return (
    <div className="trade-log">
      <div className="tl-head mono small">
        <span>TIME</span><span>PAIR</span><span>DIR</span><span>CONF</span><span>P&L</span>
      </div>
      {baseLog.map((r, i) => (
        <div key={i} className={`tl-row mono dir-${r.dir.toLowerCase()}`}>
          <span>{r.time}</span>
          <span>{r.pair}</span>
          <span>{r.dir}</span>
          <span>{r.conf}%</span>
          <span>{r.pnl}</span>
        </div>
      ))}
    </div>
  );
}

function DashboardSection() {
  const { t } = window.useLang();
  const live = window.useLiveCouncil(3);
  const data = usePriceSeries();

  return (
    <section id="dashboard" className="section section-dash">
      <div className="page">
        <div className="rule"></div>
        <div className="sec-head">
          <div className="eyebrow">{t('dash_eyebrow')}</div>
          <h2 className="h2" style={{ marginTop: 12 }}>{t('dash_h')}</h2>
          <p className="lede" style={{ marginTop: 16, maxWidth: 620 }}>{t('dash_lede')}</p>
        </div>

        <div className="dashboard">
          <div className="dash-chrome">
            <div className="dc-left mono">
              <span className="dc-dot dc-dot-r"></span>
              <span className="dc-dot dc-dot-y"></span>
              <span className="dc-dot dc-dot-g"></span>
              <span className="dc-title">conclave / terminal · v0.4.2</span>
            </div>
            <div className="dc-right mono small">● LIVE · paper-trading mode</div>
          </div>

          <div className="dash-grid">
            <div className="dash-chart-cell">
              <PriceChart data={data} decision={live.verdict}/>
            </div>

            <div className="dash-verdict-cell">
              <div className="dv-eyebrow mono small">{t('verdict')}</div>
              <div className={`dv-decision serif dv-${live.verdict.toLowerCase()}`}>{live.verdict}</div>
              <div className="dv-conf">
                <div className="dv-conf-bar"><div className="dv-conf-fill" style={{ width: `${live.conf}%`, background: live.verdict === 'LONG' ? 'var(--green)' : live.verdict === 'SHORT' ? 'var(--red)' : 'var(--ink-3)' }}></div></div>
                <div className="dv-conf-label mono small">{live.conf}% {t('confidence')}</div>
              </div>
              <div className="dv-split">
                <div><span className="mono dim small">L</span> <span className="mono">{Math.round(live.longPct * 100)}%</span></div>
                <div><span className="mono dim small">S</span> <span className="mono">{Math.round(live.shortPct * 100)}%</span></div>
                <div><span className="mono dim small">∅</span> <span className="mono">{Math.round(live.skipPct * 100)}%</span></div>
              </div>
            </div>

            <div className="dash-votes-cell">
              <div className="dv-eyebrow mono small">COUNCIL VOTES</div>
              <VoteBars live={live} />
            </div>

            <div className="dash-log-cell">
              <div className="dv-eyebrow mono small">RECENT DECISIONS</div>
              <TradeLog />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { DashboardSection });
