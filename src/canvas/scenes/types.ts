import type { Container } from "pixi.js";

export interface Scene {
  readonly container: Container;
  update(dt: number): void;
  resize(width: number, height: number): void;
  destroy(): void;
}

export type SceneName = "world" | "battle";
