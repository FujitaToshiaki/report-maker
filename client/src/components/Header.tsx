import { FileText } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Link } from "wouter";

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-2 hover-elevate rounded-lg px-3 py-2 -ml-3" data-testid="link-home">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">出張報告書アシスタント</span>
          </a>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
