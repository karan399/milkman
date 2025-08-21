import { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Besan Ladoo',
    description: 'Round ladoos made with roasted gram flour, ghee, and sugar, full of cardamom aroma.',
    price: 260,
    image: '/images/BesanLadoo.jpg',
    category: 'Traditional',
    rating: 4.8,
    unit: 'per Kg',
    popular: true
  },
  {
    id: 2,
    name: 'Bundi Ladoo',
    description: 'Soft sweet balls made from tiny fried boondi soaked in sugar syrup.',
    price: 240,
    image: '/images/bundi.jpg',
    category: 'Traditional',
    rating: 4.8,
    unit: 'per Kg',
    popular: true
  },
  {
    id: 3,
    name: 'Jodhpuri Ladoo',
    description: 'Royal Rajasthani ladoos made with boondi, pure ghee, and rich dry fruits.',
    price: 300,
    image: '/images/jodhpuriLadoo.jpg',
    category: 'Traditional',
    rating: 4.8,
    unit: 'per Kg',
    popular: true
  },
  {
    id: 4,
    name: 'Milk Cake',
    description: 'Slow-cooked milk sweet with a soft, grainy texture and a light caramel taste.',
    price: 540,
    image: '/images/MilkCake.jpg',
    category: 'Traditional',
    rating: 4.8,
    unit: 'per Kg',
    popular: true
  },
  {
    id: 5,
    name: 'Barfi',
    description: 'Soft milk-based sweet topped with nuts or silver leaf for extra taste',
    price: 480,
    image: '/images/barfi.jpg',
    category: 'Traditional',
    rating: 4.8,
    unit: 'per Kg',
    popular: true
  },
  {
    id: 6,
    name: 'Doda Barfi',
    description: 'Rich Punjabi-style barfi made with milk, ghee, sugar, and nuts, with a chewy, grainy texture.',
    price: 460,
    image: '/images/DodaBarfi.jpg',
    category: 'Traditional',
    rating: 4.8,
    unit: 'per Kg',
    popular: true
  },
  {
    id: 7,
    name: 'Rewari Barfi',
    description: 'Barfi mixed with crunchy sesame seeds for a nutty and sweet flavor',
    price: 450,
    image: '/images/RewariBarfi.jpg',
    category: 'Traditional',
    rating: 4.8,
    unit: 'per Kg',
    popular: true
  },
  {
    id: 8,
    name: 'Kaju Katli',
    description: 'Thin diamond-shaped sweet made from cashew paste, sugar, and ghee, often topped with silver leaf.',
    price: 950,
    image: '/images/KajuKatli.jpg',
    category: 'Traditional',
    rating: 4.8,
    unit: 'per Kg',
    popular: true
  },
  {
    id: 9,
    name: 'Cham Cham',
    description: 'Soft oval-shaped Bengali sweet made from chhena, stuffed with mawa or coconut and soaked in sugar syrup.',
    price: 480,
    image: '/images/ChamCham.jpg',
    category: 'Traditional',
    rating: 4.8,
    unit: 'per Kg',
    popular: true
  },
  {
    id: 10,
    name: 'Kalakand',
    description: 'Rich milk-based sweet with a grainy texture and subtle cardamom flavor',
    price: 580,
    image: '/images/Kalakand.jpg',
    category: 'Traditional',
    rating: 4.8,
    unit: 'per Kg',
    popular: true
  },
  {
    id: 11,
    name: 'Rasgulla',
    description: 'Soft, spongy balls made from fresh chhena, boiled in light sugar syrup.',
    price: 300,
    image: '/images/Rasgulla .jpg',
    category: 'Traditional',
    rating: 4.8,
    unit: 'per Kg',
    popular: true
  },
  {
    id: 12,
    name: 'Sponch',
    description: 'Soft and fluffy sponge-like sweet soaked in sugar syrup for a juicy bite.',
    price: 25,
    image: '/images/Sponch.jpg',
    category: 'Traditional',
    rating: 4.8,
    unit: 'per piece',
    popular: true
  },
  {
    id: 13,
    name: 'Rasmalai',
    description: 'Flat, soft paneer discs soaked in sweet, thickened saffron milk.',
    price: 30,
    image: '/images/Rasmalai.jpg',
    category: 'Traditional',
    rating: 4.8,
    unit: 'per piece',
    popular: true
  },
  {
    id: 14,
    name: 'Gulab Jamun',
    description: 'Soft, spongy balls made from milk solids, deep-fried and soaked in rose-flavored sugar syrup',
    price: 350,
    image: '/images/GulabJamun.jpg',
    category: 'Traditional',
    rating: 4.8,
    unit: 'per Kg',
    popular: true
  },
  // Premium category removed
  // Dairy Category (previously Festival)
  {
    id: 19,
    name: 'Cow milk',
    description: 'Fresh and pure cow’s milk, light and healthy for everyday use.',
    price: 75,
    image: '/images/CowMilk.png',
    category: 'Dairy',
    rating: 4.7,
    unit: 'per liter',
    popular: true
  },
  {
    id: 20,
    name: 'Buffalo Milk',
    description: 'Thick, creamy buffalo milk, rich in taste and nutrition.',
    price: 80,
    image: '/images/BuffaloMilk.png',
    category: 'Dairy',
    rating: 4.6,
    unit: 'per liter',
    popular: true
  },
  {
    id: 21,
    name: 'Amul Cream',
    description: 'Smooth, fresh cream to make your curries and desserts richer.',
    price: "MRP",
    image: '/images/AmulCream.jpg',
    category: 'Dairy',
    rating: 4.8,
    unit: 'per packet',
    popular: true
  },
  {
    id: 22,
    name: 'Butter',
    description: 'Soft, creamy butter that makes everything melt-in-the-mouth.',
    price: "MRP",
    image: '/images/Butter.jpg',
    category: 'Dairy',
    rating: 4.7,
    unit: 'per packet',
    popular: true
  },
  {
    id: 23,
    name: 'Desi Ghee',
    description: 'Pure desi ghee that adds richness and traditional flavor to your food.',
    price: 1400,
    image: '/images/Ghee.jpg',
    category: 'Dairy',
    rating: 4.8,
    unit: 'per liter',
    popular: true
  },
  {
    id: 24,
    name: 'Nuni Ghee',
    description: 'Authentic homemade-style ghee with a natural aroma.',
    price: 1000,
    image: '/images/Nonighee.jpg',
    category: 'Dairy',
    rating: 4.6,
    unit: 'per Kg',
    popular: true
  },
  {
    id: 25,
    name: 'Dahi',
    description: 'Thick and fresh dahi, perfect for daily meals and cooling the stomach.',
    price: 100,
    image: '/images/Dahi.jpg',
    category: 'Dairy',
    rating: 4.6,
    unit: 'per liter',
    popular: true
  },
  {
    id: 26,
    name: 'Butter Milk',
    description: 'Refreshing and light, the perfect drink to keep you cool.',
    price: 30,
    image: '/images/ButterMilk.jpg',
    category: 'Dairy',
    rating: 4.6,
    unit: 'per liter',
    popular: true
  },
  {
    id: 27,
    name: 'Khoya',
    description: 'Traditional, rich khoya for preparing your favorite mithais at home.',
    price: 480,
    image: '/images/Khoya.jpg',
    category: 'Dairy',
    rating: 4.6,
    unit: 'per Kg',
    popular: true
  },
  {
    id: 28,
    name: 'Paneer',
    description: 'Soft and fresh paneer that makes every curry and snack delicious.',
    price: 350,
    image: '/images/paneer.jpg',
    category: 'Dairy',
    rating: 4.6,
    unit: 'per Kg',
    popular: true
  },
  {
    id: 29,
    name: 'Chaap',
    description: 'Protein-packed chaap, great for tandoori or curry dishes.',
    price: 80,
    image: '/images/Chaap.png',
    category: 'Dairy',
    rating: 4.6,
    unit: 'per packet',
    popular: true
  },
  {
    id: 30,
    name: 'Peas',
    description: 'Sweet and fresh peas that bring flavor to every meal.',
    price: 160,
    image: '/images/Peas.jpg',
    category: 'Dairy',
    rating: 4.6,
    unit: 'per kg',
    popular: true
  }
];