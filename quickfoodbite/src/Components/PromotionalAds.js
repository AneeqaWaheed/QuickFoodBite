import { useEffect, useState } from "react";
import axios from "axios";

const PromotionalAds = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const getAds = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/ads/active`
        );

        if (data.success) {
          setAds(data.ads);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAds();
  }, []);

  if (ads.length === 0) {
    return null;
  }

  return (
    <section className="container-fluid my-2 px-0">
      {ads.map((ad) => (
        <div className="mb-4" key={ad._id}>
          <a
            href={ad.buttonLink || "#"}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              position: "relative",
              textDecoration: "none",
            }}
          >
            <img
              src={ad.image}
              alt={ad.buttonText || "Promotional Advertisement"}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />

            {ad.buttonText && (
              <span
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "#0d6efd",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: "500",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  lineHeight: "1",
                }}
              >
                {ad.buttonText}
              </span>
            )}
          </a>
        </div>
      ))}
    </section>
  );
};

export default PromotionalAds;