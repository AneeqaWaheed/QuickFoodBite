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
import { useSearch } from "../context/seacrh";
const Menu = () => {
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
    const { searchQuery } = useSearch();

  console.log("SEARCH:", searchQuery);
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
const filteredProducts = products.filter((item) => {
  const name = item?.name?.toLowerCase() || "";
  const search = searchQuery?.toLowerCase() || "";

  return search
    .split(" ")
    .every((word) => name.includes(word));
});

  return (
    <Layout title="Menu - QuickFoodBite" >
<div
  style={{
    display: "flex",
    width: "100%",
    minHeight: "100vh",
    paddingRight: "clamp(10px, 3vw, 40px)",
    paddingLeft: "clamp(10px, 3vw, 40px)",
    boxSizing: "border-box",
  }}
>
  {/* LEFT CATEGORY SIDEBAR */}
  <div
    
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
   className={`category-btn d-flex align-items-center gap-2 ${
  selectedCategory === category.name ? "active" : ""
}`}
   
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
  className="menu-content"
>
    <div className="mb-4 w-100">
      {loading ? (
        <p className="text-center mt-5 text-danger">Loading products...</p>
      ) : (
        <>
    


<div className="menu-page">

  <aside className="sidebar">
    {/* categories */}
  </aside>

  <div className="menu-content">
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
      <ProductsList products={filteredProducts} />

  </div>

</div>

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