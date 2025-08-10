import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface FavoriteJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  dateAdded: Date;
  type: 'job' | 'profile' | 'company';
}

interface FavoritesContextType {
  favorites: FavoriteJob[];
  addToFavorites: (item: Omit<FavoriteJob, 'dateAdded'>) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
  getFavoritesByType: (type: 'job' | 'profile') => FavoriteJob[];
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteJob[]>(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('jobequal-favorites');
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        return parsed.map((fav: any) => ({
          ...fav,
          dateAdded: new Date(fav.dateAdded)
        }));
      } catch (error) {
        console.error('Error parsing saved favorites:', error);
        return [];
      }
    }
    return [];
  });

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('jobequal-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (item: Omit<FavoriteJob, 'dateAdded'>) => {
    const newFavorite: FavoriteJob = {
      ...item,
      dateAdded: new Date()
    };
    
    setFavorites(prev => {
      // Check if already exists
      if (prev.some(fav => fav.id === item.id)) {
        return prev;
      }
      return [...prev, newFavorite];
    });
  };

  const removeFromFavorites = (id: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.some(fav => fav.id === id);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const getFavoritesByType = (type: 'job' | 'profile') => {
    return favorites.filter(fav => fav.type === type);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      clearFavorites,
      getFavoritesByType
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
