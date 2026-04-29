import React from "react";
import Slider from "react-slick";
import "../styles/clientsays.css";
import Clients from "../data/ClientSays";

const ClientSays = () => {
  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="bg-client">
      <h1 className="clientsSays text-center">What Our Clients Says</h1>
      <Slider {...settings}>
        {Clients.map((reviews) => (
          <div
            key={reviews.id}
            className="client-category d-flex flex-column justify-content-center align-items-center"
          >
            <img
              src={reviews.imgURL}
              alt={reviews.name}
              className="client-image my-3"
            />
            <p className="w-50 mx-auto my-4 text-center">{reviews.desc}</p>
            <h3 className="text-danger">{reviews.name}</h3>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ClientSays;
