import AdminMenu from "../../Components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";
import bgImage from "../../assets/bg-boxed.jpg";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Badge, Table, Modal, Form } from "react-bootstrap";
const AdminPayments = () => {
    const [auth, setAuth] = useAuth();
console.log("Auth in admin,", auth)
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
const [selectedModerator, setSelectedModerator] = useState(null);
const [newCredits, setNewCredits] = useState("");

  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
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
 

  // Get payment requests
  const getPaymentRequests = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
       `${process.env.REACT_APP_API}/api/v1/admin/payment-requests`,
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );

      if (data.success) {
        setRequests(data.requests);
      }

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to load payment requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getPaymentRequests();
    }
  }, [auth?.token]);

  // Approve payment
  const handleApprove = async (paymentId) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/admin/approve/${paymentId}`,
        {},
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );

      if (data.success) {
        toast.success("Payment approved successfully");

        getPaymentRequests();
      }

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to approve payment"
      );
    }
  };

  // Reject payment
  const handleReject = async (paymentId) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/admin/reject/${paymentId}`,
        {},
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );

      if (data.success) {
        toast.success("Payment request rejected");

        getPaymentRequests();
      }

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to reject payment"
      );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge bg="success">Approved</Badge>;

      case "rejected":
        return <Badge bg="danger">Rejected</Badge>;

      default:
        return <Badge bg="warning" text="dark">Pending</Badge>;
    }
  };
const handleUpdateCredits = async () => {
  try {
    const { data } = await axios.put(
      `http://localhost:8080/api/v1/admin/moderator/${selectedModerator._id}/credits`,
      {
        creditBalance: Number(newCredits),
      },
      {
        headers: {
          Authorization: auth?.token,
        },
      }
    );

    if (data.success) {
      toast.success("Credits updated successfully");

      setShowCreditsModal(false);

      // Refresh moderators
      getPaymentRequests();
    }
  } catch (error) {
    console.log(error);

    toast.error(
      error.response?.data?.message ||
      "Failed to update credits"
    );
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
        className="container-fluid "
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed", // Keeps the background fixed during scrolling
          height: "100vh", // Sets the height to cover the full viewport height
          width: "100%", // Sets the width to cover the full viewport width
          margin: 0, // Removes default margins
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
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div>
              <h3 className="mb-1 text-white">Payment Requests</h3>

              <p className="text-white mb-0">
                Review moderator payment receipts and approve or reject them.
              </p>
            </div>

            <Button
              variant="outline-primary"
              onClick={getPaymentRequests}
              className="m-3"
            >
              Refresh
            </Button>
          

          {loading ? (
            <div className="text-center text-white py-5">
              Loading payment requests...
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center text-white py-5">
              No payment requests found.
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover responsive className="align-middle">

                <thead>
                  <tr>
                    <th>Moderator</th>
                    <th>Total Earnings</th>
                    <th>Admin Fee (20%)</th>
                    <th>Receipt</th>
                    <th>Status</th>
                    <th>Actions</th>
                    <th>Update Credits</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((request) => (
                    <tr key={request._id}>

                      {/* Moderator */}
                      <td>
                        <strong>
                          {request.moderator?.firstName}{" "}
                          {request.moderator?.lastName}
                        </strong>

                        <div className="small text-muted">
                          {request.moderator?.studentID}
                        </div>
                      </td>

                      {/* Earnings */}
                      <td>
                        Rs. {request.totalEarnings}
                      </td>

                      {/* Admin Fee */}
                      <td>
                        <strong className="text-success">
                          Rs. {request.adminFee}
                        </strong>
                      </td>

                      {/* Receipt */}
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            setSelectedReceipt(request.receipt);
                            setShowReceipt(true);
                          }}
                        >
                          View Receipt
                        </Button>
                      </td>

                      {/* Status */}
                      <td>
                        {getStatusBadge(request.status)}
                      </td>

                      {/* Actions */}
                      <td>
                        {request.status === "pending" ? (
                          <div className="d-flex gap-2">

                            <Button
                              variant="success"
                              size="sm"
                              onClick={() =>
                                handleApprove(request._id)
                              }
                            >
                              Approve
                            </Button>

                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() =>
                                handleReject(request._id)
                              }
                            >
                              Reject
                            </Button>

                          </div>
                        ) : (
                          <span className="text-muted">
                            Processed
                          </span>
                        )}
                      </td>
                      <td>
                       <Button
  variant="outline-primary"
  size="sm"
  onClick={() => {
    setSelectedModerator(request.moderator);
    setNewCredits(request.moderator?.creditBalance || 0);
    setShowCreditsModal(true);
  }}
>
  Edit Credits
</Button>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </Table>
            </div>
          )}
          </div>
          </div>
  <Modal
        show={showReceipt}
        onHide={() => setShowReceipt(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Payment Receipt</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">

          {selectedReceipt && (
            <img
              src={selectedReceipt}
              alt="Payment Receipt"
              className="img-fluid rounded"
              style={{
                maxHeight: "70vh",
              }}
            />
          )}

        </Modal.Body>

      </Modal>
          </div>
          </div>
         <Modal
  show={showCreditsModal}
  onHide={() => setShowCreditsModal(false)}
  centered
>
  <Modal.Header closeButton>
    <Modal.Title>Edit Credits</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    {selectedModerator && (
      <>
        <p>
          <strong>Moderator:</strong>{" "}
          {selectedModerator.firstName}{" "}
          {selectedModerator.lastName}
        </p>

        <p>
          <strong>Current Credits:</strong>{" "}
          Rs. {selectedModerator.creditBalance || 0}
        </p>

        <Form.Group>
          <Form.Label>New Credit Balance</Form.Label>

          <Form.Control
            type="number"
            min="0"
            value={newCredits}
            onChange={(e) => setNewCredits(e.target.value)}
          />
        </Form.Group>
      </>
    )}
  </Modal.Body>

  <Modal.Footer>
    <Button
      variant="secondary"
      onClick={() => setShowCreditsModal(false)}
    >
      Cancel
    </Button>

    <Button
      variant="primary"
      onClick={handleUpdateCredits}
    >
      Save
    </Button>
  </Modal.Footer>
</Modal>
          </>
  );
};
export default AdminPayments;
