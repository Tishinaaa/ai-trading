// ============================================================
// CONCLAVE — Roadmap, FAQ, CTA, Footer
// ============================================================

const { useState: useStateF } = React;

function RoadmapSection() {
  const { t, tr } = window.useLang();
  return (
    <section id="roadmap" className="section section-roadmap">
      <div className="page">
        <div className="rule"></div>
        <div className="sec-head">
          <div className="eyebrow">{t('roadmap_eyebrow')}</div>
          <h2 className="h2" style={{ marginTop: 12 }}>{t('roadmap_h')}</h2>
        </div>
        <div className="timeline">
          <div className="tl-spine"></div>
          {window.ROADMAP.map((r, i) => (
            <article key={i} className="tl-item">
              <div className="tl-marker">
                <div className="tl-circle"></div>
              </div>
              <div className="tl-content">
                <div className="tl-q mono">{r.q}</div>
                <h3 className="tl-t serif">{tr(r.t)}</h3>
                <p className="body tl-b">{tr(r.b)}</p>
                <div className={`tl-status mono small ${i === 0 ? 'tl-active' : ''}`}>
                  <span className="tl-status-dot"></span> {tr(r.s)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const { t, tr } = window.useLang();
  const [open, setOpen] = useStateF(0);
  return (
    <section id="faq" className="section section-faq">
      <div className="page">
        <div className="rule"></div>
        <div className="sec-head">
          <div className="eyebrow">{t('faq_eyebrow')}</div>
          <h2 className="h2" style={{ marginTop: 12 }}>{t('faq_h')}</h2>
        </div>
        <div className="faq-list">
          {window.FAQ.map((f, i) => (
            <div key={i} className={`faq-item ${open === i ? 'faq-open' : ''}`}>
              <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                <span className="faq-n mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="faq-q-text serif">{tr(f.q)}</span>
                <span className="faq-toggle mono">{open === i ? '−' : '+'}</span>
              </button>
              <div className="faq-a">
                <p className="body">{tr(f.a)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { t, lang } = window.useLang();
  const [submitted, setSubmitted] = useStateF(false);
  const [email, setEmail] = useStateF('');
  const [tg, setTg] = useStateF('');

  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  const seatsTaken = 73;
  const seatsTotal = 100;
  const seatsLeft = seatsTotal - seatsTaken;

  return (
    <section id="cta" className="section section-cta">
      <div className="page">
        <div className="rule"></div>
        <div className="cta-eyebrow-row">
          <span className="eyebrow">{t('cta_eyebrow')}</span>
          <span className="eyebrow eyebrow-orange">
            <span className="dot"></span>
            {lang === 'ru' ? `Осталось мест: ${seatsLeft} / ${seatsTotal}` : `Seats left: ${seatsLeft} / ${seatsTotal}`}
          </span>
        </div>
        <div className="cta-grid">
          <div className="cta-copy">
            <h2 className="h2 cta-h">{t('cta_h')}</h2>
            <p className="lede cta-lede">{t('cta_body')}</p>
            <div className="cta-progress">
              <div className="cta-progress-bar">
                <div className="cta-progress-fill" style={{ width: `${(seatsTaken / seatsTotal) * 100}%` }}></div>
              </div>
              <div className="cta-progress-meta">
                <span className="mono small">
                  <span className="cta-progress-num serif">{String(seatsTaken).padStart(3, '0')}</span>
                  <span className="dim"> / {seatsTotal} {lang === 'ru' ? 'занято' : 'taken'}</span>
                </span>
                <span className="mono small dim">
                  · {seatsLeft} {lang === 'ru' ? 'осталось' : 'remaining'}
                </span>
              </div>
            </div>
          </div>
          {!submitted ? (
            <form className="cta-form" onSubmit={submit}>
              <label className="form-row">
                <span className="form-lbl mono small">{t('cta_email')}*</span>
                <input className="form-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"/>
              </label>
              <label className="form-row">
                <span className="form-lbl mono small">{t('cta_tg')}</span>
                <input className="form-input" type="text" value={tg} onChange={(e) => setTg(e.target.value)} placeholder="@handle"/>
              </label>
              <button className="btn cta-btn" type="submit">{t('cta_btn')} <span className="arrow">→</span></button>
              <p className="small dim" style={{ marginTop: 12 }}>{t('cta_micro')}</p>
            </form>
          ) : (
            <div className="cta-success">
              <div className="serif cta-success-mark">✱</div>
              <h3 className="serif cta-success-h">
                {lang === 'ru' ? 'Заявка принята.' : "You're on the list."}
              </h3>
              <p className="body" style={{ marginTop: 12, maxWidth: 360 }}>
                {lang === 'ru' ? 'Мы вернёмся с приглашением, как только в созыве освободится место.' : "We'll be in touch with an invite once a seat opens up in the convocation."}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { t, lang } = window.useLang();
  return (
    <footer className="footer dark-section">
      <div className="page">
        <div className="footer-disclaimer-block">
          <div className="footer-disc-head">
            <span className="footer-warn">⚠</span>
            <span className="eyebrow eyebrow-orange">{t('foot_disclaimer_t')}</span>
          </div>
          <p className="serif footer-disc-text">{t('foot_disclaimer')}</p>
        </div>

        <div className="footer-mid">
          <div className="footer-mast-col">
            <div className="footer-mast serif">Conclave<span className="logo-dot">.</span></div>
            <p className="small footer-tagline">
              {lang === 'ru' ? 'Совет ИИ, который не торопится ошибаться.' : "An AI council that takes its time before it's wrong."}
            </p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <div className="footer-col-h mono small">{lang === 'ru' ? 'Продукт' : 'Product'}</div>
              <a href="#manifesto">{lang === 'ru' ? 'Манифест' : 'Manifesto'}</a>
              <a href="#council">{lang === 'ru' ? 'Совет' : 'Council'}</a>
              <a href="#dashboard">{lang === 'ru' ? 'Терминал' : 'Terminal'}</a>
              <a href="#roadmap">{lang === 'ru' ? 'План' : 'Roadmap'}</a>
            </div>
            <div className="footer-col">
              <div className="footer-col-h mono small">{lang === 'ru' ? 'Документы' : 'Resources'}</div>
              <a href="#">{lang === 'ru' ? 'Документация' : 'Docs'}</a>
              <a href="#">Whitepaper</a>
              <a href="#">{lang === 'ru' ? 'Бэктест-отчёты' : 'Backtest reports'}</a>
              <a href="#">Changelog</a>
            </div>
            <div className="footer-col">
              <div className="footer-col-h mono small">{lang === 'ru' ? 'Сообщество' : 'Community'}</div>
              <a href="#">Telegram</a>
              <a href="#">X / Twitter</a>
              <a href="#">Discord</a>
              <a href="#">GitHub</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="small footer-copy">{t('foot_copy')}</div>
          <div className="small footer-legal">
            <a href="#">{lang === 'ru' ? 'Условия' : 'Terms'}</a>
            <a href="#">{lang === 'ru' ? 'Конфиденциальность' : 'Privacy'}</a>
            <a href="#">{lang === 'ru' ? 'Раскрытие рисков' : 'Risk disclosure'}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { RoadmapSection, FAQSection, CTASection, Footer });
