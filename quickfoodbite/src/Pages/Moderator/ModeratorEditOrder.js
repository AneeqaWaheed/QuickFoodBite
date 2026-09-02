import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";

const ModeratorEditOrder = ({
  show,
  onClose,
  order,
  onUpdated,
}) => {
  const [auth] = useAuth();

  const [products, setProducts] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [saving, setSaving] = useState(false);

  /*
    Load order into modal
  */
useEffect(() => {
  if (order) {
    setEditingOrder({
      ...order,
      items: [...order.items],
    });
  }
}, [order]);
  /*
    Get available products
  */
  useEffect(() => {
    const getProducts = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/product/get-product`
        );

        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.log("GET PRODUCTS ERROR:", error);
      }
    };

    if (show) {
      getProducts();
    }
  }, [show]);

  if (!show || !editingOrder) {
    return null;
  }

  /*
    Add product
  */
  const addProduct = () => {
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }

    const product = products.find(
      (p) => p._id === selectedProduct
    );

    if (!product) {
      toast.error("Product not found");
      return;
    }

    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty <= 0) {
      toast.error("Invalid quantity");
      return;
    }

    const existingItem = editingOrder.items.find(
      (item) =>
        item.productId?.toString() === product._id.toString()
    );

    let updatedItems;

    if (existingItem) {
      updatedItems = editingOrder.items.map((item) =>
        item.productId?.toString() === product._id.toString()
          ? {
              ...item,
              quantity: Number(item.quantity) + qty,
            }
          : item
      );
    } else {
      updatedItems = [
        ...editingOrder.items,
        {
          productId: product._id,
          name: product.name,
          price: Number(product.price),
          quantity: qty,
        },
      ];
    }

    setEditingOrder({
      ...editingOrder,
      items: updatedItems,
    });

    setSelectedProduct("");
    setQuantity(1);
  };

  /*
    Remove product
  */
  const removeItem = (productId) => {
    setEditingOrder({
      ...editingOrder,
      items: editingOrder.items.filter(
        (item) =>
          item.productId?.toString() !== productId.toString()
      ),
    });
  };

  /*
    Change quantity
  */
  const changeQuantity = (productId, value) => {
    const newQuantity = Number(value);

    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    setEditingOrder({
      ...editingOrder,
      items: editingOrder.items.map((item) =>
        item.productId?.toString() === productId.toString()
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item
      ),
    });
  };

  /*
    Calculate subtotal
  */
  const calculateSubtotal = () => {
    return editingOrder.items.reduce(
      (total, item) =>
        total +
        Number(item.price) * Number(item.quantity),
      0
    );
  };

  /*
    Save changes
  */
  const saveChanges = async () => {
    if (!editingOrder.items.length) {
      toast.error("Order must contain at least one item");
      return;
    }

    const newSubtotal = calculateSubtotal();
    const oldSubtotal = Number(editingOrder.subtotal || 0);

    if (newSubtotal < oldSubtotal) {
      toast.error(
        `Subtotal cannot be less than Rs.${oldSubtotal}`
      );
      return;
    }

    try {
      setSaving(true);

      const items = editingOrder.items.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
      }));

      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/orders/update-items/${editingOrder._id}`,
        { items },
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );

      if (data.success) {
        toast.success("Order updated successfully");

        /*
          Tell Orders page about updated order
        */
        if (onUpdated) {
          onUpdated(data.order);
        }

        /*
          Close modal
        */
        onClose();

        /*
          Open WhatsApp
        */
        if (data.whatsappUrl) {
          window.open(data.whatsappUrl, "_blank");
        }
      }
    } catch (error) {
      console.log("UPDATE ORDER ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update order"
      );
    } finally {
      setSaving(false);
    }
  };

  const subtotal = calculateSubtotal();

  return (
    <>
      {/* Modal backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">

            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">
                Edit Order #
                {editingOrder.orderNumber ||
                  editingOrder._id}
              </h5>

              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              />
            </div>

            {/* Body */}
            <div className="modal-body">

              {/* Customer */}
              <div className="mb-4">
                <strong>Customer:</strong>{" "}
                {editingOrder.userName}
                <br />

                <strong>Phone:</strong>{" "}
                {editingOrder.phone}
              </div>

              {/* Items */}
              <h6>Current Items</h6>

              {editingOrder.items.map((item) => (
                <div
                  key={item.productId}
                  className="row align-items-center border-bottom py-2"
                >
                  <div className="col-md-4">
                    <strong>{item.name}</strong>
                  </div>

                  <div className="col-md-2">
                    Rs.{item.price}
                  </div>

                  <div className="col-md-3">
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={item.quantity}
                      onChange={(e) =>
                        changeQuantity(
                          item.productId,
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="col-md-3 text-end">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        removeItem(item.productId)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {/* Add product */}
              <div className="mt-4">
                <h6>Add Product</h6>

                <div className="row g-2">

                  <div className="col-md-7">
                    <select
                      className="form-select"
                      value={selectedProduct}
                      onChange={(e) =>
                        setSelectedProduct(e.target.value)
                      }
                    >
                      <option value="">
                        Select Product
                      </option>

                      {products.map((product) => (
                        <option
                          key={product._id}
                          value={product._id}
                        >
                          {product.name} - Rs.
                          {product.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-3">
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-2">
                    <button
                      className="btn btn-primary w-100"
                      onClick={addProduct}
                    >
                      Add
                    </button>
                  </div>

                </div>
              </div>

              {/* Summary */}
              <div className="mt-4 p-3 bg-light rounded">

                <div className="d-flex justify-content-between">
                  <strong>Previous Subtotal</strong>
                  <strong>
                    Rs.{editingOrder.subtotal}
                  </strong>
                </div>

                <div className="d-flex justify-content-between mt-2">
                  <strong>New Subtotal</strong>
                  <strong>
                    Rs.{subtotal}
                  </strong>
                </div>

                <hr />

                <div className="d-flex justify-content-between">
                  <span>Delivery Charges</span>
                  <span>
                    Rs.{editingOrder.deliveryCharges || 0}
                  </span>
                </div>

                <div className="d-flex justify-content-between">
                  <span>Packaging Fee</span>
                  <span>
                    Rs.{editingOrder.PackagingFee || 0}
                  </span>
                </div>

                <div className="d-flex justify-content-between mt-2">
                  <strong>New Total</strong>
                  <strong>
                    Rs.
                    {subtotal +
                      Number(
                        editingOrder.deliveryCharges || 0
                      ) +
                      Number(
                        editingOrder.PackagingFee || 0
                      )}
                  </strong>
                </div>

                {subtotal <
                  Number(editingOrder.subtotal || 0) && (
                  <div className="alert alert-danger mt-3 mb-0">
                    Updated subtotal cannot be less than
                    the original subtotal.
                  </div>
                )}

              </div>

            </div>

            {/* Footer */}
            <div className="modal-footer">

              <button
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                className="btn btn-success"
                disabled={
                  saving ||
                  subtotal <
                    Number(editingOrder.subtotal || 0)
                }
                onClick={saveChanges}
              >
                {saving
                  ? "Updating..."
                  : "Confirm Update"}
              </button>

            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ModeratorEditOrder;