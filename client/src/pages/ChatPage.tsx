import { ChatInterface } from "@/components/ChatInterface";
import { useLocation } from "wouter";

export default function ChatPage() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  const character = params.get('character') || 'masuo';
  const type = params.get('type') || 'trip';

  return <ChatInterface characterId={character} reportType={type as 'trip' | 'defect'} />;
}
