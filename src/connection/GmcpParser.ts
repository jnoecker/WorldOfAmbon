import type { GmcpEnvelope } from "./types";

export type ParsedFrame =
  | { type: "gmcp"; package: string; data: unknown }
  | { type: "text"; text: string };

export function parseFrame(event: MessageEvent): ParsedFrame {
  const raw = event.data;
  if (typeof raw !== "string") {
    return { type: "text", text: String(raw) };
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed !== null &&
      typeof parsed === "object" &&
      "gmcp" in parsed &&
      typeof (parsed as GmcpEnvelope).gmcp === "string"
    ) {
      const envelope = parsed as GmcpEnvelope;
      return { type: "gmcp", package: envelope.gmcp, data: envelope.data };
    }
  } catch {
    // Not JSON — treat as plain text
  }

  return { type: "text", text: raw };
}
