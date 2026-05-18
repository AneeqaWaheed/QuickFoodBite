import { useState, useEffect } from "react";
import Layout from "../Components/Layout/Layout";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import ProductsList from "./ProductList";
import { Link } from "react-router-dom";
import "../styles/menu.css";
import {
  FaPizzaSlice,
  FaHamburger,
  FaIceCream,
  FaCoffee,
  FaFish,
  FaDrumstickBite,
  FaCookie,
  FaUtensils,
} from "react-icons/fa";
const Menu = () => {
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
const categoryIcons = [
  <FaPizzaSlice />,
  <FaHamburger />,
  <FaIceCream />,
  <FaCoffee />,
  <FaFish />,
  <FaDrumstickBite />,
  <FaCookie />,
  <FaUtensils />,
];
  // ---------------- CATEGORIES ----------------
  const fetchCategories = async () => {
    setCategoryLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load categories");
      }

      setCategories(data?.category || []);

    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error(error.message || "Category load failed");
    } finally {
      setCategoryLoading(false);
    }
  };

  // ---------------- PRODUCTS ----------------
  const fetchProducts = async () => {
    setLoading(true);

    try {
      const url = `${process.env.REACT_APP_API}/api/v1/product/product-list?page=${page}&category=${selectedCategory}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "API error");
      }

      setProducts(data?.products || []);
      setTotalPages(data?.totalPages || 1);

    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategory]);

  // ---------------- CATEGORY CHANGE ----------------
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
  };

  return (
    <Layout title="Menu - QuickFoodBite">
<div
  style={{
    display: "flex",
    width: "100%",
    minHeight: "100vh",
    paddingRight: "clamp(10px, 3vw, 40px)",
    boxSizing: "border-box",
  }}
>
  {/* LEFT CATEGORY SIDEBAR */}
  <div
    style={{
      width: "clamp(90px, 20vw, 220px)",
      padding: "12px",
      flexShrink: 0,
      overflowY: "auto",
    }}
  >
    

    <div className="d-flex flex-column gap-2">
      {categories.map((category, index) => (
  <Button
    key={category._id || category.name}
    onClick={() => handleCategoryChange(category.name)}
    variant={
      selectedCategory === category.name
        ? "danger"
        : "light"
    }
    className="rounded-pill text-start d-flex align-items-center gap-2"
    style={{
      fontSize: "clamp(11px, 1.8vw, 15px)",
      padding: "8px 12px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      border: "none",
      boxShadow: "none",
    }}
  >
    <span
  className="category-icon"
  style={{ fontSize: "16px" }}
>
  {categoryIcons[index % categoryIcons.length]}
</span>

    <span>{category.name}</span>
  </Button>
))}
    </div>
  </div>

  {/* RIGHT PRODUCTS SECTION */}
 <div
  style={{
    flex: 1,
    padding: "clamp(12px, 3vw, 32px)",
    paddingRight: "clamp(16px, 5vw, 48px)",
    overflow: "hidden",
  }}
>
    <div className="my-4 w-100">
      {loading ? (
        <p className="text-center mt-5 text-danger">Loading products...</p>
      ) : (
        <>
    
  {/* CATEGORY TITLE */}
 <div className="mb-3 text-center">
  <h4
    style={{
      fontWeight: "600",
      fontSize: "clamp(18px, 2vw, 28px)",
      display: "inline-block",
    }}
    className="text-danger"
  >
    {selectedCategory || "All Products"}
  </h4>
</div>

  <ProductsList products={products} />

  {/* PAGINATION */}
          <div className="d-flex justify-content-center mt-4 flex-wrap gap-2">
            <Button
              variant="danger"
              onClick={() =>
                setPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={page === 1}
            >
              Previous
            </Button>

            <span className="align-self-center">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="danger"
              onClick={() =>
                setPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  </div>
</div>

    </Layout>
  );
};

export default Menu;