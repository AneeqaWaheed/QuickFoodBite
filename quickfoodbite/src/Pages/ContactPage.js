import React from "react";
import Layout from "../Components/Layout/Layout";
import ContactForm from "../Components/ContactForm";
import "../styles/ContactPage.css";
const ContactPage = () => {
  return (
    <Layout title="Contact - BurgerShop">
      <div className="container d-flex flex-column justify-content-center align-items-center">
        <h1 className="text-danger fw-bold fdbck">Your FeedBack</h1>
        <p className="p-3 m-4 text-center fs-4">
          Have some restaurant feedback about your recent visit? Tell us what
          you loved, or file a complaint in the form below so we can make your
          experience better next time
        </p>
      </div>
      <div className="container d-flex justify-content-end">
        <img src="Images/contact.jpg" alt="" width={"200px"} height={"200px"} />
      </div>

      <ContactForm />
    </Layout>
  );
};

export default ContactPage;
