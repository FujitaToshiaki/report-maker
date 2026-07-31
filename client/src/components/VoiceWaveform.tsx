import { useEffect, useRef } from "react";
import type { VoiceStatus } from "@/hooks/useVoiceChat";

interface VoiceWaveformProps {
  status: VoiceStatus;
}

export function VoiceWaveform({ status }: VoiceWaveformProps) {
  const barsCount = 12;

  const isListening = status === "listening";
  const isAiSpeaking = status === "ai_speaking";
  const isActive = isListening || isAiSpeaking || status === "processing";

  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {Array.from({ length: barsCount }).map((_, i) => {
        const delay = (i * 0.08).toFixed(2);
        const baseHeight = isActive ? "h-2" : "h-1";

        return (
          <div
            key={i}
            className={`w-1.5 rounded-full transition-all duration-300 ${
              isListening
                ? "bg-emerald-400 animate-voice-bar"
                : isAiSpeaking
                ? "bg-violet-400 animate-voice-bar"
                : status === "processing"
                ? "bg-amber-400 animate-pulse"
                : "bg-white/20"
            } ${baseHeight}`}
            style={{
              animationDelay: isActive ? `${delay}s` : "0s",
              height: isActive ? undefined : "4px",
            }}
          />
        );
      })}
    </div>
  );
}
