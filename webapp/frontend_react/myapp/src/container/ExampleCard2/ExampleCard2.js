import React from "react";
import "./ExampleCard1.css"; // Assuming you have a CSS file for styling
import Boy1 from "./Boy1.png";

const ExampleCard1 = () => {
  return (
    <div className="procard">
      <div className="Boyimage">
        <img
          src={Boy1}
          alt="Description "
          style={{
            marginTop: "15%",
            marginLeft: "-15%",
            width: "200%", // Set width to 100% of the container
            height: "auto", // Adjust height automatically to maintain aspect ratio
            maxWidth: "500px",
          }}
        />
      </div>
      <div className="Boytext">
        Boy <br /> <span className="pronunciation">/bɔɪ/</span>
      </div>
    </div>
  );
};

export default ExampleCard1;
