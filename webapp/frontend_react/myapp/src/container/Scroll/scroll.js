import React, { useState, useEffect } from "react";
import Model1Component from "../Model1/model1";
import Model2Component from "../Model2/model2";
import Model3Component from "../Model3/model3";
import ProgressBar from "../ProgressionBar/ProgressionBar";
import "./scroll.css";

const SequentialRenderer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Callback function to move to the next component
  const moveToNextComponent = () => {
    if (currentIndex < components.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const components = [
    <Model1Component key={0} onEventHappened={moveToNextComponent} />,
    <Model2Component key={1} onEventHappened={moveToNextComponent} />,
    <Model3Component key={2} onEventHappened={moveToNextComponent} />,
  ];

  return (
    <>
      <div className="ProgressBar">
        <ProgressBar index={currentIndex} />
      </div>
      <div>{components[currentIndex]}</div>
    </>
  );
};

export default SequentialRenderer;
