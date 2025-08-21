import React from 'react';
import CategoryPage from './CategoryPage';

const TraditionalPage: React.FC = () => {
  return (
    <CategoryPage
      category="Traditional"
      categoryTitle="Traditional Sweets"
      categoryDescription="Experience the authentic taste of classic Indian sweets that have been cherished for generations. From the melt-in-your-mouth Gulab Jamun to the delicate Rasgulla, each sweet tells a story of tradition and craftsmanship."
      categoryImage="/images/Traditional.png"
    />
  );
};

export default TraditionalPage;
