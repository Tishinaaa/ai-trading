// ============================================================
// CONCLAVE — Problem, Method (4 steps), Advantages, Stack
// ============================================================

function ProblemSection() {
  const { t, lang } = window.useLang();
  return (
    <section id="manifesto" className="section section-problem dark-section">
      <div className="page">
        <div className="rule rule-dark"></div>
        <div className="sec-head">
          <div className="eyebrow eyebrow-dark">{t('problem_eyebrow')}</div>
        </div>
        <div className="problem-grid">
          <h2 className="h2 problem-h">{t('problem_h')}</h2>
          <div className="problem-body">
            <p className="lede lede-dark" style={{ marginBottom: 18 }}>{t('problem_body_1')}</p>
            <p className="body body-dark">{t('problem_body_2')}</p>
          </div>
        </div>
        <figure className="pull-quote pull-quote-dark">
          <span className="pq-mark serif">"</span>
          <blockquote className="serif pq-text">{t('problem_pull')}</blockquote>
          <figcaption className="pq-cite mono small">
            {lang === 'ru' ? '— Манифест Conclave, §1' : '— Conclave Manifesto, §1'}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function MethodSection() {
  const { t, tr } = window.useLang();
  return (
    <section id="method" className="section section-method">
      <div className="page">
        <div className="rule"></div>
        <div className="sec-head">
          <div className="eyebrow">{t('method_eyebrow')}</div>
          <h2 className="h2" style={{ marginTop: 12 }}>{t('method_h')}</h2>
        </div>
        <div className="steps">
          {window.STEPS.map((s, i) => (
            <article key={s.n} className="step">
              <div className="step-n mono">{s.n}</div>
              <div className="step-body">
                <h3 className="step-title serif">{tr(s.title)}</h3>
                <p className="body">{tr(s.body)}</p>
              </div>
              <div className="step-deco" aria-hidden="true">
                {i === 0 && <DecoStream />}
                {i === 1 && <DecoFan />}
                {i === 2 && <DecoScales />}
                {i === 3 && <DecoTarget />}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DecoStream() {
  return (
    <svg viewBox="0 0 100 60" width="100%" height="100%">
      <g stroke="var(--ink)" strokeWidth="0.6" fill="none">
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={i} d={`M0 ${5 + i * 4} Q25 ${4 + i * 4 + Math.sin(i)*3} 50 ${5 + i * 4} T100 ${5 + i * 4}`} opacity={0.2 + (i % 3) * 0.2}/>
        ))}
      </g>
      <circle cx="50" cy="30" r="2.5" fill="var(--orange)"/>
    </svg>
  );
}

function DecoFan() {
  return (
    <svg viewBox="0 0 100 60" width="100%" height="100%">
      <g stroke="var(--ink)" strokeWidth="0.6">
        {[-30,-20,-10,0,10,20,30].map((a, i) => (
          <line key={i} x1="50" y1="55" x2={50 + Math.sin(a*Math.PI/180)*55} y2={55 - Math.cos(a*Math.PI/180)*55} opacity={i === 3 ? 1 : 0.35}/>
        ))}
      </g>
      {[-30,-20,-10,0,10,20,30].map((a, i) => (
        <circle key={i} cx={50 + Math.sin(a*Math.PI/180)*48} cy={55 - Math.cos(a*Math.PI/180)*48} r="2" fill={i === 3 ? 'var(--orange)' : 'var(--ink)'}/>
      ))}
    </svg>
  );
}

function DecoScales() {
  return (
    <svg viewBox="0 0 100 60" width="100%" height="100%">
      <g stroke="var(--ink)" strokeWidth="0.8" fill="none">
        <line x1="50" y1="6" x2="50" y2="40"/>
        <line x1="20" y1="40" x2="80" y2="40"/>
        <line x1="20" y1="40" x2="20" y2="50"/>
        <line x1="80" y1="40" x2="80" y2="50"/>
        <ellipse cx="20" cy="52" rx="14" ry="3"/>
        <ellipse cx="80" cy="52" rx="14" ry="3" stroke="var(--orange)"/>
      </g>
      <text x="50" y="14" textAnchor="middle" fontFamily="var(--mono)" fontSize="6" fill="var(--ink-3)">Σw·v</text>
    </svg>
  );
}

function DecoTarget() {
  return (
    <svg viewBox="0 0 100 60" width="100%" height="100%">
      <g fill="none" stroke="var(--ink)" strokeWidth="0.6">
        <circle cx="50" cy="30" r="22"/>
        <circle cx="50" cy="30" r="14"/>
        <circle cx="50" cy="30" r="6"/>
      </g>
      <circle cx="50" cy="30" r="2.5" fill="var(--orange)"/>
      <line x1="20" y1="55" x2="50" y2="30" stroke="var(--orange)" strokeWidth="0.8"/>
    </svg>
  );
}

function AdvantagesSection() {
  const { t, tr } = window.useLang();
  return (
    <section id="advantages" className="section section-adv">
      <div className="page">
        <div className="rule"></div>
        <div className="sec-head">
          <div className="eyebrow">{t('advantages_eyebrow')}</div>
          <h2 className="h2" style={{ marginTop: 12, maxWidth: 880 }}>{t('advantages_h')}</h2>
        </div>
        <div className="adv-grid">
          {window.ADVANTAGES.map((a) => (
            <article key={a.n} className="adv-card">
              <div className="adv-n serif">{a.n}.</div>
              <h3 className="adv-t serif">{tr(a.t)}</h3>
              <p className="body">{tr(a.b)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StackSection() {
  const { t } = window.useLang();
  return (
    <section id="stack" className="section section-stack">
      <div className="page">
        <div className="rule"></div>
        <div className="sec-head">
          <div className="eyebrow">{t('stack_eyebrow')}</div>
        </div>
        <div className="stack-grid">
          <div>
            <h2 className="h2">{t('stack_h')}</h2>
            <p className="lede" style={{ marginTop: 22, maxWidth: 520 }}>{t('stack_body')}</p>
          </div>
          <div className="stack-tags">
            {window.STACK.map((s, i) => (
              <span key={i} className="stack-tag mono">
                <span className="stack-tag-n">{String(i + 1).padStart(2, '0')}</span>
                <span>{s}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ProblemSection, MethodSection, AdvantagesSection, StackSection });
