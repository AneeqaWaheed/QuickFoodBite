import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { FaHeart, FaPlus } from "react-icons/fa";
import { useCart } from "../../context/cart";
import { toast } from "react-toastify";
import "../../styles/menu.css";
import axios from "axios";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const { name, price, image } = product;

  const [id, setId] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [orderType, setOrderType] = useState(false);

  // Get single product
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/single-product/${product._id}`
      );
      
      setId(data?.product?._id);
      setCategory(data?.product?.category?.name);
      setType(data?.product?.type);
      setDiscount(data?.product?.discount);
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
      quantity: 1,
      category,
      type,
      discount,
    };

    try {
      addToCart(productDetails);
    } catch (error) {
      toast.error("Failed to add");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  return (
    <Card className="food-card">
      {/* Product Image */}
      <div className="food-image-container">
        <img src={image} alt={name} className="food-image" />

        <button
          type="button"
          className={`food-favorite ${isFavorite ? "active" : ""}`}
          aria-label="Add to favorites"
          onClick={() => setIsFavorite((prev) => !prev)}
        >
          <FaHeart size={12} />
        </button>
      </div>

      <div className="food-card-body">
        {/* Product Name */}
        <h3 className="food-title">{name}</h3>

        {/* Category */}
        {category && <p className="food-category">{category}</p>}

        {/* Price + Add */}
        <div className="food-footer">
          <span className="food-price">Rs. {price}</span>

          <button
            className="food-add-btn"
            onClick={handleAddToCart}
            disabled={loading}
          >
            <FaPlus size={10} />
            {loading ? "Adding" : "Add"}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;