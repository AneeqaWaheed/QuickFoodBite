// ProductsList.js
import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import ProductCard from "../Components/Product/productCard";
import { toast } from "react-toastify";

const ProductsList = ({ products }) => {
  // Check if products list is empty
  if (products.length === 0) {
    return <p className="text-center mt-5">No products found.</p>;
  }

  return (
    <Container className="my-5">
      <Row className="">
        {products.map((product) => (
          <Col
            key={product._id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xlg={3}
            style={{ margin: "30px" }}
          >
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductsList;
