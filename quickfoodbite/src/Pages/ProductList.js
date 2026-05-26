// ProductsList.js
import { Container, Row, Col } from "react-bootstrap";
import ProductCard from "../Components/Product/productCard";

import "../styles/menu.css";
const ProductsList = ({ products }) => {
  // Check if products list is empty
  if (products.length === 0) {
    return <p className="text-center mt-5">No products found.</p>;
  }

  return (
     <div className="products-grid">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
        />
      ))}
    </div>
  );
};

export default ProductsList;
