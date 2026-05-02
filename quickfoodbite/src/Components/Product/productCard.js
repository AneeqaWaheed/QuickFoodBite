// ProductCard.js
import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCart } from "../../context/cart";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import axios from "axios";
const ProductCard = ({ product }) => {
   const { addToCart } = useCart(); 
  const { name, price, } = product;
   const params = useParams();
  console.log("asbndasdnasm", product);
  //  const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [id, setId] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [discount, setDiscount] = useState("");
    const [quantity, setQuantity] = useState(1);
  // const shortDesc = description.split(" ").slice(0, 10).join(" ");
    const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.React_App_API}/api/v1/product/single-product/${product._id}`
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
    <Link
      
      style={{
        textDecoration: "none",
      }}
    >
      <Card className="m-1" style={{ width: "22rem", marginRight: "3px" }}>
        
        <Card.Body className="text-start">
          <Card.Title style={{ fontSize: "20px", fontWeight: "bold" }}>{name}</Card.Title>
          {/* <Card.Text>{shortDesc}</Card.Text> */}
       <Card.Text style={{ color: "rgb(225, 29, 72)", fontSize: "20px" }}>
  Rs. {price}
</Card.Text>

          <Button variant="danger" className="w-100" onClick={handleAddToCart}>Order Now</Button>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default ProductCard;
