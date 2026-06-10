import { Link, useLocation } from "wouter";
import { useTranslation } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Swords, Compass, Home, PlusSquare, User as UserIcon, LogIn, Globe, Search, ShieldCheck } from "lucide-react";

export function Header() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: t("nav_home"), icon: <Home size={18} /> },
    { href: "/explore", label: t("nav_explore"), icon: <Compass size={18} /> },
    { href: "/universes", label: t("nav_universes"), icon: <Globe size={18} /> },
    { href: "/duels", label: t("nav_duels"), icon: <Swords size={18} /> },
    { href: "/search", label: t("nav_search"), icon: <Search size={18} /> },
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

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5 ${
                isActive(link.href) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <Link href="/create" className="hidden sm:inline-flex">
            <Button variant="default" size="sm" className="gap-2">
              <PlusSquare size={16} />
              {t("nav_create")}
            </Button>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/admin" title="Admin">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                  <ShieldCheck size={16} />
                </Button>
              </Link>
              <Link href="/profile" className="flex items-center gap-2">
                <Avatar className="h-8 w-8 cursor-pointer border hover:border-primary transition-all">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback><UserIcon size={14} /></AvatarFallback>
                </Avatar>
              </Link>
            </div>
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

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background p-2 flex justify-around items-center z-50">
        {[
          { href: "/", icon: <Home size={20} />, label: t("nav_home") },
          { href: "/search", icon: <Search size={20} />, label: t("nav_search") },
          { href: "/universes", icon: <Globe size={20} />, label: t("nav_universes") },
          { href: "/duels", icon: <Swords size={20} />, label: t("nav_duels") },
          { href: "/create", icon: <PlusSquare size={20} />, label: t("nav_create") },
        ].map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`p-2 flex flex-col items-center ${isActive(href) ? "text-primary" : "text-muted-foreground"}`}
          >
            {icon}
            <span className="text-[10px] mt-1">{label}</span>
          </Link>
        ))}
      </div>
    </header>
  );
}
