import React, { useEffect, useRef, useState } from "react";
import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;
const FaceLandmarkerComponent = () => {
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [enableWebcamButton, setEnableWebcamButton] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imageBlendShapesRef = useRef(null);
  const videoBlendShapesRef = useRef(null);
  const demosSectionRef = useRef(null);
  const pronoun = useRef(null);
  const boo = useRef(null);
  let eee = 0;
  let count = 0;
  let jawopenscore;
  const [Pronounciation, setPronounciation] = useState(null);
  let animationFrameId;

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
        runningMode: "VIDEO",
        numFaces: 1,
      });
      setFaceLandmarker(flm);
    };

    initializeFaceLandmarker();
    return () => {
      // Clean up faceLandmarker if needed
      if (faceLandmarker) {
        faceLandmarker.close();
      }
    };
  }, []);

  /////videooooooooo

  const enableCam = (event) => {
    if (!faceLandmarker) {
      console.log("Wait! faceLandmarker not loaded yet.");
      return;
    }

    if (webcamRunning) {
      setWebcamRunning(false);
      enableWebcamButton.innerText = "ENABLE PREDICTIONS";
      stopWebcam();
    } else {
      setWebcamRunning(true);
      enableWebcamButton.innerText = "DISABLE PREDICTIONS";
      startWebcam();
    }
  };

  const startWebcam = () => {
    const constraints = { video: true };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      videoRef.current.srcObject = stream;
      videoRef.current.addEventListener("loadeddata", predictWebcam);
    });
  };

  const stopWebcam = () => {
    // Stop the webcam stream
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());

    // Remove the srcObject to release the webcam
    videoRef.current.srcObject = stream;
    // Cancel the animation frame to stop predictions
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };
  const predictWebcam = async () => {
    const video = videoRef.current;
    if (!video.videoWidth || !video.videoHeight) {
      console.log("Video dimensions are not ready.");
      return;
    }
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
    let categories = {
      categories: [
        /* Array elements */
      ],
      headIndex: -1,
      headName: "",
    };
    categories = results.faceBlendshapes[0];
    //console.log(categories);
    if (categories && categories.categories) {
      let jawOpenElement = categories.categories.find(
        (item) => item.categoryName === "jawOpen"
      );
      let jawcloseElement = categories.categories.find(
        (item) => item.categoryName === "mouthPucker"
      );
      jawopenscore = jawOpenElement["score"];
      eee = jawcloseElement["score"];

      //console.log(jawopenscore);
      //console.log(eee);
    } else {
      console.error("categories or categories.categories is undefined");
    }

    if (!webcamRunning) {
      window.requestAnimationFrame(predictWebcam);
      await myDisplay(jawopenscore);
    }
  }; //////////////

  // Declare the promise outside to maintain its scope
  /*const intervalId = setInterval(async () => {
    count++;
    console.log(count);

    // Call myDisplay and pass the current count
    await myDisplay(count);

    // Stop after 10 counts
    if (count >= 10) {
      clearInterval(intervalId);
    }
  }, 1000);*/
  async function myDisplay(count) {
    let delayedPromise;
    try {
      // Initialize the promise when count == 5
      if (count > 0.3) {
        delayedPromise = new Promise(function (resolve) {
          // Delay for a certain time (e.g., 3000 ms)
          setTimeout(function () {
            resolve("Ready at 8");
          }, 3000); // delay in milliseconds
        });

        // Display count immediately at 5
        console.log(count);
      }

      // Check if count == 8 and the delayedPromise exists
      //if (delayedPromise) {
      // Update the content after the delayed promise resolves
      let y = await delayedPromise;
      console.log(y);
      if (jawopenscore < 0.2 && y === "Ready at 8") {
        console.log("nice");
        console.log(count);
      }
      //}

      // Directly display count if count is greater than 5 but not specifically 5 or 8
      //if (count > 5 && count !== 8) {
      //document.getElementById("demo").innerHTML = count;
      //}
    } catch (error) {
      console.error("Error in myDisplay:", error);
    }
  } /////////*/
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
