import { Home, User, Truck, BarChart3, Package, FileText, RotateCcw, Apple, Ban } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { to: "/", icon: Home, label: "Beranda", tooltip: "Halaman Utama" },
  { to: "/products", icon: Package, label: "Bahan Baku", tooltip: "Kelola Bahan Baku Makanan" },
  { to: "/invoices", icon: FileText, label: "Faktur", tooltip: "Daftar Faktur Pembelian" },
  { to: "/returns", icon: RotateCcw, label: "Retur", tooltip: "Pengembalian Bahan Baku" },
  { to: "/food-condition", icon: Apple, label: "Inspeksi Kualitas", tooltip: "Pemeriksaan Mutu Bahan Baku" },
  { to: "/rejected", icon: Ban, label: "Bahan Ditolak", tooltip: "Bahan Baku yang Ditolak" },
  { to: "/analytics", icon: BarChart3, label: "Analitik", tooltip: "Analitik Bahan Baku" },
  { to: "/projects", icon: Truck, label: "Pemasok", tooltip: "Manajemen Pemasok Bahan Baku" },
  { to: "/profile", icon: User, label: "Profil", tooltip: "Profil Pengguna" },
];

export const AppSidebar = () => {
  const { open } = useSidebar();

  return (
    <TooltipProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border p-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-foreground" />
                </div>
                {open && (
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-sidebar-foreground">MBG</span>
                    <span className="text-xs text-sidebar-foreground/60">Bahan Baku</span>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            {!open && (
              <TooltipContent side="right">
                <p className="font-semibold">MBG - Sistem Bahan Baku</p>
                <p className="text-xs text-muted-foreground">Kelola bahan makanan untuk Makanan Bergizi Gratis</p>
              </TooltipContent>
            )}
          </Tooltip>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <NavLink
                            to={item.to}
                            end={item.to === "/"}
                            className={({ isActive }) =>
                              cn(
                                "flex items-center gap-2",
                                isActive
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                              )
                            }
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </NavLink>
                        </TooltipTrigger>
                        {!open && (
                          <TooltipContent side="right">
                            <p className="font-medium">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.tooltip}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
};
