import { useState, useEffect } from "react";
import Layout from "../Components/Layout/Layout";
import { toast } from "react-toastify";
import ProductsList from "./ProductList";
import "../styles/menu.css";
import { useCart } from "../context/cart";
import {
  FaPizzaSlice,
  FaHamburger,
  FaIceCream,
  FaCoffee,
  FaFish,
  FaDrumstickBite,
  FaCookie,
  FaUtensils,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaShoppingCart, FaArrowRight
} from "react-icons/fa";
import { useSearch } from "../context/seacrh";

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

const Menu = () => {
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { searchQuery } = useSearch();
  const {
  cart,
  setCartOpen,
  cartOpen
} = useCart();

const cartItemCount = cart.reduce(
  (total, item) => total + item.quantity,
  0
);

const cartTotal = cart.reduce(
  (total, item) => total + (item.price * item.quantity),
  0
);

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
useEffect(() => {
  setPage(1);
}, [searchQuery]);
  // ---------------- CATEGORY CHANGE ----------------
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
  };

 const filteredProducts = products.filter((item) => {
  const name = item?.name?.toLowerCase() || "";
  const search = searchQuery?.trim().toLowerCase() || "";

  if (!search) return true;

  return name.includes(search);
});

  return (
    <Layout title="Menu - Fleent">
      <div className="fleent-menu-page">
        {/* Eyebrow + heading, matches "WHAT'S YOUR WISH?" hero pattern */}
        <div className="fleent-menu-header">
          <p className="fleent-eyebrow">WHAT'S YOUR WISH?</p>
          <h1 className="fleent-heading">
            {selectedCategory || "All Products"}
          </h1>
        </div>

        {/* Category chips row */}
        <div className="fleent-category-row">
          <button
            onClick={() => handleCategoryChange("")}
            className={`fleent-category-chip ${
              selectedCategory === "" ? "active" : ""
            }`}
          >
            <span className="fleent-category-icon">
              <FaUtensils />
            </span>
            <span>All</span>
          </button>

          {categoryLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="fleent-category-chip skeleton" />
              ))
            : categories.map((category, index) => (
                <button
                  key={category._id || category.name}
                  onClick={() => handleCategoryChange(category.name)}
                  className={`fleent-category-chip ${
                    selectedCategory === category.name ? "active" : ""
                  }`}
                >
                  <span className="fleent-category-icon">
                    {categoryIcons[index % categoryIcons.length]}
                  </span>
                  <span>{category.name}</span>
                </button>
              ))}
        </div>

        {/* Products */}
        <div className="fleent-products-panel">
          {loading ? (
            <div className="fleent-loading">
              <div className="fleent-spinner" />
              <p>Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="fleent-empty">
              <FaSearch size={22} />
              <p>No items match your search.</p>
            </div>
          ) : (
            <ProductsList products={filteredProducts} />
          )}
        </div>

               {/* Pagination */}
        {!loading && filteredProducts.length > 0 && (
          <div className="fleent-pagination">
            <button
              className="fleent-page-btn"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              <FaChevronLeft size={12} /> Previous
            </button>

            <span className="fleent-page-indicator">
              Page {page} of {totalPages}
            </span>

            <button
              className="fleent-page-btn"
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={page === totalPages}
            >
              Next <FaChevronRight size={12} />
            </button>
          </div>
        )}
{cart.length > 0 && !cartOpen && (
  <div className="menu-mini-cart">
    <div
      className="menu-mini-cart-left"
      onClick={() => setCartOpen(true)}
    >
      <FaShoppingCart />
      <span>{cartItemCount} Items</span>
    </div>

    <div className="menu-mini-cart-total">
      Rs. {cartTotal}
    </div>

    <button
      type="button"
      className="menu-mini-cart-view"
      onClick={() => setCartOpen(true)}
    >
      View Cart
      <FaArrowRight />
    </button>
  </div>
)}

      </div>
    </Layout>
  );
};

export default Menu;