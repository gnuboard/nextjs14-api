// src/app/(commerce)/products/item/[id]/page.js

"use client";

import { useEffect, useState } from 'react';

const ProductItemPage = ({ params }) => {
  const { id } = params;

  const [productData, setProductData] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch product data based on the id parameter
      // This is just an example. Replace with your actual data fetching logic.
      const fetchProductData = async () => {
        // Example: Fetch data from an API based on the id
        // const response = await fetch(`/api/products/item/${id}`);
        // const data = await response.json();
        const data = { name: `Product Item ${id}`, description: `This is product item with ID ${id}` };
        setProductData(data);
      };

      fetchProductData();
    }
  }, [id]);

  if (!productData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{productData.name}</h1>
      <p>{productData.description}</p>
    </div>
  );
};

export default ProductItemPage;
