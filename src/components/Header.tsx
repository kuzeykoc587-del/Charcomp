import { Link, useLocation } from "wouter";
import { useTranslation } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Swords, Home, Plus, User as UserIcon, LogIn,
  Bell, BellDot, ShieldCheck
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
              <span className="font-bold text-sm">Notifications</span>
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
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-8">No notifications</p>
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
  const { user, roleInfo } = useAuth();
  const [location] = useLocation();

  const canModerate = roleInfo?.canModerate ?? false;

  const desktopNavLinks = [
    { href: "/tests", label: t("nav_tests") },
    { href: "/duels", label: t("nav_duels") },
    { href: "/tierlists", label: t("lbl_tierlists") },
    { href: "/this-or-that", label: t("lbl_this_or_that") },
    { href: "/universes", label: t("nav_universes") },
  ];

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center mx-auto px-4 justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition-opacity">
          <Swords className="h-6 w-6" />
          <span>CharComp</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5">
          {desktopNavLinks.map((link) => (
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
          {canModerate && (
            <Link
              href="/admin"
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                isActive("/admin") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <ShieldCheck size={14} />
              Moderasyon
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <NotificationBell />

          {canModerate && (
            <Link href="/admin" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm" className="gap-1.5 border-primary/40 text-primary hover:bg-primary/10">
                <ShieldCheck size={14} />
                Admin
              </Button>
            </Link>
          )}

          <Link href="/create" className="hidden sm:inline-flex">
            <Button variant="default" size="sm" className="gap-2">
              <Plus size={16} />
              {t("nav_create")}
            </Button>
          </Link>

          {user ? (
            <Link href="/profile" className="flex items-center gap-2">
              <Avatar className="h-8 w-8 cursor-pointer border hover:border-primary transition-all">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xs font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={14} />}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm" className="gap-2">
                <LogIn size={16} />
                {t("auth_login")}
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 h-16 flex items-center justify-around px-4">

        <Link href="/create">
          <div className={`flex flex-col items-center gap-0.5 ${isActive("/create") ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              isActive("/create") ? "bg-primary" : "bg-foreground/10"
            }`}>
              <Plus size={20} className={isActive("/create") ? "text-primary-foreground" : "text-foreground"} />
            </div>
            <span className="text-[10px] font-medium">{t("nav_create")}</span>
          </div>
        </Link>

        <Link href="/">
          <div className={`flex flex-col items-center gap-0.5 ${location === "/" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              location === "/" ? "bg-primary/15" : "hover:bg-muted"
            }`}>
              <Home size={20} className={location === "/" ? "text-primary" : ""} />
            </div>
            <span className="text-[10px] font-medium">{t("nav_home")}</span>
          </div>
        </Link>

        {canModerate && (
          <Link href="/admin">
            <div className={`flex flex-col items-center gap-0.5 ${isActive("/admin") ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                isActive("/admin") ? "bg-primary" : "bg-foreground/10"
              }`}>
                <ShieldCheck size={18} className={isActive("/admin") ? "text-primary-foreground" : "text-foreground"} />
              </div>
              <span className="text-[10px] font-medium">Admin</span>
            </div>
          </Link>
        )}

        {user ? (
          <Link href="/profile">
            <div className={`flex flex-col items-center gap-0.5 ${isActive("/profile") ? "text-primary" : "text-muted-foreground"}`}>
              <Avatar className={`h-10 w-10 border-2 transition-colors ${isActive("/profile") ? "border-primary" : "border-transparent"}`}>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-sm font-black">
                  {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={14} />}
                </AvatarFallback>
              </Avatar>
              <span className="text-[10px] font-medium">{t("nav_profile")}</span>
            </div>
          </Link>
        ) : (
          <Link href="/login">
            <div className={`flex flex-col items-center gap-0.5 ${isActive("/login") ? "text-primary" : "text-muted-foreground"}`}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-foreground/10">
                <UserIcon size={20} />
              </div>
              <span className="text-[10px] font-medium">{t("auth_login")}</span>
            </div>
          </Link>
        )}
      </nav>
    </header>
  );
}
