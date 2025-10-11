import { FileText, AlertTriangle, LayoutDashboard, Settings, HelpCircle } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useLocation, Link } from "wouter";

const menuItems = [
  {
    title: "ダッシュボード",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "出張報告書",
    url: "/trip-reports",
    icon: FileText,
  },
  {
    title: "不良品報告書",
    url: "/defect-reports",
    icon: AlertTriangle,
  },
  {
    title: "設定",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "ヘルプ",
    url: "/help",
    icon: HelpCircle,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold">報告書アシスタント</p>
            <p className="text-xs text-muted-foreground">Report Assistant</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>メニュー</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.url}>
                    <SidebarMenuButton
                      isActive={location === item.url}
                      data-testid={`nav-${item.url.slice(1) || 'dashboard'}`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
