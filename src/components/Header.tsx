import { Link, useLocation } from "wouter";
import { useTranslation } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Swords, Home, PlusSquare, Plus, User as UserIcon, LogIn,
  Bell, BellDot
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
  const { user } = useAuth();
  const [location] = useLocation();

  const desktopNavLinks = [
    { href: "/tests", label: t("nav_tests") },
    { href: "/duels", label: t("nav_duels") },
    { href: "/tierlist", label: t("nav_tierlist") },
    { href: "/universes", label: t("nav_universes") },
  ];

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <>
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
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <NotificationBell />

            <Link href="/create" className="hidden sm:inline-flex">
              <Button variant="default" size="sm" className="gap-2">
                <PlusSquare size={16} />
                {t("nav_create")}
              </Button>
            </Link>

            {user ? (
              <Link href="/profile" className="flex items-center gap-2">
                <Avatar className="h-8 w-8 cursor-pointer border hover:border-primary transition-all">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-xs font-semibold">
                    {user.name?.charAt(0).toUpperCase() ?? <UserIcon size={14} />}
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
      </header>

      {/* Mobile Bottom Nav — 3 items: Create | Home | Profile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 h-16">
        <div className="grid grid-cols-3 h-full items-center px-6">

          {/* LEFT: Create — small filled rounded-square */}
          <div className="flex justify-start">
            <Link href="/create">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  isActive("/create") ? "bg-primary/85" : "bg-primary"
                }`}
              >
                <Plus size={20} className="text-primary-foreground" strokeWidth={2.5} />
              </div>
            </Link>
          </div>

          {/* CENTER: Home — larger icon, always centered */}
          <div className="flex justify-center">
            <Link
              href="/"
              className={`flex flex-col items-center gap-0.5 transition-colors ${
                location === "/" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Home size={26} />
              <span className="text-[10px] font-semibold">{t("nav_home")}</span>
            </Link>
          </div>

          {/* RIGHT: Profile avatar */}
          <div className="flex justify-end">
            {user ? (
              <Link href="/profile">
                <Avatar
                  className={`h-9 w-9 border-2 transition-colors cursor-pointer ${
                    isActive("/profile") ? "border-primary" : "border-transparent"
                  }`}
                >
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-sm font-semibold">
                    {user.name?.charAt(0).toUpperCase() ?? <UserIcon size={14} />}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Link href="/login">
                <div
                  className={`h-9 w-9 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isActive("/login") ? "border-primary text-primary" : "border-muted text-muted-foreground"
                  }`}
                >
                  <UserIcon size={18} />
                </div>
              </Link>
            )}
          </div>

        </div>
      </nav>
    </>
  );
}
