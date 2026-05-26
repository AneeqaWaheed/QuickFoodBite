// ProductCard.js
import { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useCart } from "../../context/cart";
import { toast } from "react-toastify";
import "../../styles/menu.css";
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
  getSingleProduct();
}, []);
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
  <Card className="food-card">

  <div className="food-tag">
    {category}
  </div>

  <h3 className="food-title">
    {name}
  </h3>

  <p className="food-desc">
    Delicious fresh food made with quality ingredients.
  </p>

  <div className="food-price">
    Rs. {price}
  </div>

  <Button
    className="cart-action"
    onClick={handleAddToCart}
  >
    Add to Cart
  </Button>

</Card>
//   <Card
//     className="w-100 h-100 shadow-sm product-card"
//    style={{
//   borderRadius: "16px",
//   overflow: "hidden",
//   border: "5px solid rgba(236, 16, 38, 0.18)",
//   boxShadow: "0 4px 14px rgba(243, 12, 35, 0.12)",
//   transition: "all 0.3s ease",
// }}
//   >
//     <Card.Body
//       className="d-flex flex-column"
//       style={{
//         padding: "clamp(12px, 2vw, 20px)",
//       }}
//     >

//       {/* Product Name */}
//       <Card.Title
//         style={{
//           fontWeight: "700",
//           fontSize: "clamp(14px, 2vw, 20px)",
//           lineHeight: "1.3",
//           marginBottom: "10px",
//           wordBreak: "break-word",
//         }}
//       >
//         {name}
//       </Card.Title>

//       {/* Price */}
//       <Card.Text
//         style={{
//           color: "#dc3545",
//           fontWeight: "600",
//           fontSize: "clamp(14px, 2vw, 22px)",
//           marginBottom: "15px",
//         }}
//       >
//         Rs. {price}
//       </Card.Text>

//       {/* Spacer */}
//       <div className="mt-auto">

//         <Button
//           variant="danger"
//           className="w-100"
//           onClick={handleAddToCart}
//           disabled={loading}
//           style={{
//             borderRadius: "12px",
//             padding: "clamp(8px, 1.5vw, 12px)",
//             fontSize: "clamp(12px, 1.8vw, 16px)",
//             fontWeight: "600",
//             border: "none",
//           }}
//         >
//           {loading ? "Adding..." : "Add to Cart"}
//         </Button>

//       </div>

//     </Card.Body>
//   </Card>
);
};

export default ProductCard;
