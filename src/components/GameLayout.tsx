import { ConnectionHeader } from "./ConnectionHeader";
import { TextPanel } from "./panels/TextPanel";
import { RoomPanel } from "./panels/RoomPanel";
import { VitalsPanel } from "./panels/VitalsPanel";

export function GameLayout() {
  return (
    <div className="flex h-screen flex-col bg-bg-primary">
      <ConnectionHeader />
      <div className="game-grid flex-1 overflow-hidden">
        <div className="min-h-0">
          <TextPanel />
        </div>
        <div className="flex min-h-0 flex-col gap-3 overflow-y-auto p-1">
          <RoomPanel />
          <VitalsPanel />
        </div>
      </div>
    </div>
  );
}
