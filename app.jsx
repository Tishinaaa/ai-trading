// ============================================================
// CONCLAVE — App root
// ============================================================

const TWEAK_DEFAULTS = {
  palette: 'editorial',
  heroBg: 'neural',
  showTicker: true,
};

function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    if (t.palette === 'ink') document.documentElement.setAttribute('data-theme', 'ink');
    else document.documentElement.removeAttribute('data-theme');
  }, [t.palette]);

  return (
    <div className="app">
      <window.Masthead />
      <window.Hero bgStyle={t.heroBg} />
      {t.showTicker && <window.VerdictTicker />}
      <window.ProblemSection />
      <window.CouncilSection />
      <window.MethodSection />
      <window.AdvantagesSection />
      <window.StackSection />
      <window.DashboardSection />
      <window.RoadmapSection />
      <window.FAQSection />
      <window.CTASection />
      <window.Footer />

      <window.TweaksPanel>
        <window.TweakSection label="Palette" />
        <window.TweakRadio
          label="Theme"
          value={t.palette}
          options={[
            { value: 'editorial', label: 'Editorial' },
            { value: 'ink', label: 'Ink (dark)' },
          ]}
          onChange={(v) => setTweak('palette', v)}
        />
        <window.TweakSection label="Hero" />
        <window.TweakSelect
          label="Background"
          value={t.heroBg}
          options={[
            { value: 'neural', label: 'Neural network' },
            { value: 'grid', label: 'Editorial grid' },
            { value: 'orbits', label: 'Orbits' },
          ]}
          onChange={(v) => setTweak('heroBg', v)}
        />
        <window.TweakToggle
          label="Live ticker"
          value={t.showTicker}
          onChange={(v) => setTweak('showTicker', v)}
        />
      </window.TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
