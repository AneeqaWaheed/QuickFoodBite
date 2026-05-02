import { useEffect } from "react";

const SimpleLayout = ({ children, title }) => {
  useEffect(() => {
    document.title = title || "QuickFoodBite";
  }, [title]);

  return <>{children}</>;
};
export default SimpleLayout;