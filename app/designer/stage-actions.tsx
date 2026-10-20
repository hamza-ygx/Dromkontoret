export function StageActions({ onRestart, onEdit }: { onRestart: () => void; onEdit: () => void }) {
  return (
    <div className="actions">
      <button className="act" onClick={onRestart}>
        <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden>
          <path d="M4 10a6 6 0 1 0 2-4.5M4 3.5V6h2.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Starta om
      </button>
      <button className="act" onClick={onEdit}>
        <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden>
          <path d="M3 17h3.5L16 7.5 12.5 4 3 13.5zM11 5.5 14.5 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
        Ändra
      </button>
    </div>
  );
}
