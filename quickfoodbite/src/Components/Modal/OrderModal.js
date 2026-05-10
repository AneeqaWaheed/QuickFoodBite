    import React from "react";

const OrderModal = ({
  showModal,
  setShowModal,
  handleProceed,
  loading,
}) => {
  if (!showModal) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-3 shadow">

          {/* HEADER */}
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold">
              We’re finding a moderator for your order 🍔
            </h5>

            <button
              type="button"
              className="btn-close"
              onClick={() => setShowModal(false)}
            ></button>
          </div>

          {/* BODY */}
          <div className="modal-body text-center">

            <p className="mb-2">
              Please wait while your order is being picked by a moderator.
            </p>

            <p className="text-muted mb-2">
              Your order will be placed when you receive a confirmation message from the moderator
            </p>

            <p className="text-danger small">
              If not picked within 10 minutes, you can place your order again.
            </p>

          </div>

          {/* FOOTER */}
          <div className="modal-footer border-0 d-flex flex-column gap-2">

            <button
              className="btn btn-success w-100"
              onClick={handleProceed}
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm Order via WhatsApp"}
            </button>

            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderModal;