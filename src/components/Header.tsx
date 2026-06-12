import { Link, useLocation } from "wouter";
import { useTranslation } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Swords, Home, PlusSquare, User as UserIcon, LogIn, Globe,
  BarChart3, Bell, BellDot, FileText, LayoutList
} from "lucide-react";
import { useNotifications } from "../hooks/useFirestore";
import { notificationsDb } from "../lib/db";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

function NotificationBell() {
  const { user } = useAuth();
  const { data: notifications = [] } = useNotifications(user?.id);
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const unread = notifications.filter(n => !n.read);

  const handleOpen = async () => {
    setOpen(v => !v);
    if (unread.length > 0 && user) {
      await notificationsDb.markAllRead(user.id);
      qc.invalidateQueries({ queryKey: ["notifications", user.id] });
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-full hover:bg-muted transition-colors"
      >
        {unread.length > 0 ? (
          <>
            <BellDot size={18} className="text-primary" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full text-[10px] text-primary-foreground flex items-center justify-center font-bold">
              {unread.length > 9 ? "9+" : unread.length}
            </span>
          </>
        ) : (
          <Bell size={18} className="text-muted-foreground" />
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 w-72 bg-card border rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="p-3 border-b flex items-center justify-between">
              <span className="font-bold text-sm">Bildirimler</span>
              {notifications.length > 0 && (
                <button
                  className="text-xs text-primary hover:underline"
                  onClick={async () => {
                    if (user) {
                      await notificationsDb.markAllRead(user.id);
                      qc.invalidateQueries({ queryKey: ["notifications", user.id] });
                    }
                  }}
                >
                  Tümünü oku
                </button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-8">Bildirim yok</p>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className={`px-4 py-3 border-b last:border-0 text-sm ${n.read ? "opacity-60" : "bg-primary/5"}`}>
                    <p className="font-medium">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{new Date(n.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function Header() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [location] = useLocation();

  const desktopNavLinks = [
    { href: "/", label: t("nav_tests") },
    { href: "/duels", label: t("nav_duels") },
    { href: "/tierlist", label: t("nav_tierlist_pl") },
    { href: "/universes", label: t("nav_universes") },
  ];

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  const mobileNav = [
    { href: "/", icon: FileText, label: t("nav_tests") },
    { href: "/duels", icon: Swords, label: t("nav_duels") },
    { href: "/tierlist", icon: LayoutList, label: t("nav_tierlist_pl") },
    { href: "/universes", icon: Globe, label: t("nav_universes") },
    { href: "/create", icon: PlusSquare, label: t("nav_create") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center mx-auto px-4 justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition-opacity shrink-0">
          <Swords className="h-5 w-5" />
          <span className="hidden sm:block">CharComp</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5">
          {desktopNavLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.href) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />
          <NotificationBell />

          <Link href="/create" className="hidden sm:inline-flex">
            <Button variant="default" size="sm" className="gap-1.5">
              <PlusSquare size={15} />
              {t("nav_create")}
            </Button>
          </Link>

          {user ? (
            <Link href="/profile" className="flex items-center">
              <Avatar className="h-8 w-8 cursor-pointer border-2 border-transparent hover:border-primary transition-all">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xs"><UserIcon size={13} /></AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <LogIn size={15} />
                <span className="hidden sm:block">{t("auth_login")}</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Bottom Nav — 6 items: 5 links + profile avatar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur flex justify-around items-center z-50 h-14 px-1">
        {mobileNav.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          const isCreate = href === "/create";
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {isCreate ? (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Icon size={16} className="text-primary-foreground" />
                </div>
              ) : (
                <Icon size={17} />
              )}
              <span className="text-[9px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}

        {/* Profile avatar as 6th item */}
        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-colors ${
            isActive("/profile") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {user ? (
            <Avatar className={`h-7 w-7 border-2 transition-all ${isActive("/profile") ? "border-primary" : "border-transparent"}`}>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-[10px]"><UserIcon size={11} /></AvatarFallback>
            </Avatar>
          ) : (
            <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center ${isActive("/profile") ? "border-primary bg-primary/10" : "border-muted-foreground/30"}`}>
              <UserIcon size={13} className={isActive("/profile") ? "text-primary" : "text-muted-foreground"} />
            </div>
          )}
          <span className="text-[9px] font-medium leading-none">{t("nav_profile")}</span>
        </Link>
      </nav>
    </header>
  );
}
