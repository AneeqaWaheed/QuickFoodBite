import React from "react";
import Layout from "../Components/Layout/Layout";
import HomeSection1 from "../Components/HomeSection1.js";
import BurgerCategories from "../Components/BurgerCategories.js";
import ContactForm from "../Components/ContactForm.js";
import ClientSays from "../Components/ClientSays.js";
import { Link } from "react-router-dom";
const HomePage = () => {
  return (
    <Layout title="Home">
      <HomeSection1
        imageUrl="Images/about.jpg"
        linkElement={
          <Link to="/about" className="fw-bold btn btn-danger">
            View More
          </Link>
        }
      />
      <BurgerCategories />
      <ClientSays />
      <ContactForm />
    </Layout>
  );
};

export default HomePage;
