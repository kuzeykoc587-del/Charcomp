import type { Character } from "../lib/db";

interface CharacterCardProps {
  character: Character;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function CharacterCard({ character, onClick, className = "", disabled = false }: CharacterCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative flex flex-col group overflow-hidden rounded-2xl border-2 border-transparent transition-all duration-300 w-full ${
        !disabled ? "cursor-pointer hover:border-primary hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20" : "opacity-80"
      } ${className}`}
      data-testid={`card-character-${character.id}`}
    >
      <div className="aspect-[3/4] w-full bg-muted relative">
        <img
          src={character.image}
          alt={character.name}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(character.name)}&background=7C3AED&color=fff&size=400&bold=true`; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-xl md:text-2xl leading-tight line-clamp-2 drop-shadow-md">
            {character.name}
          </h3>
        </div>
      </div>
    </button>
  );
}
