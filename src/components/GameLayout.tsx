import { useGameStore } from "../store";
import { ConnectionHeader } from "./ConnectionHeader";
import { GameCanvas } from "./GameCanvas";
import { TextPanel } from "./panels/TextPanel";
import { RoomPanel } from "./panels/RoomPanel";
import { VitalsPanel } from "./panels/VitalsPanel";

export function GameLayout() {
  const loggedIn = useGameStore((s) => s.name !== null);

  return (
    <div className="flex h-screen flex-col bg-bg-primary">
      <ConnectionHeader />
      {loggedIn ? (
        <div className="game-layout flex-1 overflow-hidden">
          <div className="game-layout__text min-h-0">
            <TextPanel />
          </div>
          <div className="game-layout__sidebar flex min-h-0 flex-col gap-3 overflow-y-auto p-1">
            <RoomPanel />
            <VitalsPanel />
          </div>
          <div className="game-layout__canvas min-h-0">
            <GameCanvas />
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden p-3">
          <TextPanel />
        </div>
      )}
    </div>
  );
}
