import { CHARACTERS } from "../data/characters";
import { CharacterCard } from "./CharacterCard";

interface CharacterPickerProps {
  selectedCharacterId: string;
  onSelect: (id: string) => void;
}

export function CharacterPicker({ selectedCharacterId, onSelect }: CharacterPickerProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {CHARACTERS.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          selected={character.id === selectedCharacterId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
