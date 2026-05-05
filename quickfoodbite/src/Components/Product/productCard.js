// ProductCard.js
import { useEffect, useState } from "react";
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
    const [loading, setLoading] = useState(false);
    const quantity = 1;

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
  getSingleProduct(id);
}, [getSingleProduct, id]);
  const handleAddToCart = () => {
    setLoading(true);
      const productDetails = {
        id,
        name,
        price,
        quantity : 1,
        category,
        type,
        discount
        
      };
     try {
    addToCart(productDetails);
   
  } catch (error) {
    toast.error("Failed to add");
  } finally {
    setTimeout(() => {
      setLoading(false);
    }, 300); // small delay for better UX
  }
  
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
  disabled={loading}
>
  {loading ? "Adding..." : "Add to Cart"}
</Button>
        </div>

      </Card.Body>
    </Card>
  );
};

export default ProductCard;
