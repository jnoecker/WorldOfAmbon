import { parseFrame } from "./GmcpParser";

export type ConnectionState = "disconnected" | "connecting" | "connected";

export interface ConnectionConfig {
  url: string;
  onGmcp: (pkg: string, data: unknown) => void;
  onText: (text: string) => void;
  onStateChange: (state: ConnectionState) => void;
}

const PING_INTERVAL_MS = 30_000;
const MAX_RECONNECT_DELAY_MS = 30_000;
const BASE_RECONNECT_DELAY_MS = 1_000;

export class WebSocketManager {
  private config: ConnectionConfig;
  private ws: WebSocket | null = null;
  private state: ConnectionState = "disconnected";
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private shouldReconnect = false;

  constructor(config: ConnectionConfig) {
    this.config = config;
  }

  connect(): void {
    if (this.ws) {
      return;
    }

    this.shouldReconnect = true;
    this.setState("connecting");

    const ws = new WebSocket(this.config.url);

    ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.setState("connected");
      this.sendGmcp("Core.Hello", {
        client: "World of Ambon",
        version: "0.1.0",
      });
      this.startPing();
    };

    ws.onmessage = (event: MessageEvent) => {
      const frame = parseFrame(event);
      if (frame.type === "gmcp") {
        this.config.onGmcp(frame.package, frame.data);
      } else {
        this.config.onText(frame.text);
      }
    };

    ws.onclose = () => {
      this.cleanup();
      this.setState("disconnected");
      this.scheduleReconnect();
    };

    ws.onerror = () => {
      // onclose will fire after onerror, so we handle cleanup there
    };

    this.ws = ws;
  }

  disconnect(): void {
    this.shouldReconnect = false;
    this.clearReconnectTimer();
    if (this.ws) {
      this.cleanup();
      this.ws.close();
      this.ws = null;
      this.setState("disconnected");
    }
  }

  send(text: string): void {
    if (this.ws && this.state === "connected") {
      this.ws.send(text);
    }
  }

  sendGmcp(pkg: string, data?: unknown): void {
    if (this.ws && this.state === "connected") {
      this.ws.send(JSON.stringify({ gmcp: pkg, data: data ?? {} }));
    }
  }

  private setState(state: ConnectionState): void {
    if (this.state !== state) {
      this.state = state;
      this.config.onStateChange(state);
    }
  }

  private startPing(): void {
    this.stopPing();
    this.pingTimer = setInterval(() => {
      this.sendGmcp("Core.Ping");
    }, PING_INTERVAL_MS);
  }

  private stopPing(): void {
    if (this.pingTimer !== null) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  private cleanup(): void {
    this.stopPing();
    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onclose = null;
      this.ws.onerror = null;
    }
    this.ws = null;
  }

  private scheduleReconnect(): void {
    if (!this.shouldReconnect) {
      return;
    }
    const delay = Math.min(
      BASE_RECONNECT_DELAY_MS * 2 ** this.reconnectAttempts,
      MAX_RECONNECT_DELAY_MS,
    );
    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}
