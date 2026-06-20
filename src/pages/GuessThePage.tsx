import { useState } from "react";
import { Header } from "../components/Header";
import { useTranslation } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { HelpCircle, CheckCircle2, XCircle, Trophy, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { useGuessTasks } from "../hooks/useFirestore";
import { guessTasksDb } from "../lib/db";

const POINTS = [100, 75, 50, 25, 25, 25];

export default function GuessThePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: tasks = [], isLoading } = useGuessTasks();

  const [taskIndex, setTaskIndex] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [taskScores, setTaskScores] = useState<number[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<Set<string>>(new Set());

  const currentTask = tasks[taskIndex];

  const handleAnswer = async (option: string) => {
    if (selected !== null || isCorrect) return;
    setSelected(option);

    const correct = option === currentTask.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      const pts = POINTS[Math.min(attempt, POINTS.length - 1)];
      setTotalScore(s => s + pts);
      setTaskScores(prev => [...prev, pts]);
      if (user) {
        guessTasksDb.incrementPlayCount(currentTask.id).catch(() => {});
      }
    } else {
      setWrongAnswers(prev => new Set([...prev, option]));
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
      setWrongAnswers(new Set());
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
    setWrongAnswers(new Set());
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
          <div className="bg-card border rounded-2xl p-8">
            <AlertCircle size={28} className="mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              Henüz hiç Guess The sorusu eklenmemiş. Admin panelinden soru ekleyebilirsiniz.
            </p>
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
                  <span className="text-xs font-medium truncate flex-1">Soru {i + 1}</span>
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

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-lg">

        {/* Header */}
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
          {POINTS.map((pts, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-colors ${i < attempt ? "bg-destructive/40" : i === attempt ? "bg-primary" : "bg-muted"}`}
            />
          ))}
          <span className="ml-2 text-xs font-bold text-primary">{currentPoints}p</span>
        </div>

        {/* Image */}
        <div className="relative rounded-2xl overflow-hidden mb-6 aspect-square bg-muted border">
          <img
            src={currentTask.imageUrl}
            alt="Guess what?"
            className={`w-full h-full object-cover transition-all duration-300 ${isCorrect === true ? "" : ""}`}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          {isCorrect === true && (
            <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm">
              <CheckCircle2 size={64} className="text-green-400" />
            </div>
          )}
          {isCorrect === false && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 backdrop-blur-sm">
              <XCircle size={64} className="text-red-400" />
            </div>
          )}
        </div>

        {/* Options */}
        {isCorrect !== true ? (
          <div className="grid grid-cols-1 gap-2">
            {currentTask.options.map((opt) => {
              const isWrong = wrongAnswers.has(opt);
              const isSelected = selected === opt;
              return (
                <button
                  key={opt}
                  onClick={() => !isWrong && handleAnswer(opt)}
                  disabled={isWrong}
                  className={`w-full py-3 px-4 rounded-xl border text-sm font-bold text-left transition-all
                    ${isWrong
                      ? "border-destructive/30 bg-destructive/10 text-destructive/50 cursor-not-allowed line-through"
                      : isSelected && isCorrect === false
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border hover:border-primary/50 hover:bg-primary/5 active:scale-[0.98]"
                    }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 mb-4">
              <CheckCircle2 className="mx-auto mb-1 text-green-400" size={24} />
              <p className="font-bold text-green-400">Doğru!</p>
              <p className="text-sm text-muted-foreground">{currentPoints} puan kazandın</p>
            </div>
            <Button onClick={nextTask} className="w-full">
              {taskIndex + 1 >= tasks.length ? "Sonuçları Gör" : "Sonraki Soru"}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
