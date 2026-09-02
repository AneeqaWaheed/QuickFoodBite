import React from "react";
import { Card, Accordion, Badge } from "react-bootstrap";
import { useAuth } from "../../context/auth";
import SimpleLayout from "../../Components/Layout/SimpleLayout";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ModeratorMenu from "../../Components/Layout/ModeratorMenu";
import pickUp from "../../assets/pickUp.png";
import ModeratorNavbar from "../../Components/Layout/ModeratorNavbar";
const ModeratorDocumentation = () => {
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const handleLogout = () => {
          toast.success("Logout Successfully");
          setAuth({
            ...auth,
            user: null,
            token: "",
          });
      
          localStorage.removeItem("auth");
      
          navigate("/login");
          console.log("LOCATION STATE:", location.state);
        };
  return (
    <SimpleLayout title="Moderator - Profile">
      <ModeratorNavbar  handleLogout={handleLogout} />

  {/* MAIN SECTION */}
   <div
          className="container-fluid"
          style={{
            backgroundImage: `url(${pickUp})`,
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
              margin: "0px",
              padding: "20px",
              overflowY: "auto",
            }}
          >
      {/* SIDEBAR */}
      <div className="col-md-3 mb-4 mb-md-0">
        <div className="bg-black p-3 rounded shadow">
          <ModeratorMenu />
        </div>
      </div>

          {/* Main Content */}
          <div className="col-lg-9 col-md-8 rounded">
      {/* <h2 className="fw-bold mb-2">Moderator Documentation</h2>
      <p className="text-muted mb-4">
        Follow these steps to handle orders from pickup to delivery.
      </p> */}

      <Accordion defaultActiveKey="0">

        {/* 1. Go Online */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <strong>1. Go Online</strong>
          </Accordion.Header>
          <Accordion.Body>
            <p>
              Turn <strong>Go Online</strong> ON when you are available to
              receive orders.
            </p>

            <ul>
              <li>Online moderators receive new order notifications.</li>
              <li>Turn it OFF when you are unavailable.</li>
              <li>Make sure your internet connection is active.</li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>

        {/* 2. View Orders */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <strong>2. View Available Orders</strong>
          </Accordion.Header>
          <Accordion.Body>
            <p>
              New orders will appear in the <strong>Available Orders</strong>{" "}
              section.
            </p>

            <ul>
              <li>Order Number</li>
              <li>Customer Name</li>
              <li>Customer Phone Number</li>
              <li>Pickup Location</li>
              <li>Delivery Location</li>
              <li>Order Items</li>
              <li>Total Amount</li>
              <li>Order Type</li>
            </ul>

            <Badge bg="primary">Campus</Badge>{" "}
            <Badge bg="secondary">Outside Campus</Badge>
          </Accordion.Body>
        </Accordion.Item>

        {/* 3. Pick Order */}
        <Accordion.Item eventKey="2">
          <Accordion.Header>
            <strong>3. Pick / Claim an Order</strong>
          </Accordion.Header>
          <Accordion.Body>
            <p>
              Review the order carefully before claiming it.
            </p>

            <ol>
              <li>Open the available order.</li>
              <li>Check pickup and delivery locations.</li>
              <li>Review the order items.</li>
              <li>Click <strong>Pick Order</strong>.</li>
            </ol>

            <div className="alert alert-warning">
              Once an order is claimed, another moderator cannot claim the
              same order.
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* 4. Pickup */}
        <Accordion.Item eventKey="3">
          <Accordion.Header>
            <strong>4. Pick Up the Order</strong>
          </Accordion.Header>
          <Accordion.Body>
            <p>Before leaving the pickup location, verify:</p>

            <ul>
              <li>Order Number</li>
              <li>Items and quantities</li>
              <li>Packaging</li>
              <li>Customer order details</li>
            </ul>

            <p>
              After receiving the order, update the status to{" "}
              <strong>Picked Up</strong>.
            </p>
          </Accordion.Body>
        </Accordion.Item>

        {/* 5. Delivery */}
        <Accordion.Item eventKey="4">
          <Accordion.Header>
            <strong>5. Deliver the Order</strong>
          </Accordion.Header>
          <Accordion.Body>
            <ol>
              <li>Proceed to the customer's delivery location.</li>
              <li>Contact the customer if necessary.</li>
              <li>Verify the order number.</li>
              <li>Hand over the complete order.</li>
              <li>Collect payment if required.</li>
            </ol>

            <p>
              After successful delivery, update the order status to{" "}
              <strong>Delivered</strong>.
            </p>
          </Accordion.Body>
        </Accordion.Item>

        {/* 6. Complete */}
        <Accordion.Item eventKey="5">
          <Accordion.Header>
            <strong>6. Complete the Order</strong>
          </Accordion.Header>
          <Accordion.Body>
            <p>
              Once the customer has received the order, mark it as{" "}
              <strong>Completed</strong>.
            </p>

            <ul>
              <li>The order moves to delivery history.</li>
              <li>Moderator earnings/credit are recorded.</li>
              <li>The order is no longer available for delivery.</li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>

        {/* 7. Problems */}
        <Accordion.Item eventKey="6">
          <Accordion.Header>
            <strong>7. What to Do If There Is a Problem</strong>
          </Accordion.Header>
          <Accordion.Body>
            <p>Contact the admin/support if:</p>

            <ul>
              <li>Customer is not responding.</li>
              <li>Customer provided an incorrect location.</li>
              <li>Restaurant/café has not prepared the order.</li>
              <li>An item is missing.</li>
              <li>There is a payment issue.</li>
              <li>The customer requests cancellation.</li>
              <li>There is any issue that prevents successful delivery.</li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>

      </Accordion>

      {/* Order Flow */}
      <Card className="mt-4 shadow-sm border-0">
        <Card.Body>
          <h5 className="fw-bold mb-3">Order Status Flow</h5>

          <div className="d-flex flex-wrap gap-2">
            <Badge bg="secondary">New</Badge>
            <span>→</span>
            <Badge bg="primary">Available</Badge>
            <span>→</span>
            <Badge bg="info">Claimed</Badge>
            <span>→</span>
            <Badge bg="warning" text="dark">Picked Up</Badge>
            <span>→</span>
            <Badge bg="primary">Out for Delivery</Badge>
            <span>→</span>
            <Badge bg="success">Delivered</Badge>
            <span>→</span>
            <Badge bg="dark">Completed</Badge>
          </div>
        </Card.Body>
      </Card>
    </div>
    </div>
    </div>
    </SimpleLayout>
  );
};

export default ModeratorDocumentation;