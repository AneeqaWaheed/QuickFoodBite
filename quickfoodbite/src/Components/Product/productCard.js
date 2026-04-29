// ProductCard.js
import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { name, price, } = product;
  console.log("asbndasdnasm", product);
  // const shortDesc = description.split(" ").slice(0, 10).join(" ");
  return (
    <Link
      to={`/Productpage/${product._id}`}
      style={{
        textDecoration: "none",
      }}
    >
      <Card className="m-3" style={{ width: "18rem", marginRight: "3px" }}>
        
        <Card.Body className="text-start">
          <Card.Title style={{ fontSize: "20px", fontWeight: "bold" }}>{name}</Card.Title>
          {/* <Card.Text>{shortDesc}</Card.Text> */}
          <Card.Text style={{ color: "Red", fontSize: "20px" }}>${price}</Card.Text>
          <Button variant="danger" className="w-100">Order Now</Button>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default ProductCard;
