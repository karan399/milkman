import React from 'react';
import CategoryPage from './CategoryPage';

const DairyPage: React.FC = () => {
  return (
    <CategoryPage
      category="Dairy"
      categoryTitle="Dairy Delights"
      categoryDescription="Fresh, rich, and creamy dairy essentials: milk, paneer, ghee, and more."
      categoryImage="/images/DairyProducts.jpg"
      itemLabelPlural="products"
    />
  );
};

export default DairyPage;
