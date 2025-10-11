import { ChatInterface } from "@/components/ChatInterface";

export default function ChatPage() {
  // wouter's useLocation only returns the pathname, use window.location.search for query params
  const params = new URLSearchParams(window.location.search);
  const character = params.get('character') || 'masuo';
  const type = params.get('type') || 'trip';

  return <ChatInterface characterId={character} reportType={type as 'trip' | 'defect'} />;
}
