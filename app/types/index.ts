export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
}

export interface CategoryCardProps {
  id: string;
  name: string;
  image?: string;
  description?: string;
}

