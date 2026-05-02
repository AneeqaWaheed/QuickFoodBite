import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";
const ClaimOrder = () => {
  const { token } = useParams();

  useEffect(() => {
    axios.get(`${process.env.React_App_API}/api/v1/orders/claim/${token}`)
      .then(res => {
        if (res.data.success) {
          toast.success("Order assigned to you!");
        } else {
          toast.error(res.data.message);
        }
      });
  }, []);

  return <h3>Processing order...</h3>;
};
export default ClaimOrder