// ============================================================
// CONCLAVE — Council (hybrid: ring + live votes + verdict)
// ============================================================

const { useState: useStateC, useEffect: useEffectC, useRef: useRefC } = React;

function CouncilDiagram() {
  const { tr, t } = window.useLang();
  const live = window.useLiveCouncil(7);
  const [hover, setHover] = useStateC(null);

  const cx = 300, cy = 300, R = 230;
  const N = window.AGENTS.length;

  return (
    <div className="council-wrap">
      <div className="council-stage">
        <svg viewBox="0 0 600 600" className="council-svg" aria-hidden="true">
          <defs>
            <radialGradient id="cog-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--orange)" stopOpacity="0.35"/>
              <stop offset="60%" stopColor="var(--orange)" stopOpacity="0.08"/>
              <stop offset="100%" stopColor="var(--orange)" stopOpacity="0"/>
            </radialGradient>
          </defs>

          {/* Outer ring */}
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--hair)" strokeWidth="1" strokeDasharray="2 6"/>
          <circle cx={cx} cy={cy} r={R - 36} fill="none" stroke="var(--hair)" strokeWidth="0.5"/>

          {/* Center halo */}
          <circle cx={cx} cy={cy} r="92" fill="url(#cog-grad)"/>

          {/* Lines from each agent to center */}
          {window.AGENTS.map((a, i) => {
            const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
            const x = cx + Math.cos(angle) * R;
            const y = cy + Math.sin(angle) * R;
            const v = live.votes[i];
            const colorVar = v.dir === 'LONG' ? 'var(--green)' : v.dir === 'SHORT' ? 'var(--red)' : 'var(--ink-3)';
            const op = 0.18 + (v.conf / 100) * 0.55;
            return (
              <g key={a.id}>
                <line x1={x} y1={y} x2={cx} y2={cy} stroke={colorVar} strokeOpacity={op} strokeWidth="0.8"/>
                <circle r="2.4" fill={colorVar}>
                  <animateMotion dur={`${2.4 + (i % 3) * 0.7}s`} repeatCount="indefinite" path={`M${x},${y} L${cx},${cy}`}/>
                </circle>
              </g>
            );
          })}

          {/* Agents */}
          {window.AGENTS.map((a, i) => {
            const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
            const x = cx + Math.cos(angle) * R;
            const y = cy + Math.sin(angle) * R;
            const v = live.votes[i];
            const isHover = hover === a.id;
            const ring = v.dir === 'LONG' ? 'var(--green)' : v.dir === 'SHORT' ? 'var(--red)' : 'var(--ink-3)';
            return (
              <g key={a.id}
                 transform={`translate(${x} ${y})`}
                 onMouseEnter={() => setHover(a.id)}
                 onMouseLeave={() => setHover(null)}
                 className="agent-node"
                 style={{ cursor: 'pointer' }}>
                <circle r="34" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1"/>
                <circle r="34" fill="none" stroke={ring} strokeWidth="2" strokeOpacity={isHover ? 1 : 0.7}>
                  <animate attributeName="r" values="34;36;34" dur="2.4s" repeatCount="indefinite"/>
                </circle>
                <text textAnchor="middle" y="-3" fontFamily="var(--serif)" fontSize="20" fill="var(--ink)">{a.glyph}</text>
                <text textAnchor="middle" y="11" fontFamily="var(--mono)" fontSize="7.5" fill="var(--ink-3)" letterSpacing="0.1em">{a.id}</text>
                {/* live vote badge */}
                <g transform="translate(0 50)">
                  <rect x="-26" y="-9" width="52" height="18" fill="var(--paper)" stroke={ring} strokeWidth="0.8"/>
                  <text textAnchor="middle" y="3.5" fontFamily="var(--mono)" fontSize="8.5" fill={ring} letterSpacing="0.1em">{v.dir} {v.conf}%</text>
                </g>
              </g>
            );
          })}

          {/* Center supervisor */}
          <g transform={`translate(${cx} ${cy})`}>
            <circle r="68" fill="var(--ink)"/>
            <circle r="68" fill="none" stroke="var(--orange)" strokeWidth="1.5">
              <animate attributeName="r" values="68;74;68" dur="3s" repeatCount="indefinite"/>
              <animate attributeName="stroke-opacity" values="1;0.2;1" dur="3s" repeatCount="indefinite"/>
            </circle>
            <text textAnchor="middle" y="-8" fontFamily="var(--serif)" fontSize="14" fontStyle="italic" fill="var(--paper)">Supervisor</text>
            <text textAnchor="middle" y="14" fontFamily="var(--mono)" fontSize="22" fill={live.verdict === 'LONG' ? '#7ED99A' : live.verdict === 'SHORT' ? '#FF8B7A' : 'var(--paper)'} letterSpacing="0.08em">{live.verdict}</text>
            <text textAnchor="middle" y="32" fontFamily="var(--mono)" fontSize="9" fill="rgba(241,236,224,0.55)" letterSpacing="0.1em">{live.conf}% · {t('confidence').toUpperCase()}</text>
          </g>
        </svg>

        {/* Hover detail */}
        <div className={`agent-detail ${hover ? 'show' : ''}`}>
          {hover && (() => {
            const a = window.AGENTS.find((x) => x.id === hover);
            const v = live.votes.find((x) => x.id === hover);
            return (
              <div>
                <div className="ad-eyebrow mono small">AGENT · {a.id}</div>
                <div className="ad-name serif h3">{tr(a.name)}</div>
                <div className="ad-full small">{tr(a.full)}</div>
                <div className="ad-meta">
                  <div><span className="dim small">{t('weight')}</span> <span className="mono">{(a.weight * 100).toFixed(0)}%</span></div>
                  <div><span className="dim small">{t('accuracy')}</span> <span className="mono">{(a.accuracy * 100).toFixed(0)}%</span></div>
                  <div><span className="dim small">vote</span> <span className={`mono dir-${v.dir.toLowerCase()}`}>{v.dir} · {v.conf}%</span></div>
                </div>
              </div>
            );
          })()}
          {!hover && (
            <div className="ad-hint small dim">
              ▸ {t('confidence') === 'confidence' ? 'Hover an agent to inspect.' : 'Наведите на агента, чтобы рассмотреть.'}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="council-legend">
        <span className="lg-item"><span className="lg-dot" style={{background:'var(--green)'}}></span><span className="mono small">{t('council_legend_long')}</span></span>
        <span className="lg-item"><span className="lg-dot" style={{background:'var(--red)'}}></span><span className="mono small">{t('council_legend_short')}</span></span>
        <span className="lg-item"><span className="lg-dot" style={{background:'var(--ink-3)'}}></span><span className="mono small">{t('council_legend_skip')}</span></span>
      </div>
    </div>
  );
}

// ── Council section ──────────────────────────────────────────
function CouncilSection() {
  const { t } = window.useLang();
  return (
    <section id="council" className="section section-council">
      <div className="page">
        <div className="rule"></div>
        <div className="sec-head">
          <div className="eyebrow">{t('council_eyebrow')}</div>
        </div>
        <div className="council-grid">
          <div className="council-copy">
            <h2 className="h2">{t('council_h')}</h2>
            <p className="lede" style={{ marginTop: 24, maxWidth: 480 }}>{t('council_lede')}</p>
          </div>
          <CouncilDiagram />
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { CouncilSection, CouncilDiagram });
