import React from "react";
import HandposeComponent from "./Components/model";
import FaceLandmarkerComponent from "./Components/face";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="HandposeComponent">
        <HandposeComponent />
      </div>
    </div>
  );
}

export default App;
