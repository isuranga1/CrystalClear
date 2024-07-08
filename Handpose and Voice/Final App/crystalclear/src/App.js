import React from "react";
import Model1ComponentComponent from "./Components/model1";
import FaceLandmarkerComponent from "./Components/face";
import SequentialRenderer from "./Components/scroll";
import "./App.css";
import ParticlesComponent from "./Components/particlesbackground";
import ProgressBar from "./Components/ProgressionBar";

function App() {
  return (
    <div className="App">
      <div>
        <SequentialRenderer />
      </div>
    </div>
  );
}

export default App;
