import { useGameStore } from "../../store";

function VitalBar({ label, current, max, color }: { label: string; current: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0;

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="font-body text-xs font-semibold uppercase tracking-wide text-text-secondary">{label}</span>
        <span className="font-mono text-xs text-cloud">{current} / {max}</span>
      </div>
      <div className="vital-bar-track">
        <div
          className="vital-bar-fill"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function VitalsPanel() {
  const hp = useGameStore((s) => s.hp);
  const maxHp = useGameStore((s) => s.maxHp);
  const mana = useGameStore((s) => s.mana);
  const maxMana = useGameStore((s) => s.maxMana);
  const xpIntoLevel = useGameStore((s) => s.xpIntoLevel);
  const xpToNextLevel = useGameStore((s) => s.xpToNextLevel);
  const level = useGameStore((s) => s.level);
  const gold = useGameStore((s) => s.gold);
  const inCombat = useGameStore((s) => s.inCombat);
  const name = useGameStore((s) => s.name);

  const xpMax = xpToNextLevel ?? 0;

  return (
    <div className="flex flex-col gap-3" style={{ background: "var(--surface-panel-a)", border: "1px solid var(--line-soft)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", padding: "var(--spacing-4)" }}>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-cloud">Vitals</h2>
        {inCombat && (
          <span className="combat-indicator">In Combat</span>
        )}
      </div>

      {!name ? (
        <p className="font-body text-sm text-text-secondary">Awaiting login...</p>
      ) : (
        <>
          <VitalBar label="HP" current={hp} max={maxHp} color="var(--color-moss-green)" />
          <VitalBar label="Mana" current={mana} max={maxMana} color="var(--color-pale-blue)" />
          <VitalBar label="XP" current={xpIntoLevel} max={xpMax} color="var(--color-soft-gold)" />

          <div className="flex justify-between font-body text-sm">
            <span className="text-text-secondary">
              Level <span className="text-cloud font-semibold">{level}</span>
            </span>
            <span className="text-text-secondary">
              Gold <span className="text-soft-gold font-semibold">{gold}</span>
            </span>
          </div>
        </>
      )}
    </div>
  );
}
