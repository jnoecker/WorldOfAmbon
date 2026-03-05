import type { GmcpPackageMap } from "./types";

export type GmcpHandler<T = unknown> = (data: T) => void;

export class GmcpDispatcher {
  private handlers = new Map<string, GmcpHandler>();
  private textHandler: ((text: string) => void) | null = null;

  on<K extends keyof GmcpPackageMap>(
    pkg: K,
    handler: GmcpHandler<GmcpPackageMap[K]>,
  ): void {
    this.handlers.set(pkg, handler as GmcpHandler);
  }

  off(pkg: string): void {
    this.handlers.delete(pkg);
  }

  onText(handler: (text: string) => void): void {
    this.textHandler = handler;
  }

  offText(): void {
    this.textHandler = null;
  }

  dispatch(pkg: string, data: unknown): void {
    const handler = this.handlers.get(pkg);
    if (handler) {
      handler(data);
    }
  }

  dispatchText(text: string): void {
    if (this.textHandler) {
      this.textHandler(text);
    }
  }
}
