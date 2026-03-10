export default function Footer() {
  return (
    <footer className="py-4 text-center border-t border-border/30">
      <p className="text-sm text-text-muted">
        <span className="font-semibold text-text-dim">Promptor</span>
        {' '}&mdash; Propose par{' '}
        <span className="text-brand-400 font-medium">Ludo Salenne</span>
        {' '}avec ❤️ (et Google Antigravity)
      </p>
    </footer>
  );
}
