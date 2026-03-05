import { useEffect, useRef } from "react";
import { PixiApp } from "../canvas/PixiApp";
import { WorldScene } from "../canvas/scenes/WorldScene";
import { useGameStore } from "../store";

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixiRef = useRef<PixiApp | null>(null);
  const worldRef = useRef<WorldScene | null>(null);

  const room = useGameStore((s) => s.room);

  // Initialize PixiJS
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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

    const onResize = () => pixi.resize();
    window.addEventListener("resize", onResize);

    // ResizeObserver for container size changes
    const parent = canvas.parentElement;
    let ro: ResizeObserver | null = null;
    if (parent) {
      ro = new ResizeObserver(() => pixi.resize());
      ro.observe(parent);
    }

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
      pixiRef.current = null;
      worldRef.current = null;
      pixi.destroy();
    };
  }, []);

  // Update world scene when room changes
  useEffect(() => {
    worldRef.current?.setRoom(room);
  }, [room]);

  // Re-render on resize by also passing room after resize
  useEffect(() => {
    const pixi = pixiRef.current;
    const world = worldRef.current;
    if (pixi && world && room) {
      // Slight delay to let resize complete
      const id = requestAnimationFrame(() => {
        world.setRoom(room);
      });
      return () => cancelAnimationFrame(id);
    }
  }, [room]);

  return (
    <div className="canvas-container relative h-full w-full overflow-hidden" style={{ background: "var(--surface-panel-b)", borderRadius: "var(--radius-lg)", border: "1px solid var(--line-soft)" }}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
