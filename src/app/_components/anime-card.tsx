type AnimeCardProps = {
    anime: {
      id: string;
      title: string;
      year: number | null;
      genre: string[];
      image: string | null;
    };
  };
  
  export function AnimeCard({ anime }: AnimeCardProps) {
    const year = anime.year ?? "Не указан";
    const imageUrl = anime.image ? `/images/${anime.image}` : '/images/no.jpg';
    return (
      <div className="rounded-2xl shadow-md overflow-hidden bg-white hover:shadow-lg transition">
        <img src={imageUrl} alt={anime.title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-semibold">{anime.title}</h3>
          <p className="text-sm text-gray-500">{year}</p>
          <div className="mt-2 text-xs text-gray-600">
            {anime.genre.join(", ")}
          </div>
        </div>
      </div>
    );
  }