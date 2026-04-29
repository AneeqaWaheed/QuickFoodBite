import React, { useState, useEffect } from "react";
import GeneralLayout from "../../Components/Layout/GeneralLayout";
import AdminMenu from "../../Components/Layout/AdminMenu";
import bgImage from "../../assets/bg-boxed.jpg";
import axios from "axios";
import { toast } from "react-toastify";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { Button, Select } from "antd";
import { useAuth } from "../../context/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink, useNavigate } from "react-router-dom";
const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
 const [auth, setAuth] = useAuth();

   const handleLogout = () => {
      toast.success("Logout Successfully");
      setAuth({
        ...auth,
        user: null,
        token: "",
      });
  
      localStorage.removeItem("auth");
  
      navigate("/login");
    };
  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.React_App_API}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Create product function
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
     

      const productData = new FormData();
      productData.append("name", name);
      productData.append("category", category);
      productData.append("price", price);
      productData.append("type", type);

      // Set loading state to true when the request starts
      setLoading(true);
      // Send the formData to the server
      const { data } = await axios.post(
        `${process.env.React_App_API}/api/v1/product/create-product`,
        productData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data?.success) {
        toast.success("Product created successfully!");
        navigate("/dashboard/admin/product");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error.response.data);
      toast.error("Something went wrong");
    } finally {
      // Set loading state to false when the request ends
      setLoading(false);
    }
  };

  return (
    <>
   <nav
     className="navbar navbar-expand-lg"
     style={{ backgroundColor: "#000", padding: "10px 20px" }}
   >
     <div className="container-fluid d-flex justify-content-end">
   
       <NavLink
         onClick={handleLogout}
         to="/login"
         className="nav-link text-white"
         style={{ fontWeight: "500" }}
       >
         Logout
       </NavLink>
   
     </div>
   </nav>
      <div
        className="container-fluid"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          width: "100%",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="row"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            flex: "1",
            display: "flex",
            flexWrap: "wrap",
            padding: "20px",
          }}
        >
          {/* Admin Menu */}
          <div className="col-lg-3 col-md-4 col-sm-12 mb-4">
            <AdminMenu />
          </div>

          {/* Product Creation Form */}
          <div
            className="col-lg-9 col-md-8 col-sm-12"
            style={{
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h1 className="text-white text-center">Create Product</h1>

            <div
              className="m-1 bg-body-secondary p-4 rounded shadow"
              // style={{ backgroundColor: "rgb(176, 98, 98)" }}
            >
              {/* Category Selection */}
              <Select
                placeholder="Select a category"
                showSearch
                autoClearSearchValue
                onBlur={(e) => e.target.blur()}
                className="form-select p-0 mb-3"
                size="large"
                onChange={(value) => setCategory(value)}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>

              {/* Image Upload */}
              

              {/* Product Name */}
              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="Write name of Product"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <Select
                placeholder="Select Food Type"
                showSearch
                autoClearSearchValue
                onBlur={(e) => e.target.blur()}
                className="form-select p-0 mb-3"
                size="large"
                onChange={(value) => setType(value)}
              >
                
                  <Option value="Solid">
                   Solid
                  </Option>
                    <Option value="Liquid">
                   Liquid
                  </Option>
                
              </Select>

              {/* Product Price */}
              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="Write Price of Product"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              

              {/* Create Product Button */}
              <div className="mb-3">
                <button
                  className="btn btn-danger form-control"
                  onClick={handleCreate}
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
   </>
  );
};

export default CreateProduct;
