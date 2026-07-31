---
name: Realtime API voice relay
description: Architecture and key constraints for the OpenAI Realtime API voice chat feature.
---

## Architecture
- Browser WebSocket → `server/voice-chat.ts` → OpenAI Realtime API WebSocket (relay pattern)
- Path: `/ws/voice-chat` (WebSocket upgrade handled in `server/routes.ts`)
- No separate port; shares the existing Express HTTP server on port 5000

## Audio format
- `AudioContext` must be created with `{ sampleRate: 24000 }` — OpenAI Realtime API requires 24kHz PCM16 mono
- Browser mic input is automatically resampled by the browser to 24kHz
- `client/public/pcm-processor.js` is an AudioWorklet that converts Float32 → Int16 chunks and posts as ArrayBuffer
- OpenAI audio output (base64 PCM16) is decoded and scheduled with `AudioContext.createBuffer(1, len, 24000)`

## Control flow
1. Session is configured on `openaiWs.open` with `session.update` (voice, VAD, tools)
2. An initial user text message triggers the AI greeting
3. `finish_interview` function tool signals completion — server calls `generateReport()` and sends `report_complete` back via browser WS
4. Browser stores result in `sessionStorage("voiceReportData")` and navigates to `/voice/preview`

**Why:** Relay pattern avoids exposing the API key to the browser; the server accumulates transcript for report generation.

## Key files
- `server/voice-chat.ts` — relay + transcript accumulation + finish_interview handler
- `server/routes.ts` — WebSocket upgrade on `/ws/voice-chat`
- `client/public/pcm-processor.js` — AudioWorklet (must be in `client/public/`, not `src/`)
- `client/src/hooks/useVoiceChat.ts` — all browser-side WS + audio state
- `client/src/pages/VoicePage.tsx` — UI
- `client/src/pages/VoicePreviewPage.tsx` — reads sessionStorage, calls existing save endpoints
