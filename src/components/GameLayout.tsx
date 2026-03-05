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
        <div className="game-layout">
          <div className="game-layout__top">
            <div className="game-layout__text">
              <TextPanel />
            </div>
            <div className="game-layout__sidebar">
              <RoomPanel />
              <VitalsPanel />
            </div>
          </div>
          <div className="game-layout__canvas">
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
