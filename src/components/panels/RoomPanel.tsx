import { useGameStore } from "../../store";

export function RoomPanel() {
  const room = useGameStore((s) => s.room);
  const players = useGameStore((s) => s.players);
  const mobs = useGameStore((s) => s.mobs);
  const roomItems = useGameStore((s) => s.roomItems);

  return (
    <div className="flex flex-col gap-3" style={{ background: "var(--surface-panel-a)", border: "1px solid var(--line-soft)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", padding: "var(--spacing-4)" }}>
      <h2 className="font-display text-lg font-semibold text-cloud">Room</h2>

      {!room ? (
        <p className="font-body text-sm text-text-secondary">Awaiting room data...</p>
      ) : (
        <>
          <div>
            <h3 className="font-display text-base font-semibold text-soft-gold">{room.title}</h3>
            <span className="font-body text-xs text-text-secondary">{room.zone}</span>
          </div>

          <p className="font-body text-sm leading-relaxed text-cloud">{room.description}</p>

          {/* Exits */}
          <div>
            <span className="font-body text-xs font-semibold uppercase tracking-wide text-text-secondary">Exits</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {Object.keys(room.exits).length === 0 ? (
                <span className="text-xs text-text-disabled">None</span>
              ) : (
                Object.keys(room.exits).map((dir) => (
                  <span key={dir} className="exit-pill">{dir}</span>
                ))
              )}
            </div>
          </div>

          {/* Players */}
          {players.length > 0 && (
            <div>
              <span className="font-body text-xs font-semibold uppercase tracking-wide text-text-secondary">Players</span>
              <ul className="mt-1 space-y-0.5">
                {players.map((p) => (
                  <li key={p.name} className="font-body text-sm text-pale-blue">
                    {p.name} <span className="text-text-secondary text-xs">Lv{p.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mobs */}
          {mobs.length > 0 && (
            <div>
              <span className="font-body text-xs font-semibold uppercase tracking-wide text-text-secondary">Creatures</span>
              <ul className="mt-1 space-y-0.5">
                {mobs.map((m) => (
                  <li key={m.id} className="font-body text-sm text-dusty-rose">
                    {m.name} <span className="text-text-secondary text-xs">({m.hp}/{m.maxHp})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Items */}
          {roomItems.length > 0 && (
            <div>
              <span className="font-body text-xs font-semibold uppercase tracking-wide text-text-secondary">Items</span>
              <ul className="mt-1 space-y-0.5">
                {roomItems.map((item) => (
                  <li key={item.id} className="font-body text-sm text-moss-green">{item.name}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
