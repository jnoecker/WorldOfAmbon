import { Container } from "pixi.js";
import type { Scene, SceneName } from "./types";

export class SceneManager {
  readonly stage: Container;
  private current: Scene | null = null;
  private currentName: SceneName | null = null;
  private width = 0;
  private height = 0;

  constructor(stage: Container) {
    this.stage = stage;
  }

  get activeScene(): SceneName | null {
    return this.currentName;
  }

  transition(name: SceneName, scene: Scene): void {
    if (this.current) {
      this.stage.removeChild(this.current.container);
      this.current.destroy();
    }
    this.current = scene;
    this.currentName = name;
    this.stage.addChild(scene.container);
    if (this.width > 0 && this.height > 0) {
      scene.resize(this.width, this.height);
    }
  }

  update(dt: number): void {
    this.current?.update(dt);
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.current?.resize(width, height);
  }

  destroy(): void {
    if (this.current) {
      this.stage.removeChild(this.current.container);
      this.current.destroy();
      this.current = null;
      this.currentName = null;
    }
  }
}
