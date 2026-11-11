
import React, { useState } from "react";
import {
  Dropdown,
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

  const credits = Number(user?.creditBalance ?? 0);
  const MIN_DEPOSIT = 100;
  const CREDIT_LIMIT = -10;

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [depositAmount, setDepositAmount] = useState("100");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Admin payment details
  const IBAN = "12787902822003";
  const accountHolder = "Dayan aa";

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(IBAN);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      alert("Unable to copy number.");
    }
  };

  const handleReceiptUpload = (e) => {
    setReceipt(e.target.files[0] || null);
  };

  const handleSubmitPayment = async () => {
    const amount = Number(depositAmount);

    if (!Number.isFinite(amount) || amount < MIN_DEPOSIT) {
      alert("Minimum deposit amount is Rs. 100.");
      return;
    }

    if (!receipt) {
      alert("Please upload your payment receipt.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("amount", amount);
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
        alert(
          "Deposit request submitted successfully. Your credits will be updated after admin approval."
        );

        setShowPaymentModal(false);
        setReceipt(null);
        setDepositAmount("100");
      }
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
        "Something went wrong while submitting your deposit."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    if (loading) return;

    setShowPaymentModal(false);
    setReceipt(null);
  };

  return (
    <>
      <nav className="navbar navbar-dark bg-dark px-3">
        <div className="container-fluid justify-content-end align-items-center">

          {/* Wallet Balance */}
          <div className="d-flex align-items-center gap-3 me-3">

            <span
              className={`fw-bold ${
                credits <= CREDIT_LIMIT
                  ? "text-danger"
                  : "text-white"
              }`}
            >
              {credits <= CREDIT_LIMIT ? "⚠ " : ""}
              Credits: Rs. {credits.toFixed(2)}
            </span>

            <Button
              variant="success"
              size="sm"
              onClick={() => setShowPaymentModal(true)}
            >
              + Load Credits
            </Button>

          </div>

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

      {/* Deposit Modal */}
      <Modal
        show={showPaymentModal}
        onHide={handleCloseModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Load Wallet Credits</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          {credits <= CREDIT_LIMIT && (
            <div className="alert alert-danger">
              Your wallet balance has reached Rs. -10.
              Please deposit funds to continue picking orders.
            </div>
          )}

          {credits > CREDIT_LIMIT && (
            <div className="alert alert-info">
              Your current wallet balance is Rs. {credits.toFixed(2)}.
              You can deposit more credits whenever needed.
            </div>
          )}

          {/* Current Balance */}
          <div className="border rounded p-3 mb-3">
            <div className="d-flex justify-content-between">
              <span>Current Balance</span>
              <strong>Rs. {credits.toFixed(2)}</strong>
            </div>

            <div className="d-flex justify-content-between mt-2">
              <span>Minimum Deposit</span>
              <strong>Rs. 100</strong>
            </div>
          </div>

          {/* Deposit Amount */}
          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Deposit Amount (Rs.)</strong>
            </Form.Label>

            <Form.Control
              type="number"
              min={MIN_DEPOSIT}
              step="1"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Enter deposit amount"
            />

            <Form.Text className="text-muted">
              Minimum deposit is Rs. 100.
            </Form.Text>
          </Form.Group>

          {/* JazzCash Details */}
          <div className="border rounded p-3 mb-3">
            <h5 className="mb-3">Payment Details</h5>

            <p className="mb-2">
              <strong>Account Holder:</strong>
              <br />
              {accountHolder}
            </p>

            <p className="mb-2">
              <strong>IBAN:</strong>
            </p>

            <div className="d-flex align-items-center gap-2">
              <strong>{IBAN}</strong>

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

          {/* Receipt Upload */}
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
              Upload your JazzCash/bank transfer screenshot or PDF.
            </Form.Text>
          </Form.Group>

          {receipt && (
            <div className="mt-3 alert alert-success">
              Selected: <strong>{receipt.name}</strong>
            </div>
          )}

        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="success"
            onClick={handleSubmitPayment}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Deposit Request"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModeratorNavbar;
