
import { toast } from "react-toastify";
import { useCart } from "../../context/cart";
import GeneralLayout from "../../Components/Layout/GeneralLayout";
import { useAuth } from "../../context/auth";
import "./orderStyle.css";
import { Button } from "react-bootstrap";
import { useState, react,useEffect } from "react";
import axios from "axios";

const CartPage = () => {
  const { cart, setCart } = useCart();
  const [auth] = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [OrderPrice, setOrderPrice] = useState();
const [userInfo, setUserInfo] = useState({
  name: "",
  phone: "",
  location: "",
});
const [settings, setSettings] = useState({});
const [charges, setCharges] = useState([]);
  const removecart = async (pid) => {
    try {
      let mycart = [...cart];
      let index = mycart.findIndex((item) => item._id === pid);
      mycart.splice(index, 1);
      setCart(mycart);
      localStorage.setItem("cart", JSON.stringify(mycart));
    } catch (error) {
      console.log(error);
    }
  };
const fetchSettings = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.React_App_API}/api/v1/charges/getsetting`
    );

    setSettings(data || {});
  } catch (error) {
    console.log(error);
  }
};

const fetchCharges = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.React_App_API}/api/v1/charges/all`
    );

    if (data?.success) {
      setCharges(data.charges);
    }
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  fetchSettings();
  fetchCharges();
}, []);
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        if (item.price && item.quantity) {
          total += item.price * item.quantity;
        }
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
      return "$0.00";
    }
  };

const calculateSummary = () => {
    let subtotal = 0;
    let itemDiscount = 0;
    let liquid = 0;
    let solid = 0;

    cart.forEach((item) => {
      const total = item.price * item.quantity;
      subtotal += total;

      if (item.discount) {
        itemDiscount += (total * item.discount) / 100;
      }

      if (item.type === "liquid") liquid += item.quantity;
      else solid += item.quantity;
    });

    const deliveryLiquid =
      charges.find((c) => c.type === "delivery"&& c.category === "liquid")?.amount || 0;
    const deliverySolid =
      charges.find((c) => c.type === "delivery"&& c.category === "Solid")?.amount || 0;

    const packagingLiquid =
      charges.find((c) => c.type === "packaging" && c.category === "liquid")?.amount || 0;

    const packagingSolid =
      charges.find((c) => c.type === "packaging" && c.category === "Solid")?.amount || 0;

    const packagingCharge = liquid * packagingLiquid + solid * packagingSolid;
    const deliveryCharge = liquid * deliveryLiquid + solid * deliverySolid;

    const globalDiscount = settings.globalDiscount || 0;
    const globalDiscountAmount = (subtotal * globalDiscount) / 100;

    const beforeTotal = subtotal - itemDiscount - globalDiscountAmount;

    const grandTotal = beforeTotal + deliveryCharge + packagingCharge;

    return {
      subtotal,
      itemDiscount,
      globalDiscountAmount,
      deliveryCharge,
      packagingCharge,
      grandTotal,
      liquid,
      solid,
      itemsCount: cart.length,
    };
  };
const handleProceed = async () => {
  const { name, phone, location } = userInfo;

  if (!name || !phone || !location) {
    toast.error("All fields are required");
    return;
  }

  const summary = calculateSummary();
  const minOrder = settings.minOrderPrice || 0;
  if (summary.grandTotal < minOrder) {
      toast.error(`Minimum order is Rs ${minOrder}`);
      return;
    }
 const formattedItems = cart.map((item) => ({
  productId: item.id || item._id,
  name: item.name,
  price: Number(item.price),
  quantity: Number(item.quantity),
  category: item.category,
  type: item.type,
  discount: Number(item.discount || 0),
}));

  try {
    // 🔥 1. SAVE ORDER IN DATABASE
    const res = await fetch(
      `${process.env.React_App_API}/api/v1/orders/create-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       body: JSON.stringify({
    userName: name,
    phone,
    location,
    items: formattedItems, // ✅ MUST BE ARRAY
   ...summary,
  }),
      }
    );

    const data = await res.json();

    if (!data.success) {
      toast.error("Order failed");
      return;
    }
    const orderId = data.order._id;

    // 🔥 2. OPTIONAL: WhatsApp message
  const message = `
🛒 *New Order Received*

👤 Customer:
Name: ${name}
Phone: ${phone}
Location: ${location}

📦 *Items:*
${cart
  .map(
    (item) =>
      `• ${item.name} x${item.quantity} = Rs ${
        item.price * item.quantity
      } (Discount: ${item.discount || 0}%)`
  )
  .join("\n")}

📊 *Summary:*
Subtotal: Rs ${summary.subtotal}
Item Discount: -Rs ${summary.itemDiscount}
Global Discount: -Rs ${summary.globalDiscountAmount}
Delivery: Rs ${summary.deliveryCharge}
Packaging: Rs ${summary.packagingCharge}

💰 *TOTAL: Rs ${summary.grandTotal}*

👉 *Pick Order Link:*
${process.env.FRONTEND}/dashboard/moderator
`;

    const whatsappURL = `https://wa.me/923437648604?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappURL, "_blank");

    // 🔥 3. CLEAR CART
    setCart([]);
    localStorage.removeItem("cart");

    setShowModal(false);

    toast.success("Order placed successfully!");

  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};
useEffect(() => {
  const { finalTotal } = calculateSummary();
  setOrderPrice(finalTotal);
}, [cart]);
  return (
    <GeneralLayout title="Cart - BurgerShop">
      <div className="row justify-content-center m-0">
        <div className="col-md-8 mt-5 mb-5 cardsdetails">
          <div className="card">
            <div
              className="card-header p-3"
              style={{ backgroundColor: "rgb(140, 16, 10)" }}
            >
              <h5 className="text-white m-0">
                Cart Calculation
                {cart.length > 0 ? `(${cart.length})` : ""}
              </h5>
            </div>
            <div className="card-body p-0">
              {cart.length === 0 ? (
                <div className="cart-empty text-center">
                  <i className="fa fa-shopping-cart"></i>
                  <p>Your cart Is Empty</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table cart-table mb-0">
                    <thead>
                      <tr>
                        <th>Action</th>
                        
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th>Discount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((p) => (
                        <tr key={p._id}>
                          <td>
                            <button
                              className="prdct-delete"
                              onClick={() => removecart(p._id)}
                            >
                              <i className="fa fa-trash-alt"></i>
                            </button>
                          </td>
                          
                          <td>
                            <div className="product-name">
                              <p>{p.name}</p>
                            </div>
                          </td>
                          <td>
                            <div className="product-name">
                              <p>{p.category}</p>
                            </div>
                          </td>
                          

                          <td>{p.quantity}</td>
                          <td>{p.type}</td>
                          <td>{p.price}</td>
                          <td>{p.discount}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th>&nbsp;</th>
                        <th colSpan={3}>&nbsp;</th>
                        <th className="text-right">
                          Total Price:{" "}
                          <span className="text-danger">{totalPrice()}</span>
                        </th>
                        <th className="text-right">
                          <Button
  variant="success"
  className="w-100 mt-2"
  onClick={() => {
    const { finalTotal } = calculateSummary();

    if (finalTotal < 300) {
      toast.error("Minimum order must be Rs 300");
      return;
    }

    setShowModal(true);
  }}
>
  Proceed to Checkout
</Button>
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showModal && (
  <div className="modal show d-block" style={{ background: "#00000080" }}>
    <div className="modal-dialog">
      <div className="modal-content p-3">

        <h5>Enter Details</h5>

        <input
          type="text"
          placeholder="Name"
          className="form-control mb-2"
          value={userInfo.name}
          onChange={(e) =>
            setUserInfo({ ...userInfo, name: e.target.value })
          }
        />
<input
  type="text"
  placeholder="Phone (03XXXXXXXXX)"
  className="form-control mb-2"
  value={userInfo.phone}
  maxLength={11}
  onChange={(e) => {
    let value = e.target.value;

    // allow only numbers
    if (!/^\d*$/.test(value)) return;

    // must start with 0
    if (value.length === 1 && value !== "0") return;

    setUserInfo({ ...userInfo, phone: value });
  }}
/>

        <input
          type="text"
          placeholder="Location"
          className="form-control mb-3"
          value={userInfo.location}
          onChange={(e) =>
            setUserInfo({ ...userInfo, location: e.target.value })
          }
          
        />
<h4>Order Summary</h4>
        {/* Summary */}
        
              {(() => {
                const s = calculateSummary();
                return (
                  <div>
                    <p>Items: {s.items}</p>
                    <p>Subtotal: Rs {s.subtotal}</p>
                    <p>Item Discount: -Rs {s.itemDiscount}</p>
                    <p>Global Discount: -Rs {s.globalDiscountAmount}</p>
                    <p>Delivery: Rs {s.deliveryCharge}</p>
                    <p>Packaging: Rs {s.packagingCharge}</p>
                    <h5>Grand Total: Rs {s.grandTotal}</h5>
                  </div>
                );
              })()}

        <button
          className="btn btn-success w-100"
          onClick={() => handleProceed()}
        >
          Confirm Order
        </button>

        <button
          className="btn btn-secondary w-100 mt-2"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>

      </div>
    </div>
  </div>
)}
    </GeneralLayout>

  );
};


export default CartPage;
