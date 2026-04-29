import React from "react";
import "../styles/category.css";
import burgerCategories from "../data/category.js";
const BurgerCategories = () => {
  return (
    <>
      <h1 className="text-danger text-center"> Categories</h1>
      <div className="burger-categories">
        {burgerCategories.map((burger) => (
          <div key={burger.id} className="burger-category">
            <img
              src={burger.imageUrl}
              alt={burger.title}
              className="burger-image"
            />
            <h3 className="burger-title">{burger.title}</h3>
          </div>
        ))}
      </div>
    </>
  );
};

export default BurgerCategories;
