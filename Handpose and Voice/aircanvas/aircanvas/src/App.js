import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { ChromePicker } from "react-color";
import "./App.css";
import { OpenCvProvider, useOpenCv } from "opencv-react";

const colors = ["#0000FF", "#00FF00", "#FF0000", "#FFFF00"];

function MyComponent() {
  const data = useOpenCv();
  console.log(data);
  return <p>OpenCv React test</p>;
}

function App() {
  const onLoaded = (cv) => {
    console.log("opencv loaded", cv);
  };
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [color, setColor] = useState("#0000FF");
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState({
    blue: [],
    green: [],
    red: [],
    yellow: [],
  });
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (webcamRef.current && canvasRef.current) {
        const video = webcamRef.current.video;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Here you would implement OpenCV logic in JavaScript or WebAssembly
        // For now, we just capture the frame

        // Simulate the drawing logic
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        for (let i = 0; i < points.blue.length - 1; i++) {
          ctx.beginPath();
          ctx.moveTo(points.blue[i].x, points.blue[i].y);
          ctx.lineTo(points.blue[i + 1].x, points.blue[i + 1].y);
          ctx.stroke();
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [color, points]);

  const handleMouseMove = (e) => {
    if (drawing) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPoints((prevPoints) => {
        const updatedPoints = { ...prevPoints };
        if (colorIndex === 0) updatedPoints.blue.push({ x, y });
        else if (colorIndex === 1) updatedPoints.green.push({ x, y });
        else if (colorIndex === 2) updatedPoints.red.push({ x, y });
        else if (colorIndex === 3) updatedPoints.yellow.push({ x, y });
        return updatedPoints;
      });
    }
  };

  const handleMouseDown = () => {
    setDrawing(true);
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  const handleClear = () => {
    setPoints({ blue: [], green: [], red: [], yellow: [] });
  };

  return (
    <div className="App">
      <Webcam ref={webcamRef} className="webcam" />
      <canvas
        ref={canvasRef}
        className="canvas"
        width={640}
        height={480}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
      <OpenCvProvider onLoad={onLoaded} openCvPath="/opencv/opencv.js">
        <MyComponent />
      </OpenCvProvider>
      <div className="controls">
        <button onClick={handleClear}>Clear</button>
        {colors.map((c, index) => (
          <button
            key={c}
            style={{ backgroundColor: c }}
            onClick={() => setColorIndex(index)}
          />
        ))}
        <ChromePicker color={color} onChangeComplete={(c) => setColor(c.hex)} />
      </div>
    </div>
  );
}

export default App;
