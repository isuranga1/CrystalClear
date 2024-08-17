import React from "react";
import "./ExampleCard1.css"; // Assuming you have a CSS file for styling
import Boy1 from "./Boy1.png";

const ExampleCard1 = () => {
  return (
    <div className="procard">
      <div className="Boyimage">
        <img src={Boy1} alt="Description " />
      </div>
      <div className="Boytext">
        Boy <br /> <span className="pronunciation">/bɔɪ/</span>
      </div>
    </div>
  );
};

export default ExampleCard1;
