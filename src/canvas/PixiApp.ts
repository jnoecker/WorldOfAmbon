import { Application } from "pixi.js";
import { SceneManager } from "./scenes/SceneManager";

export class PixiApp {
  readonly app: Application;
  readonly scenes: SceneManager;
  private running = false;

  constructor() {
    this.app = new Application();
    this.scenes = new SceneManager(this.app.stage);
  }

  async init(canvas: HTMLCanvasElement): Promise<void> {
    await this.app.init({
      canvas,
      resizeTo: canvas.parentElement ?? undefined,
      backgroundAlpha: 0,
      antialias: true,
      autoDensity: true,
      resolution: window.devicePixelRatio || 1,
    });

    this.running = true;
    this.app.ticker.add((ticker) => {
      if (this.running) {
        this.scenes.update(ticker.deltaTime);
      }
    });
  }

  resize(): void {
    const parent = this.app.canvas.parentElement;
    if (parent) {
      this.app.renderer.resize(parent.clientWidth, parent.clientHeight);
      this.scenes.resize(parent.clientWidth, parent.clientHeight);
    }
  }

  destroy(): void {
    this.running = false;
    this.scenes.destroy();
    this.app.destroy(true, { children: true });
  }
}
