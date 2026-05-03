import React, { useEffect, useState } from "react";

import AdminMenu from "../../Components/Layout/AdminMenu";
import bgImage from "../../assets/bg-boxed.jpg";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal, Input, Button } from "antd";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/auth";
import { NavLink, useNavigate } from "react-router-dom";
const AdminCharges = () => {
  const [charges, setCharges] = useState([]);
  const [loading, setLoading] = useState(false);
const [settings, setSettings] = useState({});
const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
const [settingKey, setSettingKey] = useState("");
const [settingValue, setSettingValue] = useState("");
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState(null);
  const [newAmount, setNewAmount] = useState("");
    const [auth, setAuth] = useAuth();
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
  // Fetch charges
  const fetchCharges = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/charges/all`
      );
      console.log("Charges : ", data)
      if (data?.success) {
        setCharges(data.charges);
      }
    } catch (error) {
      toast.error("Error fetching charges");
    }
  };
const fetchSettings = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/api/v1/charges/getsetting`
    );
console.log("Data for settings: ",data)
    setSettings(data || {});
  } catch (error) {
    toast.error("Error fetching settings");
  }
};
  useEffect(() => {
    fetchCharges();
    fetchSettings();
  }, []);

  // Open modal
  const openModal = (charge) => {
    setSelectedCharge(charge);
    setNewAmount(charge.amount);
    setIsModalOpen(true);
  };
  const openSettingsModal = (key, value) => {
  setSettingKey(key);
  setSettingValue(value);
  setIsSettingsModalOpen(true);
};

  // Update charge
  const handleUpdate = async () => {
    try {
      setLoading(true);

      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/charges/update/${selectedCharge._id}`,
        { amount: newAmount }
      );

      if (data?.success) {
        toast.success("Updated successfully ✅");
        setIsModalOpen(false);
        fetchCharges();
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      toast.error("Error updating");
    } finally {
      setLoading(false);
    }
  };
 const handleSettingsUpdate = async () => {
  try {
    const { data } = await axios.put(
      `${process.env.REACT_APP_API}/api/v1/charges/updatesetting`,
      {
        [settingKey]: Number(settingValue),
      }
    );

    toast.success("Settings updated ✅");
    setIsSettingsModalOpen(false);
    fetchSettings();
  } catch (error) {
    toast.error("Error updating settings");
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
          height: "100vh",
        }}
      >
        <div
          className="row"
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
            height: "100vh",
            padding: "20px",
            overflowY: "auto",
          }}
        >
          {/* Sidebar */}
          <div className="col-lg-3 col-md-4 mb-4">
            <AdminMenu />
          </div>

          {/* Main */}
          <div className="col-lg-9 col-md-8">

            <h3 className="text-white mb-4">Charges Management</h3>

            {charges.map((c) => (
              <div key={c._id} className="card p-3 mb-3 shadow">

                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5>
                      {c.type.toUpperCase()} - {c.category.toUpperCase()}
                    </h5>
                    <p>Amount: Rs {c.amount}</p>
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={() => openModal(c)}
                  >
                    Edit
                  </button>
                </div>

              </div>
            ))}
     

<div className="card p-3 mb-3 shadow">
  <div className="d-flex justify-content-between align-items-center">
    <div>
      <h5>MIN ORDER PRICE</h5>
      <p>Rs {settings.minOrderPrice}</p>
    </div>

    <button
      className="btn btn-primary"
      onClick={() =>
        openSettingsModal("minOrderPrice", settings.minOrderPrice)
      }
    >
      Edit
    </button>
  </div>
</div>

<div className="card p-3 mb-3 shadow">
  <div className="d-flex justify-content-between align-items-center">
    <div>
      <h5>GLOBAL DISCOUNT</h5>
      <p>{settings.globalDiscount}%</p>
    </div>

    <button
      className="btn btn-primary"
      onClick={() =>
        openSettingsModal("globalDiscount", settings.globalDiscount)
      }
    >
      Edit
    </button>
  </div>
</div>

          </div>
        </div>
      </div>

      {/* 🔥 Modal */}
      <Modal
        title="Update Charge"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <p>
          {selectedCharge?.type?.toUpperCase()} -{" "}
          {selectedCharge?.category?.toUpperCase()}
        </p>

        <Input
          type="number"
          value={newAmount}
          onChange={(e) => setNewAmount(e.target.value)}
          placeholder="Enter new amount"
          className="mb-3"
        />

        <Button
          type="primary"
          block
          onClick={handleUpdate}
          loading={loading}
        >
          Update
        </Button>
      </Modal>
      {/* Modal for Min Order and Discount */}
      <Modal
  title="Update Setting"
  open={isSettingsModalOpen}
  onCancel={() => setIsSettingsModalOpen(false)}
  footer={null}
>
  <p>{settingKey}</p>

  <Input
    type="number"
    value={settingValue}
    onChange={(e) => setSettingValue(e.target.value)}
    className="mb-3"
  />

  <Button type="primary" block onClick={handleSettingsUpdate}>
    Update
  </Button>
</Modal>
    </>
  );
};

export default AdminCharges;