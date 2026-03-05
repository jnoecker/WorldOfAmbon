import { Container, Graphics, Text, TextStyle } from "pixi.js";
import type { Scene } from "./types";
import type { RoomInfo } from "../../connection";

const TILE_W = 140;
const TILE_H = 80;
const GAP = 24;
const PLAYER_RADIUS = 6;

// Map direction names to grid offsets
const DIR_OFFSETS: Record<string, { dx: number; dy: number }> = {
  north: { dx: 0, dy: -1 },
  south: { dx: 0, dy: 1 },
  east: { dx: 1, dy: 0 },
  west: { dx: -1, dy: 0 },
  northeast: { dx: 1, dy: -1 },
  northwest: { dx: -1, dy: -1 },
  southeast: { dx: 1, dy: 1 },
  southwest: { dx: -1, dy: 1 },
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
};

const TITLE_STYLE = new TextStyle({
  fontFamily: "Cormorant Garamond, Georgia, serif",
  fontSize: 13,
  fontWeight: "600",
  fill: 0xd8def1,
  wordWrap: true,
  wordWrapWidth: TILE_W - 16,
  align: "center",
});

const EXIT_LABEL_STYLE = new TextStyle({
  fontFamily: "Nunito Sans, sans-serif",
  fontSize: 10,
  fill: 0x8caec9,
  align: "center",
});

const ZONE_STYLE = new TextStyle({
  fontFamily: "Nunito Sans, sans-serif",
  fontSize: 11,
  fill: 0x6f7da1,
  align: "center",
});

export class WorldScene implements Scene {
  readonly container = new Container();
  private width = 0;
  private height = 0;
  private currentRoomId: string | null = null;

  // Animated player indicator
  private playerDot: Graphics;
  private playerPhase = 0;

  // Transition animation
  private animating = false;
  private animProgress = 0;
  private contentContainer = new Container();

  constructor() {
    this.container.addChild(this.contentContainer);
    this.playerDot = new Graphics();
    this.contentContainer.addChild(this.playerDot);
  }

  setRoom(room: RoomInfo | null): void {
    if (!room) return;

    const isNewRoom = room.id !== this.currentRoomId;
    const prevId = this.currentRoomId;
    this.currentRoomId = room.id;

    // Determine transition direction
    if (isNewRoom && prevId !== null) {
      // Find which exit direction led to this room by checking if the new room id
      // matches any exit from the old layout — but we don't have the old exits anymore.
      // Instead, we can just do a fade/slide from center.
      this.animating = true;
      this.animProgress = 0;
    }

    this.rebuild(room);
  }

  private rebuild(room: RoomInfo): void {
    // Clear everything except playerDot
    this.contentContainer.removeChildren();
    this.contentContainer.addChild(this.playerDot);

    const cx = this.width / 2;
    const cy = this.height / 2;

    // Draw current room tile
    this.drawTile(cx, cy, room.title, true);

    // Draw zone label above current room
    const zoneText = new Text({ text: room.zone, style: ZONE_STYLE });
    zoneText.anchor.set(0.5);
    zoneText.x = cx;
    zoneText.y = cy - TILE_H / 2 - 20;
    this.contentContainer.addChild(zoneText);

    // Draw exit tiles
    const exits = room.exits;
    for (const dir of Object.keys(exits)) {
      const offset = DIR_OFFSETS[dir];
      if (!offset) continue;

      const tx = cx + offset.dx * (TILE_W + GAP);
      const ty = cy + offset.dy * (TILE_H + GAP);

      this.drawTile(tx, ty, null, false);

      // Direction label
      const label = new Text({ text: dir, style: EXIT_LABEL_STYLE });
      label.anchor.set(0.5);
      label.x = tx;
      label.y = ty;
      this.contentContainer.addChild(label);

      // Draw connector line
      this.drawConnector(cx, cy, tx, ty);
    }

    // Position player dot at center
    this.drawPlayerDot(cx, cy);
  }

  private drawTile(x: number, y: number, title: string | null, isCurrent: boolean): void {
    const g = new Graphics();
    const halfW = TILE_W / 2;
    const halfH = TILE_H / 2;

    // Background
    g.roundRect(-halfW, -halfH, TILE_W, TILE_H, 10);
    if (isCurrent) {
      g.fill({ color: 0x363f5a, alpha: 0.95 });
      g.stroke({ width: 1.5, color: 0xa897d2, alpha: 0.6 });
    } else {
      g.fill({ color: 0x2b3550, alpha: 0.7 });
      g.stroke({ width: 1, color: 0x97a6cc, alpha: 0.24 });
    }
    g.x = x;
    g.y = y;
    this.contentContainer.addChild(g);

    if (title) {
      const text = new Text({ text: title, style: TITLE_STYLE });
      text.anchor.set(0.5);
      text.x = x;
      text.y = y;
      this.contentContainer.addChild(text);
    }
  }

  private drawConnector(fromX: number, fromY: number, toX: number, toY: number): void {
    const g = new Graphics();

    // Shorten line to not overlap tiles
    const dx = toX - fromX;
    const dy = toY - fromY;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return;
    const nx = dx / len;
    const ny = dy / len;

    const startDist = Math.max(TILE_W, TILE_H) / 2 + 4;
    const endDist = Math.max(TILE_W, TILE_H) / 2 + 4;

    const sx = fromX + nx * startDist;
    const sy = fromY + ny * startDist;
    const ex = toX - nx * endDist;
    const ey = toY - ny * endDist;

    g.moveTo(sx, sy);
    g.lineTo(ex, ey);
    g.stroke({ width: 1.5, color: 0x97a6cc, alpha: 0.3 });

    this.contentContainer.addChild(g);
  }

  private drawPlayerDot(x: number, y: number): void {
    this.playerDot.clear();
    this.playerDot.circle(0, 0, PLAYER_RADIUS);
    this.playerDot.fill({ color: 0xa897d2, alpha: 0.9 });
    this.playerDot.x = x;
    this.playerDot.y = y + TILE_H / 2 - PLAYER_RADIUS - 8;
  }

  update(dt: number): void {
    // Pulse the player dot
    this.playerPhase += dt * 0.03;
    const scale = 1 + Math.sin(this.playerPhase) * 0.15;
    this.playerDot.scale.set(scale);

    // Room transition animation
    if (this.animating) {
      this.animProgress += dt * 0.04;
      if (this.animProgress >= 1) {
        this.animProgress = 1;
        this.animating = false;
      }
      // Ease out
      const t = 1 - Math.pow(1 - this.animProgress, 3);
      this.contentContainer.alpha = t;
    }
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    // Re-center if we have a room
    if (this.currentRoomId) {
      // Trigger a re-render with current store data
      // The React component will call setRoom again after resize
    }
  }

  destroy(): void {
    this.contentContainer.destroy({ children: true });
  }
}
