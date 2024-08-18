import React from "react";
import "./ExampleCard2.css"; // Assuming you have a CSS file for styling
import Toy from "./Toy.png";

const ExampleCard1 = () => {
  return (
    <div className="procard">
      <div className="Soyimage">
        <img
          src={Toy}
          alt="Description "
          style={{
            marginTop: "15%",
            marginRight: "60%",
            margin: "0 auto",
            display: "block",
            width: "75%", // Set width to 100% of the container
            height: "auto", // Adjust height automatically to maintain aspect ratio
            maxWidth: "500px",
          }}
        />
      </div>
      <div className="Soytext">
        Toy <br /> <span className="pronunciation">/tɔɪ/</span>
      </div>
    </div>
  );
};

export default ExampleCard1;
