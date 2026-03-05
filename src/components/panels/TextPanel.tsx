import { useState, type KeyboardEvent } from "react";
import { useGameStore } from "../../store";
import { useAutoScroll } from "../../hooks/useAutoScroll";

export function TextPanel() {
  const messages = useGameStore((s) => s.messages);
  const send = useGameStore((s) => s.send);
  const connectionState = useGameStore((s) => s.connectionState);
  const [input, setInput] = useState("");
  const scrollRef = useAutoScroll<HTMLDivElement>(messages.length);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (trimmed && connectionState === "connected") {
      send(trimmed);
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex h-full flex-col" style={{ background: "var(--surface-panel-a)", border: "1px solid var(--line-soft)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)" }}>
      <h2 className="font-display px-4 pt-3 pb-2 text-lg font-semibold text-cloud" style={{ borderBottom: "1px solid var(--line-faint)" }}>
        Output
      </h2>
      <div
        ref={scrollRef}
        className="scrollback flex-1 overflow-y-auto px-4 py-2"
      >
        {messages.map((msg) => (
          <div key={msg.id} className="font-mono text-sm leading-relaxed">
            {msg.type === "channel" ? (
              <span>
                <span className="text-pale-blue">[{msg.channel}]</span>{" "}
                <span className="text-dusty-rose">{msg.sender}</span>
                <span className="text-cloud">: {msg.text}</span>
              </span>
            ) : (
              <span className="text-cloud">{msg.text}</span>
            )}
          </div>
        ))}
      </div>
      <div className="px-3 pb-3 pt-2" style={{ borderTop: "1px solid var(--line-faint)" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={connectionState === "connected" ? "Type a command..." : "Not connected"}
          disabled={connectionState !== "connected"}
          className="command-input w-full font-mono text-sm"
        />
      </div>
    </div>
  );
}
