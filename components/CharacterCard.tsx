import React from 'react';

interface CharacterCardProps {
  name: string;
  imageUrl: string;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ name, imageUrl }) => {
  return (
    <div className="max-w-xs bg-white shadow-lg rounded-lg overflow-hidden my-4">
      <img className="w-full h-56 object-cover object-center" src={imageUrl} alt={name} />
      <div className="py-4 px-6">
        <h1 className="text-2xl font-semibold text-gray-800">{name}</h1>
      </div>
    </div>
  );
};

export default CharacterCard;
