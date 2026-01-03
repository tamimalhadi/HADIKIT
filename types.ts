
export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Football' | 'Basketball' | 'Baseball' | 'Classic';
  description: string;
  image: string;
  colors: string[];
  sizes: string[];
  isNew?: boolean;
  isPopular?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

export interface UserPreferences {
  favoriteCategory?: string;
  budgetRange?: [number, number];
}
