import React, { useState, useEffect } from "react";
import Layout from "../Components/Layout/Layout";
import { Button } from "react-bootstrap"; // Import Button from react-bootstrap
import { toast } from "react-toastify";
import ProductsList from "./ProductList";
import { Link } from "react-router-dom";
import "../styles/menu.css";

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Total pages from the backend
const styles = {
  categoryScroll: {
    display: "flex",
    flexWrap: "nowrap",
    overflowX: "auto",
    gap: "0.5rem",
    justifyContent: "center",
    // Scrollbar hiding works only via CSS, not JS inline
    msOverflowStyle: "none", // IE & Edge
    scrollbarWidth: "none",   // Firefox
  },
};
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.React_App_API}/api/v1/category/get-category`
        );
        const data = await response.json();
        console.log("Categories:", data?.category);
        setCategories(data?.category);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${
            process.env.React_App_API
          }/api/v1/product/product-list?page=${page}&category=${
            selectedCategory === "All" ? "" : selectedCategory
          }`
        );

        const data = await response.json();
        console.log("Products:", data);
        if (data?.success) {
          setProducts(data.products || []);
          setTotalPages(data.totalPages || 1); // Assuming your backend returns total pages
        } else {
          toast.error("Failed to load products.");
        }
      } catch (error) {
        console.error("API Error:", error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [page, selectedCategory]); // Fetch when page or selected category changes

  // Handle category filter
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1); // Reset to the first page when category changes
  };

  return (
    <Layout title="Menu - QuickFoodBite">
  
  <div className="text-center">
  
    <div
  className="mb-4 mt-0"
  style={{
    display: "flex",
    overflowX: "auto",
    gap: "0.5rem",
    padding: "0 10px", // optional, some padding from edges
    msOverflowStyle: "none",
    scrollbarWidth: "none",
  }}
>
  <Link
    onClick={() => handleCategoryChange("All")}
    className={`btn ${
      selectedCategory === "All"
        ? "btn-danger text-white"
        : "btn-outline-secondary"
    } rounded-pill flex-shrink-0`}
  >
    All
  </Link>

  {categories.map((category) => (
    <Link
      key={category.id}
      onClick={() => handleCategoryChange(category.name)}
      className={`btn ${
        selectedCategory === category.name
          ? "btn-danger text-white"
          : "btn-outline-secondary"
      } rounded-pill flex-shrink-0`}
    >
      {category.name}
    </Link>
  ))}
</div>

{/* Internal CSS to hide scrollbar */}
<style>
  {`
    .category-scroll::-webkit-scrollbar {
      display: none;
    }
  `}
</style>

    {/* Products list */}
    <div className="my-4 w-100">
      {loading ? (
        <p className="text-center mt-5">Loading products...</p>
      ) : (
        <>
          <ProductsList products={products} />

          {/* Pagination Controls */}
          <div className="d-flex justify-content-center mt-4">
            <Button
              variant="danger"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="mx-3 align-self-center">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="danger"
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, totalPages))
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

    </Layout>
  );
};

export default Menu;
