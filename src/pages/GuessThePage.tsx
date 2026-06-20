import { useState } from "react";
import { Link } from "wouter";
import { Header } from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import {
  HelpCircle, CheckCircle2, XCircle, Trophy, RefreshCw,
  Loader2, AlertCircle, Plus
} from "lucide-react";
import { useGuessTasks } from "../hooks/useFirestore";
import { guessTasksDb } from "../lib/db";

const POINTS = [100, 75, 50, 25, 25, 25];

export default function GuessThePage() {
  const { user } = useAuth();
  const { data: tasks = [], isLoading } = useGuessTasks();

  const [taskIndex, setTaskIndex] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [taskScores, setTaskScores] = useState<number[]>([]);
  const [wrongIndexes, setWrongIndexes] = useState<Set<number>>(new Set());

  const currentTask = tasks[taskIndex];

  const handleAnswer = async (imgUrl: string, imgIndex: number) => {
    if (selected !== null || isCorrect) return;
    setSelected(imgUrl);

    const correctUrl = currentTask.images[currentTask.answerIndex];
    const correct = imgUrl === correctUrl;
    setIsCorrect(correct);

    if (correct) {
      const pts = POINTS[Math.min(attempt, POINTS.length - 1)];
      setTotalScore(s => s + pts);
      setTaskScores(prev => [...prev, pts]);
      if (user) {
        guessTasksDb.incrementPlayCount(currentTask.id).catch(() => {});
      }
    } else {
      setWrongIndexes(prev => new Set([...prev, imgIndex]));
      setTimeout(() => {
        setSelected(null);
        setIsCorrect(null);
        setAttempt(a => a + 1);
      }, 800);
    }
  };

  const nextTask = () => {
    if (taskIndex + 1 >= tasks.length) {
      setCompleted(true);
    } else {
      setTaskIndex(i => i + 1);
      setAttempt(0);
      setSelected(null);
      setIsCorrect(null);
      setWrongIndexes(new Set());
    }
  };

  const restart = () => {
    setTaskIndex(0);
    setAttempt(0);
    setSelected(null);
    setIsCorrect(null);
    setTotalScore(0);
    setTaskScores([]);
    setCompleted(false);
    setWrongIndexes(new Set());
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={28} />
        </main>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-10 max-w-lg text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <HelpCircle size={32} className="text-emerald-400" />
          </div>
          <h1 className="text-3xl font-black mb-2">Guess The</h1>
          <span className="inline-block mb-6 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            BETA
          </span>
          <div className="bg-card border rounded-2xl p-8 space-y-4">
            <AlertCircle size={28} className="mx-auto text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              Henüz hiç Guess The sorusu eklenmemiş.
            </p>
            {user && (
              <Link href="/create/guess-the">
                <Button className="gap-2 w-full">
                  <Plus size={16} /> Soru Ekle
                </Button>
              </Link>
            )}
          </div>
        </main>
      </div>
    );
  }

  if (completed) {
    const maxScore = tasks.length * 100;
    const pct = Math.round((totalScore / maxScore) * 100);
    return (
      <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-10 max-w-lg">
          <div className="bg-card border rounded-2xl p-8 text-center">
            <Trophy size={48} className="mx-auto mb-4 text-yellow-400" />
            <h2 className="text-3xl font-black mb-1">Bitti!</h2>
            <p className="text-muted-foreground text-sm mb-6">Toplam {tasks.length} soruyu tamamladın</p>

            <div className="bg-primary/10 rounded-2xl p-6 mb-6">
              <p className="text-5xl font-black text-primary">{totalScore}</p>
              <p className="text-sm text-muted-foreground mt-1">toplam puan</p>
              <div className="mt-3 w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">%{pct} başarı</p>
            </div>

            <div className="space-y-2 mb-6 text-left">
              {tasks.map((task, i) => (
                <div key={task.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50">
                  <span className="text-xs font-medium truncate flex-1">{task.title}</span>
                  <span className="text-sm font-bold text-primary ml-2">{taskScores[i] ?? 0} puan</span>
                </div>
              ))}
            </div>

            <Button onClick={restart} className="w-full gap-2">
              <RefreshCw size={16} />
              Tekrar Oyna
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const currentPoints = POINTS[Math.min(attempt, POINTS.length - 1)];
  const correctUrl = currentTask.images[currentTask.answerIndex];

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-lg">

        {/* Header bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <HelpCircle size={16} className="text-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400">Guess The</span>
              <span className="ml-2 px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px] font-bold rounded-full border border-emerald-500/30">BETA</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Soru</p>
              <p className="text-sm font-bold">{taskIndex + 1}/{tasks.length}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Puan</p>
              <p className="text-sm font-bold text-primary">{totalScore}</p>
            </div>
          </div>
        </div>

        {/* Attempt indicator */}
        <div className="flex items-center gap-1 mb-4">
          {POINTS.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-colors ${i < attempt ? "bg-destructive/40" : i === attempt ? "bg-primary" : "bg-muted"}`}
            />
          ))}
          <span className="ml-2 text-xs font-bold text-primary">{currentPoints}p</span>
        </div>

        {/* Question */}
        <div className="bg-card border rounded-2xl p-4 mb-5 text-center">
          <p className="text-xs text-muted-foreground mb-1">Hangisi bu karakterdir?</p>
          <p className="text-xl font-black">{currentTask.title}</p>
        </div>

        {/* Image options grid */}
        <div className={`grid gap-3 mb-4 ${currentTask.images.length <= 2 ? "grid-cols-2" : currentTask.images.length <= 4 ? "grid-cols-2" : "grid-cols-3"}`}>
          {currentTask.images.map((img, idx) => {
            const isWrong = wrongIndexes.has(idx);
            const isSelectedThis = selected === img;
            const isCorrectOne = img === correctUrl;

            return (
              <button
                key={idx}
                onClick={() => !isWrong && !isCorrect && handleAnswer(img, idx)}
                disabled={isWrong || isCorrect === true}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  isWrong
                    ? "border-destructive/40 opacity-40 cursor-not-allowed"
                    : isCorrect === true && isCorrectOne
                    ? "border-green-500 ring-2 ring-green-500/40"
                    : isSelectedThis && isCorrect === false
                    ? "border-destructive"
                    : "border-border hover:border-primary/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                }`}
              >
                <img
                  src={img}
                  alt={`Option ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.3"; }}
                />
                {isCorrect === true && isCorrectOne && (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500/30 backdrop-blur-sm">
                    <CheckCircle2 size={36} className="text-green-400" />
                  </div>
                )}
                {isWrong && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
                    <XCircle size={24} className="text-red-400/70" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Correct feedback + Next button */}
        {isCorrect === true && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-500" />
              <div>
                <p className="text-sm font-bold text-green-500">Doğru!</p>
                <p className="text-xs text-muted-foreground">+{currentPoints} puan</p>
              </div>
            </div>
            <Button size="sm" onClick={nextTask} className="gap-1">
              {taskIndex + 1 >= tasks.length ? "Bitti →" : "Sonraki →"}
            </Button>
          </div>
        )}

        {/* Create link */}
        {user && isCorrect !== true && (
          <div className="text-center mt-4">
            <Link href="/create/guess-the">
              <span className="text-xs text-muted-foreground hover:text-primary transition-colors">
                + Yeni tahmin sorusu ekle
              </span>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
