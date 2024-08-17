import React from "react";
import "./ExampleCard2.css"; // Assuming you have a CSS file for styling
import Soy from "./Soy.png";

const ExampleCard1 = () => {
  return (
    <div className="procard">
      <div className="Soyimage">
        <img
          src={Soy}
          alt="Description "
          style={{
            marginTop: "15%",
            marginRight: "50%",
            margin: "0 auto",
            display: "block",
            width: "75%", // Set width to 100% of the container
            height: "auto", // Adjust height automatically to maintain aspect ratio
            maxWidth: "500px",
          }}
        />
      </div>
      <div className="Soytext">
        Soy <br /> <span className="pronunciation">/sɔɪ/</span>
      </div>
    </div>
  );
};

export default ExampleCard1;
