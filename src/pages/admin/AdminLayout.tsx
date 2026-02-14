import { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation, Navigate } from "react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Layers,
  Settings as SettingsIcon,
  LogOut,
  Clock,
  ChevronRight,
  Globe,
  Home,
  Image as ImageIcon,
  User,
  ChevronDown,
  ChevronUp,
  Mail,
  Award
} from "lucide-react";
import { useAuth } from "@/components/providers/SupabaseAuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useLogoSettings } from "@/hooks/use-cms";
import { convertDriveUrlToDirectImageUrl } from "@/lib/image-utils";

type Theme = 'light' | 'dark';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
  useSidebar
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function AdminLayout() {
  const location = useLocation();
  const { isAuthenticated, isLoading, signOut, isAdmin } = useAuth();
  const { theme, setTheme } = useTheme();
  const originalThemeRef = useRef<Theme | null>(null);
  const { data: logoSettings } = useLogoSettings();

  // All hooks must be called before any conditional returns
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    home: true,
    pages: true,
    settings: true,
  });

  // Force dark theme for admin panel
  useEffect(() => {
    // Store original theme before forcing dark
    if (originalThemeRef.current === null) {
      originalThemeRef.current = theme;
    }

    const root = document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');

    return () => {
      // Restore original theme when leaving admin
      const originalTheme = originalThemeRef.current || 'dark';
      if (originalTheme === 'light') {
        root.classList.add('light');
        root.classList.remove('dark');
      } else {
        root.classList.add('dark');
        root.classList.remove('light');
      }
      // Reset ref for next time
      originalThemeRef.current = null;
    };
  }, [theme]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have admin privileges.</p>
        </div>
      </div>
    );
  }

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const navGroups = [
    {
      id: "home",
      label: "Home Page",
      icon: Home,
      items: [
        { icon: Home, label: "Home Settings", to: "/admin/home", description: "Hero, About, Contact sections" },
        { icon: ImageIcon, label: "Gallery", to: "/admin/gallery", description: "Portfolio gallery items" },
        { icon: FileText, label: "Footer", to: "/admin/footer", description: "Footer links & social" },
      ]
    },
    {
      id: "pages",
      label: "Pages",
      icon: FileText,
      items: [
        { icon: User, label: "About Page", to: "/admin/pages?tab=about", description: "About content & timeline" },
        { icon: Layers, label: "Expertise", to: "/admin/expertise", description: "Expertise cards" },
        { icon: FileText, label: "Resume Page", to: "/admin/resume", description: "Experience, Skills, & Stats" },
        { icon: FileText, label: "Contact Page", to: "/admin/pages?tab=contact", description: "Contact info" },
        { icon: Mail, label: "Contact Submissions", to: "/admin/contact", description: "Form submissions" },
      ]
    },
    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
      items: [
        { icon: Globe, label: "Meta Tags & SEO", to: "/admin/meta-tags", description: "SEO & social previews" },
        { icon: SettingsIcon, label: "Site Settings", to: "/admin/settings", description: "Logo, profile, etc." },
      ]
    },
  ];


  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar collapsible="icon" className="border-r border-white/10 transition-all duration-300">
          <SidebarHeader className="p-4 border-b border-white/5">
            <div className="flex items-center gap-3 px-1 group-hover:gap-4 transition-all duration-200 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold overflow-hidden transition-all duration-200 hover:scale-110 hover:rotate-3 active:scale-95 shrink-0 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10">
                {logoSettings?.logoUrl ? (
                  <img
                    src={convertDriveUrlToDirectImageUrl(logoSettings.logoUrl)}
                    alt="Logo"
                    className="w-full h-full object-contain transition-opacity duration-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      if (target.nextElementSibling) {
                        (target.nextElementSibling as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <span className={logoSettings?.logoUrl ? 'hidden' : ''} style={{ display: logoSettings?.logoUrl ? 'none' : 'block' }}>
                  {logoSettings?.logoText || 'CS'}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden transition-opacity duration-200">
                <span className="font-bold text-sm">Admin Panel</span>
                <span className="text-xs text-muted-foreground">v1.0.0</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20">
            {/* Dashboard Link */}
            <SidebarGroup className="px-2">
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === "/admin"}
                      tooltip="Dashboard"
                      className={`transition-all duration-200 rounded-lg ${location.pathname === "/admin"
                        ? 'bg-sidebar-accent/30 text-foreground font-semibold'
                        : 'hover:bg-sidebar-accent/50 hover:translate-x-1 group-data-[collapsible=icon]:hover:translate-x-0'
                        } active:scale-95`}
                    >
                      <Link to="/admin" className="flex items-center justify-center gap-3 w-full group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:justify-center">
                        <LayoutDashboard className={`w-4 h-4 shrink-0 transition-all duration-200 ${location.pathname === "/admin"
                          ? 'text-foreground scale-110'
                          : 'group-hover:scale-110'
                          }`} />
                        <span className="font-medium transition-colors duration-200 text-foreground group-data-[collapsible=icon]:hidden">
                          Dashboard
                        </span>
                        {location.pathname === "/admin" && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse group-data-[collapsible=icon]:hidden" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Organized Navigation Groups */}
            {navGroups.map((group) => {
              const isExpanded = expandedGroups[group.id];
              const hasActiveItem = group.items.some(item => {
                if (item.to.includes('?')) {
                  const [path, query] = item.to.split('?');
                  return location.pathname === path || location.pathname === '/admin/pages';
                }
                return location.pathname === item.to;
              });

              return (
                <SidebarGroup key={group.id} className="px-2">
                  <SidebarGroupLabel
                    className={`flex items-center justify-between cursor-pointer rounded-md px-3 py-2.5 -mx-2 transition-all duration-200 group select-none group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:opacity-100 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 ${hasActiveItem
                      ? 'bg-sidebar-accent/30 text-foreground'
                      : 'hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground'
                      }`}
                    onClick={() => toggleGroup(group.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleGroup(group.id);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-expanded={isExpanded}
                    aria-label={`${group.label} navigation group`}
                  >
                    <div className="flex items-center gap-2.5 font-semibold group-data-[collapsible=icon]:gap-0">
                      <group.icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110 shrink-0" />
                      <span className="text-sm group-data-[collapsible=icon]:hidden">{group.label}</span>
                    </div>
                    <div className="transition-transform duration-200 group-data-[collapsible=icon]:hidden">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-all duration-200" />
                      ) : (
                        <ChevronDown className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-all duration-200" />
                      )}
                    </div>
                  </SidebarGroupLabel>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                  >
                    <SidebarGroupContent className="pt-1">
                      <SidebarMenu className="space-y-1">
                        {group.items.map((item) => {
                          let isActive = false;
                          if (item.to.includes('?')) {
                            const [path, query] = item.to.split('?');
                            const params = new URLSearchParams(query);
                            const tabParam = params.get('tab');
                            const currentParams = new URLSearchParams(location.search);
                            const currentTab = currentParams.get('tab');

                            isActive = location.pathname === path &&
                              (tabParam ? currentTab === tabParam : true);
                          } else {
                            isActive = location.pathname === item.to;
                          }

                          return (
                            <SidebarMenuItem key={item.to}>
                              <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={item.label}
                                className={`pl-8 h-auto py-2.5 rounded-lg transition-all duration-200 ${isActive
                                  ? 'bg-sidebar-accent/30 text-foreground font-semibold'
                                  : 'hover:bg-sidebar-accent/50 hover:translate-x-1'
                                  } active:scale-95`}
                              >
                                <Link to={item.to} className="flex items-center gap-3 w-full group/item">
                                  <item.icon className={`w-4 h-4 shrink-0 transition-all duration-200 ${isActive
                                    ? 'text-foreground scale-110'
                                    : 'group-hover/item:scale-110 group-hover/item:text-primary'
                                    }`} />
                                  <div className="flex flex-col items-start gap-0.5 min-w-0 flex-1">
                                    <span className="text-sm font-medium transition-colors duration-200 text-foreground">
                                      {item.label}
                                    </span>
                                    <span className={`text-xs transition-opacity duration-200 ${isActive
                                      ? 'text-foreground/70 opacity-100'
                                      : 'text-muted-foreground opacity-70 group-hover/item:opacity-100'
                                      } truncate w-full`}>
                                      {item.description}
                                    </span>
                                  </div>
                                  {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                  )}
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </div>
                </SidebarGroup>
              );
            })}
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-white/5">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={async () => {
                    try {
                      await signOut();
                    } catch (err) {
                      console.error("Logout error:", err);
                      window.location.href = "/auth";
                    }
                  }}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200 hover:translate-x-1 active:scale-95 w-full"
                >
                  <LogOut className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
                  <span className="font-medium">Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
          <header className="flex h-16 items-center gap-4 border-b border-white/5 px-6 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6 bg-white/10" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/admin" className="hover:text-foreground transition-colors">Admin</Link>
              {location.pathname !== "/admin" && (
                <>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-foreground capitalize">
                    {location.pathname.split("/").pop()}
                  </span>
                </>
              )}
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-6 md:p-10">
            <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}