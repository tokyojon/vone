import React from 'react';
import CharacterCard from './CharacterCard';

interface Character {
  id: string;
  name: string;
  imageUrl: string;
}

interface CharacterGridProps {
  characters: Character[];
}

const CharacterGrid: React.FC<CharacterGridProps> = ({ characters }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {characters.map((character) => (
        <CharacterCard key={character.id} name={character.name} imageUrl={character.imageUrl} />
      ))}
    </div>
  );
};

export default CharacterGrid;
