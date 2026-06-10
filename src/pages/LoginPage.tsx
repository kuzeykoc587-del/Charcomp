import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../contexts/AuthContext";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Swords, Loader2 } from "lucide-react";
import { useToast } from "../hooks/use-toast";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { signIn, signUp } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        if (!name.trim()) { toast({ title: "Error", description: "Name required", variant: "destructive" }); setLoading(false); return; }
        await signUp(email, password, name.trim());
      }
      setLocation("/");
    } catch (err: any) {
      const msg = err?.code === "auth/invalid-credential" || err?.code === "auth/wrong-password"
        ? "Invalid email or password."
        : err?.code === "auth/email-already-in-use"
        ? "Email already in use."
        : err?.code === "auth/weak-password"
        ? "Password should be at least 6 characters."
        : err?.message ?? "Something went wrong.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

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

          <div className="flex gap-1 mb-8 bg-muted p-1 rounded-lg">
            <button
              className={`flex-1 py-2 font-bold rounded-md transition-all text-sm ${isLogin ? "bg-background shadow text-primary" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-2 font-bold rounded-md transition-all text-sm ${!isLogin ? "bg-background shadow text-primary" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setIsLogin(false)}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label>Username</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="OtakuKing" required />
              </div>
            )}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" required />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>

            <Button type="submit" className="w-full mt-4 gap-2" size="lg" disabled={loading}>
              {loading && <Loader2 size={16} className="animate-spin" />}
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
