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

        {/* 2. Pick Order */}
<Accordion.Item eventKey="1">
  <Accordion.Header>
    <strong>2. Pick / Claim an Order</strong>
  </Accordion.Header>

  <Accordion.Body>
    <p>
      Review the available order details carefully before claiming an order.
    </p>

    <ol>
      <li>
        Open the notification for the available order.
      </li>
      <li>
        Review the order details and click <strong>Pick Order</strong>.
      </li>
      <li>
        Once successfully claimed, the order will be added to your{" "}
        <strong>My Orders</strong> section.
      </li>
    </ol>

    <div className="alert alert-warning">
      <strong>Important:</strong> Once an order has been claimed, it is assigned
      to that moderator and cannot be claimed by another moderator.
    </div>
  </Accordion.Body>
</Accordion.Item>
       
{/* 3. Update Order Status */}
<Accordion.Item eventKey="3">
  <Accordion.Header>
    <strong>3. Update Order Status</strong>
  </Accordion.Header>

  <Accordion.Body>
    <p>
      Once the order has been successfully delivered, make sure to update its
      status on the portal.
    </p>

    <ol>
      <li>
        Deliver the order to the customer at the specified delivery location.
      </li>
      <li>
        Open the order from your <strong>My Orders</strong> section.
      </li>
      <li>
        Update the order status to <strong>Delivered</strong>.
      </li>
    </ol>

    <div className="alert alert-warning">
      <strong>Important:</strong> Updating the order status to{" "}
      <strong>Delivered</strong> is required after completing the delivery.
      This helps keep order records accurate and prevents issues later.
    </div>
  </Accordion.Body>
</Accordion.Item>


{/* 4. Edit an Order */}
<Accordion.Item eventKey="4">
  <Accordion.Header>
    <strong>4. Edit an Order</strong>
  </Accordion.Header>

  <Accordion.Body>
    <p>
      You may need to edit an order if a customer requests a change or if an
      ordered item is unavailable.
    </p>

    <ul>
      <li>
        Edit the order if the customer requests to add, remove, or replace an
        item.
      </li>
      <li>
        If an ordered item is unavailable at the café, update the order
        accordingly.
      </li>
      <li>
        You can edit the order from your <strong>My Orders</strong> section.
      </li>
      <li>
        <strong>Always confirm the changes with the customer before updating
        the order.</strong>
      </li>
      <li>
        The updated order subtotal must be <strong>equal to or higher than the
        original subtotal</strong>.
      </li>
      <li>
        You cannot remove or replace items if doing so makes the new subtotal
        lower than the original order subtotal.
      </li>
      <li>
        Once the order is updated, a WhatsApp notification will be sent to the
        customer, and the changes will also be reflected on the Admin Panel.
      </li>
    </ul>

    <div className="alert alert-warning">
      <strong>Important:</strong> Before making any changes, confirm the
      updated items and price with the customer. The final order subtotal
      cannot be lower than the original subtotal.
    </div>
  </Accordion.Body>
</Accordion.Item>



  
{/* 5. Online Payment to Admin */}
<Accordion.Item eventKey="5">
  <Accordion.Header>
    <strong>5. Online Payment to Admin</strong>
  </Accordion.Header>

  <Accordion.Body>
    <p>
      Once your account reaches the credit limit, you are required to settle
      your outstanding credits by making an online payment to the Admin.
    </p>

    <ol>
      <li>
        Once your account reaches <strong>1,000 credits</strong>, you will need
        to make a payment to the Admin.
      </li>
      <li>
        Click on your <strong>Credits</strong> displayed at the top of the
        portal.
      </li>
      <li>
        Copy the <strong>JazzCash number</strong> provided for payment.
      </li>
      <li>
        Make the payment using your preferred banking or mobile payment app.
      </li>
      <li>
        Upload the <strong>payment receipt</strong> through the portal.
      </li>
      <li>
        Wait for the Admin to review and verify your payment receipt.
      </li>
      <li>
        Once the payment is successfully verified, the Admin will deduct the
        corresponding amount from your outstanding credits.
      </li>
    </ol>

    <div className="alert alert-warning">
      <strong>Important:</strong> Make sure to upload a clear and valid payment
      receipt. Your credits will only be adjusted after the Admin has reviewed
      and approved the payment.
    </div>
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
          
            <Badge bg="warning" text="dark">Picked Up</Badge>
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