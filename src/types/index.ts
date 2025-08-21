export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  unit: string;
  popular: boolean;
  customGiftBox?: boolean;
  selectedSweets?: Array<{
    product: Product;
    quantity: number;
  }>;
}