import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../contexts/AuthContext";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Swords, Loader2, ExternalLink } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useTranslation } from "../contexts/LanguageContext";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        if (!name.trim()) {
          toast({ title: "Error", description: "Name is required.", variant: "destructive" });
          return;
        }
        await signUp(email, password, name.trim());
      }
      setLocation("/");
    } catch (err: any) {
      console.error("[CharComp] Auth error:", err);
      const code = err?.code ?? "";
      const msg =
        code === "auth/invalid-credential" ||
        code === "auth/wrong-password" ||
        code === "auth/user-not-found"
          ? "Invalid email or password."
          : code === "auth/email-already-in-use"
          ? "This email is already registered."
          : code === "auth/weak-password"
          ? "Password must be at least 6 characters."
          : code === "auth/invalid-email"
          ? "Please enter a valid email address."
          : code === "auth/too-many-requests"
          ? "Too many attempts. Please try again later."
          : code === "auth/unauthorized-domain"
          ? "This domain is not authorized in Firebase. Add it to Firebase Console → Authentication → Authorized Domains."
          : err?.message ?? "Something went wrong. Please try again.";
      toast({ title: "Sign-in failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      // signInWithGoogle uses signInWithRedirect — the browser will navigate
      // to Google and come back. Show a redirecting message.
      setRedirecting(true);
    } catch (err: any) {
      console.error("[CharComp] Google sign-in error:", err);
      const code = err?.code ?? "";
      if (
        code !== "auth/popup-closed-by-user" &&
        code !== "auth/cancelled-popup-request"
      ) {
        const msg =
          code === "auth/unauthorized-domain"
            ? "Your domain is not authorized. Add it in Firebase Console → Authentication → Authorized Domains, then redeploy."
            : err?.message ?? "Google sign-in failed. Please try again.";
        toast({ title: "Google Sign-In failed", description: msg, variant: "destructive" });
      }
      setGoogleLoading(false);
    }
  };

  if (redirecting) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background gap-4">
        <div className="flex items-center gap-2 font-black text-2xl text-primary">
          <Swords size={28} />
          <span>CharComp</span>
        </div>
        <Loader2 className="animate-spin text-primary" size={24} />
        <p className="text-muted-foreground text-sm">Redirecting to Google…</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/20 pb-20 md:pb-0">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-card p-8 rounded-2xl border shadow-xl w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 font-black text-2xl text-primary">
              <Swords size={28} /> CharComp
            </div>
          </div>

          {/* Login / Register tabs */}
          <div className="flex gap-1 mb-6 bg-muted p-1 rounded-lg">
            <button
              className={`flex-1 py-2 font-bold rounded-md transition-all text-sm ${
                isLogin
                  ? "bg-background shadow text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setIsLogin(true)}
            >
              {t("auth_login")}
            </button>
            <button
              className={`flex-1 py-2 font-bold rounded-md transition-all text-sm ${
                !isLogin
                  ? "bg-background shadow text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setIsLogin(false)}
            >
              {t("auth_register")}
            </button>
          </div>

          {/* Google Sign-In */}
          <Button
            type="button"
            variant="outline"
            className="w-full gap-3 mb-4 h-11"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
          >
            {googleLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                  fill="#4285F4"
                />
                <path
                  d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                  fill="#34A853"
                />
                <path
                  d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
                  fill="#FBBC05"
                />
                <path
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"
                  fill="#EA4335"
                />
              </svg>
            )}
            {googleLoading ? "Connecting…" : t("auth_continue_google")}
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">{t("auth_or")}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Email / Password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label>{t("auth_username")}</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="OtakuKing"
                  required
                  autoComplete="name"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>{t("auth_email")}</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
                autoComplete={isLogin ? "email" : "new-email"}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("auth_password")}</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-4 gap-2"
              size="lg"
              disabled={loading || googleLoading}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {isLogin ? t("auth_login") : t("auth_register")}
            </Button>
          </form>

          {/* Helper note about Google */}
          <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1">
            Google sign-in requires your domain in{" "}
            <a
              href="https://console.firebase.google.com/project/character-clash-c7025/authentication/settings"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground inline-flex items-center gap-0.5"
            >
              Firebase Auth settings <ExternalLink size={10} />
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
