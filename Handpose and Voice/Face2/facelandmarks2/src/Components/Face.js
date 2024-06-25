import React, { useEffect, useRef, useState } from "react";
import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

const FaceLandmarkerComponent = () => {
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [runningMode, setRunningMode] = useState("IMAGE");
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [enableWebcamButton, setEnableWebcamButton] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imageBlendShapesRef = useRef(null);
  const videoBlendShapesRef = useRef(null);
  const demosSectionRef = useRef(null);

  useEffect(() => {
    const initializeFaceLandmarker = async () => {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );
      const flm = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU",
        },
        outputFaceBlendshapes: true,
        runningMode,
        numFaces: 1,
      });
      setFaceLandmarker(flm);
      demosSectionRef.current.classList.remove("invisible");
    };

    initializeFaceLandmarker();
  }, []);

  const handleClick = async (event) => {
    if (!faceLandmarker) {
      console.log("Wait for faceLandmarker to load before clicking!");
      return;
    }

    if (runningMode === "VIDEO") {
      setRunningMode("IMAGE");
      await faceLandmarker.setOptions({ runningMode });
    }

    const allCanvas = event.target.parentNode.getElementsByClassName("canvas");
    Array.from(allCanvas).forEach((n) => n.parentNode.removeChild(n));

    const faceLandmarkerResult = await faceLandmarker.detect(event.target);
    const canvas = canvasRef.current;
    canvas.width = event.target.naturalWidth;
    canvas.height = event.target.naturalHeight;

    const ctx = canvas.getContext("2d");
    const drawingUtils = new DrawingUtils(ctx);
    for (const landmarks of faceLandmarkerResult.faceLandmarks) {
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_TESSELATION,
        { color: "#C0C0C070", lineWidth: 1 }
      );
      // Add other drawingUtils.drawConnectors calls here
    }

    drawBlendShapes(
      imageBlendShapesRef.current,
      faceLandmarkerResult.faceBlendshapes
    );
  };
  ////////videooooooooo

  const enableCam = (event) => {
    if (!faceLandmarker) {
      console.log("Wait! faceLandmarker not loaded yet.");
      return;
    }

    if (webcamRunning) {
      setWebcamRunning(false);
      enableWebcamButton.innerText = "ENABLE PREDICTIONS";
    } else {
      setWebcamRunning(true);
      enableWebcamButton.innerText = "DISABLE PREDICTIONS";
    }

    const constraints = { video: true };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      videoRef.current.srcObject = stream;
      videoRef.current.addEventListener("loadeddata", predictWebcam);
    });
  };

  const predictWebcam = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const drawingUtils = new DrawingUtils(ctx);

    video.style.width = "100%";
    const radio = video.videoHeight / video.videoWidth;
    video.style.height = `${video.offsetWidth * radio}px`;
    canvas.style.width = "100%";
    canvas.style.height = `${video.offsetWidth * radio}px`;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (runningMode === "IMAGE") {
      setRunningMode("VIDEO");
      await faceLandmarker.setOptions({ runningMode: "VIDEO" });
    }

    let startTimeMs = performance.now();
    const results = await faceLandmarker.detectForVideo(video, startTimeMs);

    if (results.faceLandmarks) {
      for (const landmarks of results.faceLandmarks) {
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_TESSELATION,
          { color: "#C0C0C070", lineWidth: 1 }
        );
        // Add other drawingUtils.drawConnectors calls here
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
          { color: "#FF3030" }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
          { color: "#FF3030" }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
          { color: "#30FF30" }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
          { color: "#30FF30" }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
          { color: "#E0E0E0" }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LIPS,
          { color: "#E0E0E0" }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
          { color: "#FF3030" }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
          { color: "#30FF30" }
        );
      }
    }

    drawBlendShapes(videoBlendShapesRef.current, results.faceBlendshapes);

    if (webcamRunning) {
      window.requestAnimationFrame(predictWebcam);
    }
  };

  const drawBlendShapes = (el, blendShapes) => {
    if (!blendShapes || !blendShapes.length) {
      return;
    }

    let htmlMaker = "";
    blendShapes[0].categories.forEach((shape) => {
      htmlMaker += `
        <li class="blend-shapes-item">
          <span class="blend-shapes-label">${
            shape.displayName || shape.categoryName
          }</span>
          <span class="blend-shapes-value" style="width: calc(${
            +shape.score * 100
          }% - 120px)">${(+shape.score).toFixed(4)}</span>
        </li>
      `;
    });

    el.innerHTML = htmlMaker;
  };

  return (
    <div>
      <h1>Face landmark detection using the MediaPipe FaceLandmarker task</h1>

      <section id="demos" className="invisible" ref={demosSectionRef}>
        <h2>Demo: Detecting Images</h2>
        <p>
          <b>Click on an image below</b> to see the key landmarks of the face.
        </p>

        <div className="detectOnClick">
          <img
            src="https://storage.googleapis.com/mediapipe-assets/portrait.jpg"
            width="100%"
            onClick={handleClick}
            alt="Portrait"
            crossOrigin="anonymous"
            title="Click to get detection!"
          />
        </div>
        <div className="blend-shapes">
          <ul className="blend-shapes-list" ref={imageBlendShapesRef}></ul>
        </div>

        <h2>Demo: Webcam continuous face landmarks detection</h2>
        <p>
          Hold your face in front of your webcam to get real-time face
          landmarker detection.
          <br />
          Click <b>enable webcam</b> below and grant access to the webcam if
          prompted.
        </p>

        <div id="liveView" className="videoView">
          <button
            id="webcamButton"
            className="mdc-button mdc-button--raised"
            onClick={enableCam}
            ref={(button) => setEnableWebcamButton(button)}
          >
            <span className="mdc-button__ripple"></span>
            <span className="mdc-button__label">ENABLE WEBCAM</span>
          </button>
          <div style={{ position: "relative" }}>
            <video id="webcam" ref={videoRef} autoPlay playsInline></video>
            <canvas
              className="output_canvas"
              id="output_canvas"
              ref={canvasRef}
              style={{ position: "absolute", left: "0px", top: "0px" }}
            ></canvas>
          </div>
        </div>
        <div className="blend-shapes">
          <ul className="blend-shapes-list" ref={videoBlendShapesRef}></ul>
        </div>
      </section>
    </div>
  );
};

export default FaceLandmarkerComponent;
