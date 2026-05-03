// ProductCard.js
import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useCart } from "../../context/cart";
import { toast } from "react-toastify";

import axios from "axios";
const ProductCard = ({ product }) => {
   const { addToCart } = useCart(); 
  const { name, price, } = product;
    const [id, setId] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [discount, setDiscount] = useState("");
    const [quantity, setQuantity] = useState(1);
  // const shortDesc = description.split(" ").slice(0, 10).join(" ");
    const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/single-product/${product._id}`
      );
      
      setId(data?.product?._id);
      // setDescription(data?.product?.description);
     
      setCategory(data?.product?.category.name);
      setType(data?.product?.type);
      setDiscount(data?.product?.discount);
      // setImage(data?.product?.image);
    } catch (error) {
      console.log("error ", error);
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, []);
  const handleAddToCart = () => {
      const productDetails = {
        id,
        name,
        price,
        quantity : 1,
        category,
        type,
        discount
        
      };
      addToCart(productDetails); // Add product details to cart context
      toast.success(`Added ${quantity} of ${name} to the cart`);
      console.log(`Added ${quantity} of ${name} to the cart`);
    };
  
  return (
    <Card className="w-100 h-100 shadow-sm border-0 product-card">
      <Card.Body className="d-flex flex-column">
        
        {/* Product Name */}
        <Card.Title className="fw-bold fs-6 fs-md-5">
          {name}
        </Card.Title>

        {/* Price */}
        <Card.Text className="text-danger fs-5 mb-2">
          Rs. {price}
        </Card.Text>

        {/* Spacer */}
        <div className="mt-auto">
          <Button
            variant="danger"
            className="w-100"
            onClick={handleAddToCart}
          >
            Order Now
          </Button>
        </div>

      </Card.Body>
    </Card>
  );
};

export default ProductCard;
