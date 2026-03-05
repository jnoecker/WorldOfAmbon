import { useState } from "react";
import { useGameStore } from "../store";

const DEFAULT_URL = "wss://mud.ambon.dev/ws";

export function ConnectionHeader() {
  const connectionState = useGameStore((s) => s.connectionState);
  const name = useGameStore((s) => s.name);
  const race = useGameStore((s) => s.race);
  const class_ = useGameStore((s) => s.class_);
  const connect = useGameStore((s) => s.connect);
  const disconnect = useGameStore((s) => s.disconnect);
  const [url, setUrl] = useState(DEFAULT_URL);

  const handleConnect = () => {
    if (connectionState === "disconnected") {
      connect(url);
    } else {
      disconnect();
    }
  };

  const pillClass =
    connectionState === "connected"
      ? "connection-pill connection-pill--connected"
      : connectionState === "connecting"
        ? "connection-pill connection-pill--connecting"
        : "connection-pill connection-pill--disconnected";

  const pillLabel =
    connectionState === "connected"
      ? "Connected"
      : connectionState === "connecting"
        ? "Connecting"
        : "Disconnected";

  return (
    <header className="flex items-center gap-4 px-5 py-3" style={{ background: "var(--surface-panel-b)", borderBottom: "1px solid var(--line-soft)" }}>
      <h1 className="font-display text-xl font-semibold tracking-wide text-cloud">
        World of Ambon
      </h1>

      <span className={pillClass}>{pillLabel}</span>

      {name && (
        <div className="flex items-baseline gap-2">
          <span className="font-body text-sm font-semibold text-lavender">{name}</span>
          <span className="font-body text-xs text-text-secondary">
            {race} {class_}
          </span>
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={connectionState !== "disconnected"}
          placeholder="WebSocket URL"
          className="command-input w-64 font-mono text-xs"
        />
        <button
          onClick={handleConnect}
          className="soft-button text-sm"
        >
          {connectionState === "disconnected" ? "Connect" : "Disconnect"}
        </button>
      </div>
    </header>
  );
}
