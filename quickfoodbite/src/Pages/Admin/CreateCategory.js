import React, { useState, useEffect } from "react";
import AdminMenu from "../../Components/Layout/AdminMenu";
import { toast } from "react-toastify";
import CategoryForm from "../../Components/Form/CategoryForm";
import axios from "axios";
import { Modal } from "antd";
import bgImage from "../../assets/bg-boxed.jpg";
import "../../styles/createCategory.css";
import { useAuth } from "../../context/auth";
import { NavLink, useNavigate } from "react-router-dom";
const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [auth, setAuth] = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 4; // Number of categories per page

  // Fetch all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
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
 const navigate = useNavigate();
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
  // Calculate paginated categories
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  // Pagination Handlers
  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const prevPage = () => setCurrentPage((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/category/create-category`,
        { name }
      );
      if (data?.success) {
        toast.success(`${name} category is created successfully`);
        getAllCategory();
        setName(""); // Clear the input field
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in input form");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/category/update-category/${selected._id}`,
        { name: updatedName }
      );
      if (data?.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/category/delete-category/${id}`
      );
      if (data?.success) {
        toast.success("Category is deleted");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
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
          height: "100vh",
          width: "100%",
          margin: 0,
          padding: 0,
        }}
      >
        <div
          className="row"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            height: "100vh",
            width: "100%",
            padding: "50px",
            margin: "0px",
          }}
        >
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9 ">
            <h1 className="text-danger">Manage Category</h1>
            <div className="mb-3">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div>
              <table className="table w-100 ">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCategories.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>
                        <button
                          className="btn btn-success"
                          onClick={() => {
                            setVisible(true);
                            setUpdatedName(c.name);
                            setSelected(c);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger ms-2"
                          onClick={() => handleDelete(c._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination-controls d-flex align-items-baseline justify-content-end">
                <button
                  className="btn btn-danger"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span className="text-white mx-2">Page {currentPage}</span>
                <button
                  className="btn btn-danger"
                  onClick={nextPage}
                  disabled={indexOfLastCategory >= categories.length}
                >
                  Next
                </button>
              </div>
            </div>

            <Modal
              className="p-2"
              title="Update Category"
              open={visible}
              onCancel={() => setVisible(false)}
              onOk={() => setVisible(false)}
            >
              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                handleSubmit={handleUpdate}
              />
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateCategory;
