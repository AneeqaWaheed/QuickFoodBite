import React, { useState } from "react";
import {
  Dropdown,
  OverlayTrigger,
  Popover,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { FaCopy, FaCheckCircle } from "react-icons/fa";

const ModeratorNavbar = ({ handleLogout }) => {
  const [auth] = useAuth();

  const user = auth?.user;
  const credits = user?.creditBalance ?? 0;

const ADMIN_FEE_PERCENTAGE = 20;

const adminFee = (credits * ADMIN_FEE_PERCENTAGE) / 100;

const creditLimitReached = credits >= 1000;

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
const [lockedPopover, setLockedPopover] = useState(false);

  // Admin JazzCash Details
  const jazzCashNumber = "03001234567";
  const accountHolder = "Admin Name";

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(jazzCashNumber);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleReceiptUpload = (e) => {
    setReceipt(e.target.files[0]);
  };

 const handleSubmitPayment = async () => {
  try {
    if (!receipt) {
      alert("Please upload your payment receipt.");
      return;
    }

    const formData = new FormData();

    formData.append("receipt", receipt);

    const { data } = await axios.post(
      `${process.env.REACT_APP_API}/api/v1/moderator/submit-payment`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (data.success) {
      alert("Payment request submitted. Please wait for admin approval.");

      setShowPaymentModal(false);
      setReceipt(null);
    }

  } catch (error) {
    console.log(error);

    alert(
      error.response?.data?.message ||
      "Something went wrong"
    );
  }
};
  const popover = (
    <Popover id="credit-popover">
      <Popover.Body>
        <p className="mb-2">
          You have reached your credit limit. Pay admin fees to take orders
          again.
        </p>

        <Button
  variant="danger"
  size="sm"
  onClick={() => {
    setShowPopover(false);
    setLockedPopover(false);
    setShowPaymentModal(true);
  }}
>
  Pay Now
</Button>
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <nav className="navbar navbar-dark bg-dark px-3">
        <div className="container-fluid justify-content-end align-items-center">

          {/* Credits */}
          {creditLimitReached ? (
  <OverlayTrigger
    show={showPopover}
    placement="bottom"
    overlay={popover}
  >
    <span
      className="me-3 text-danger fw-bold"
      style={{ cursor: "pointer" }}
      onMouseEnter={() => setShowPopover(true)}
      onMouseLeave={() => {
        if (!lockedPopover) {
          setShowPopover(false);
        }
      }}
      onClick={() => {
        setLockedPopover(true);
        setShowPopover(true);
      }}
    >
      ⚠ Credits: {credits}
    </span>
  </OverlayTrigger>
) : (
  <span className="text-white me-3">
    Credits: {credits}
  </span>
)}
          {/* User Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="outline-light"
              id="dropdown-user"
            >
              {user?.firstName || "Moderator"} {user?.lastName || ""}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={handleLogout}>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

        </div>
      </nav>

      {/* Payment Modal */}
      <Modal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Pay Admin Fees</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <div className="alert alert-warning">
            You have reached your credit limit. Please pay the admin fee and
            upload your payment receipt.
          </div>
<div className="border rounded p-3 mb-4">
  <h5>Payment Summary</h5>

  <div className="d-flex justify-content-between">
    <span>Total Earnings:</span>
    <strong>Rs. {credits}</strong>
  </div>

  <div className="d-flex justify-content-between">
    <span>Admin Fee (20%):</span>
    <strong className="text-danger">
      Rs. {adminFee}
    </strong>
  </div>
</div>
          {/* JazzCash Details */}
          <div className="border rounded p-3 mb-4">

            <h5 className="mb-3">JazzCash Payment Details</h5>

            <p className="mb-2">
              <strong>Account Holder:</strong>
              <br />
              {accountHolder}
            </p>

            <p className="mb-2">
              <strong>JazzCash Number:</strong>
            </p>

            <div className="d-flex align-items-center gap-2">

              <strong>{jazzCashNumber}</strong>

              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleCopyNumber}
              >
                {copied ? (
                  <>
                    <FaCheckCircle /> Copied
                  </>
                ) : (
                  <>
                    <FaCopy /> Copy
                  </>
                )}
              </Button>

            </div>

          </div>

          {/* Upload Receipt */}
          <Form.Group>
            <Form.Label>
              <strong>Upload Payment Receipt</strong>
            </Form.Label>

            <Form.Control
              type="file"
              accept="image/*,.pdf"
              onChange={handleReceiptUpload}
            />

            <Form.Text className="text-muted">
              Upload a screenshot or PDF of your JazzCash payment receipt.
            </Form.Text>
          </Form.Group>

          {receipt && (
            <div className="mt-3 alert alert-success">
              Receipt selected: <strong>{receipt.name}</strong>
            </div>
          )}

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={() => setShowPaymentModal(false)}
          >
            Cancel
          </Button>

          <Button
            variant="success"
            onClick={handleSubmitPayment}
          >
            Submit Payment Request
          </Button>

        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModeratorNavbar;