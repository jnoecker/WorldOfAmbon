import { useEffect, useRef } from "react";
import { PixiApp } from "../canvas/PixiApp";
import { WorldScene } from "../canvas/scenes/WorldScene";
import { useGameStore } from "../store";

export function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixiRef = useRef<PixiApp | null>(null);
  const worldRef = useRef<WorldScene | null>(null);

  const room = useGameStore((s) => s.room);

  // Initialize PixiJS
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const pixi = new PixiApp();
    pixiRef.current = pixi;

    let cancelled = false;

    pixi.init(canvas).then(() => {
      if (cancelled) {
        pixi.destroy();
        return;
      }

      const world = new WorldScene();
      worldRef.current = world;
      pixi.scenes.transition("world", world);
      pixi.resize();
    });

    const ro = new ResizeObserver(() => {
      if (pixiRef.current) {
        pixiRef.current.resize();
        // Re-render scene after resize
        if (worldRef.current) {
          const s = useGameStore.getState();
          worldRef.current.setRoom(s.room);
        }
      }
    });
    ro.observe(container);

    return () => {
      cancelled = true;
      ro.disconnect();
      pixiRef.current = null;
      worldRef.current = null;
      pixi.destroy();
    };
  }, []);

  // Update world scene when room changes
  useEffect(() => {
    worldRef.current?.setRoom(room);
  }, [room]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        background: "var(--surface-panel-b)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--line-soft)",
        width: "100%",
        height: "100%",
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
}
