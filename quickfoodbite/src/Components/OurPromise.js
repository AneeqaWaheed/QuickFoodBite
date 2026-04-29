import React from "react";
import "../styles/OurPromise.css";
const OurPromise = () => {
  return (
    <>
      <div className="container-fluid p-4 my-3">
        <div className="row pt-4 ps-4">
          <h1 className="prms">OUR PROMISE</h1>
        </div>
        <div className="row p-4">
          <div className="col">
            <h1 className="text-danger nmbrs">1</h1>
            <h4 className="story-heading underlined-heading fs-2">
              Food Quality
            </h4>
            <p>
              We take pride in offering exceptional food quality that delights
              your taste buds with every bite. Our dishes are prepared using the
              freshest ingredients, sourced from trusted local farms and
              suppliers. We adhere to the highest standards of hygiene and
              culinary excellence, ensuring that every meal is not only
              delicious but also safe and nutritious.
            </p>
          </div>
          <div className="col">
            <h1 className="text-danger nmbrs">2</h1>
            <h4 className="story-heading underlined-heading fs-2">
              Fresh and Healthy Ingredients
            </h4>
            <p>
              We use only the finest, fresh, and locally sourced ingredients in
              our dishes. Each component is carefully selected to ensure maximum
              flavor, quality, and nutrition. Enjoy meals made with the best
              nature has to offer.
            </p>
          </div>
          <div className="col">
            <h1 className="text-danger nmbrs">3</h1>
            <h4 className="story-heading underlined-heading fs-2">
              Free Delivery
            </h4>
            <p>
              Enjoy free delivery on all orders, bringing your favorite meals
              straight to your door. No hidden fees, just delicious food
              delivered at no extra cost. Convenient, fast, and always free!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OurPromise;
