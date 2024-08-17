import React from "react";
import "./ExampleCard3.css"; // Assuming you have a CSS file for styling
import Joy from "./Joy.png";

const ExampleCard1 = () => {
  return (
    <div className="procard">
      <div className="Joyimage">
        <img
          src={Joy}
          alt="Description "
          style={{
            marginTop: "-5%",
            marginLeft: "30%",
            width: "45%", // Set width to 100% of the container
            height: "auto", // Adjust height automatically to maintain aspect ratio
            maxWidth: "500px",
          }}
        />
      </div>
      <div className="Joytext">
        Joy <br /> <span className="pronunciation">/jɔɪ/</span>
      </div>
    </div>
  );
};

export default ExampleCard1;
