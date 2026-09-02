import { useEffect } from "react";

const SimpleLayout = ({ children, title }) => {
  useEffect(() => {
    document.title = title || "Fleent";
  }, [title]);

  return <>{children}</>;
};
export default SimpleLayout;