import React from "react";
import Layout from "../Components/Layout/Layout";
import HomeSection1 from "../Components/HomeSection1";
import FounderSays from "../Components/FounderSays";
import OurPromise from "../Components/OurPromise";
import OurMission from "../Components/OurMission";

const About = () => {
  return (
    <Layout title={"About - BurgerShop"}>
      <OurMission />
      <HomeSection1 imageUrl="Images/about1.jpg" />
      <FounderSays />
      <OurPromise />
    </Layout>
  );
};

export default About;
