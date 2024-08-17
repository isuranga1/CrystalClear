import React, { useRef, useState, useEffect } from "react";
import "./model1.css";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import { drawHand } from "../utilities";
import * as fp from "fingerpose";
import victory from "./victory.png";
import BoyDemo from "./BoyDemo.mp4";
import thumbs_up from "./thumbs_up.png";
import YouTube from "react-youtube";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
import ParticlesBackground from "../particlesbackground";
import { Player } from "video-react";
import "./videoreact.css";
import Popup from "../Popup/Popup";
import ExampleCard1 from "../ExampleCard1/ExampleCard1";

const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

// Import FingerCurl and FingerDirection from fingerpose

const { FingerCurl, FingerDirection } = fp;
let Try = "Try Again";
let ok = 0;
let UA = 0;
let delay = 100;

const Model1Component = ({ onEventHappened }) => {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [enableWebcamButton, setEnableWebcamButton] = useState(null);
  Try = "Try Again";
  if (UA == 2) {
    delay = 2000;
  } else {
    delay = 100;
  }

  const [videoId, setVideoId] = useState("Ig-7QmBvLUA");

  let [UAword, setUAword] = useState(0);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  let [emoji, setEmoji] = useState(null);
  const images = { thumbs_up: thumbs_up, victory: victory };

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    const runHandpose = async () => {
      const net = await handpose.load();
      console.log("Handpose model loaded.");

      setInterval(() => {
        detect(net, transcript);
      }, delay);
    };

    const detect = async (net, currentTranscript) => {
      try {
        // Check data is available
        if (
          webcamRef.current &&
          webcamRef.current.video.readyState === 4 &&
          canvasRef.current
        ) {
          // Get Video Properties
          const video = webcamRef.current.video;
          const videoWidth = video.videoWidth;
          const videoHeight = video.videoHeight;

          // Set video width
          video.width = videoWidth;
          video.height = videoHeight;

          // Set canvas height and width
          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight + 100;

          // Make Detections
          const hand = await net.estimateHands(video);

          // Define gestures
          const UGesture = new fp.GestureDescription("UUU");
          const AGesture = new fp.GestureDescription("AAA");
          // do this for all other fingers
          for (let finger of [
            fp.Finger.Index,
            fp.Finger.Middle,
            fp.Finger.Ring,
            fp.Finger.Pinky,
          ]) {
            UGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
            UGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
            UGesture.addDirection(finger, FingerDirection.HorizontalLeft, 1.0);
            UGesture.addDirection(finger, FingerDirection.HorizontalRight, 1.0);
            UGesture.addDirection(finger, FingerDirection.DiagonalUpRight, 0.8);
            UGesture.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.8);
          }

          for (let finger of [
            fp.Finger.Index,
            fp.Finger.Middle,
            fp.Finger.Ring,
            fp.Finger.Pinky,
          ]) {
            AGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
            AGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
            AGesture.addDirection(finger, FingerDirection.VerticalUp, 1.0);
            AGesture.addDirection(finger, FingerDirection.DiagonalUpRight, 1.0);
            AGesture.addDirection(finger, FingerDirection.DiagonalUpLeft, 1.0);
          }

          if (hand.length > 0) {
            const GE = new fp.GestureEstimator([
              UGesture,
              AGesture,
              fp.Gestures.ThumbsUpGesture,
            ]);
            const gesture = await GE.estimate(hand[0].landmarks, 4);

            if (gesture && gesture.gestures && gesture.gestures.length > 0) {
              const gestureNames = gesture.gestures.map(
                (gesture) => gesture.name
              );
              const gestureScores = gesture.gestures.map(
                (gesture) => gesture.score
              );

              // Find the index of the gesture with the maximum score
              const maxScoreIndex = gestureScores.indexOf(
                Math.max(...gestureScores)
              );

              // Get the name of the gesture with the maximum score
              const maxScoreGestureName = gestureNames[maxScoreIndex];
              const maxScoreGestureScore = gestureScores[maxScoreIndex];

              if (maxScoreGestureScore > 8) {
                if (maxScoreGestureName === "AAA" && UA !== 2) {
                  //console.log("UA:", UA);
                  //console.log("UAword:", UAword);
                  // console.log("maxScoreGestureName:", maxScoreGestureName);
                  //SpeechRecognition.startListening();
                  //console.log(currentTranscript);
                  UA = 1;
                }
                if (maxScoreGestureName === "UUU" && UA === 1) {
                  //setEmoji("victory" || null);

                  UA = 2;
                  //UAword= 0;
                  setTimeout(() => {
                    UA = 0;
                  }, 3000);
                }

                //console.log("Gesture with Max Score:", maxScoreGestureName);
              } else {
                setEmoji(victory);
              }
            } else {
              setEmoji(victory);
            }
          } else {
            setEmoji(victory);
          }

          // Draw mesh
          const ctx = canvasRef.current.getContext("2d");
          drawHand(hand, ctx);
        }
      } catch (error) {
        console.error("Error in detect function:", error);
      }
    };

    runHandpose();
  }, [browserSupportsSpeechRecognition, transcript]);

  // The Dictaphone logic is moved here
  // You can use transcript, listening, resetTranscript, browserSupportsSpeechRecognition as needed
  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      console.log("Transcript:", transcript);
      if (transcript === "Boy." && UA === 2 && ok === 1) {
        console.log("correct broh");
        setIsOpenPopup(true);

        //setTimeout(() => {
        Try = "Correct broh";
        setEmoji("victory" || null);
        //}, 1000);

        //setEmoji("victory" || null);

        UA = 0;
        ok = 0;
      }
    }
  }, [transcript, browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (isOpenPopup) {
      const timer = setTimeout(() => {
        // Add the logic you want to execute after 3 seconds here
        console.log("Popup has been open for 3 seconds");
        // For example, you can close the popup after 3 seconds
        setIsOpenPopup(false);
        onEventHappened();
      }, 3000); // 3 seconds delay

      // Cleanup the timeout if the component unmounts or isOpenPopup changes
      return () => clearTimeout(timer);
    }
  }, [isOpenPopup]);

  useEffect(() => {
    console.log("Emoji updated:", emoji);
  }, [emoji]);

  const videoBlendShapesRef = useRef(null);
  const demosSectionRef = useRef(null);
  let jawopenscore;
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
      webcamRef.current.srcObject = stream;
      webcamRef.current.video.play(); // Start playing the video
      predictWebcam();
    });
  };

  const stopWebcam = () => {
    // Stop the webcam stream
    const stream = webcamRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());

    // Remove the srcObject to release the webcam
    webcamRef.current.srcObject = stream;
    // Cancel the animation frame to stop predictions
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };
  const predictWebcam = async () => {
    if (!webcamRef.current) {
      console.log("Webcam ref is not yet initialized.");
      return;
    }
    const video = webcamRef.current.video;
    if (!video.videoWidth || !video.videoHeight) {
      console.log("Video dimensions are not ready.");
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const drawingUtils = new DrawingUtils(ctx);

    /*video.style.width = "100%";
    const radio = video.videoHeight / video.videoWidth;
    video.style.height = `${video.offsetWidth * radio}px`;
    canvas.style.width = "100%";
    canvas.style.height = `${video.offsetWidth * radio}px`;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;*/

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
          { color: "#00FFF3" }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
          { color: "#00FFF3" }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
          { color: "#00FFF3" }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
          { color: "#00FFF3" }
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
          { color: "#000000" }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
          { color: "#000000" }
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
      jawopenscore = jawOpenElement["score"];

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
            resolve("ok");
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
      if (jawopenscore < 0.2 && y === "ok") {
        ok = 1;
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

    /*let htmlMaker = "";
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

    el.innerHTML = htmlMaker;*/
  };

  return (
    <body>
      <div className="wrapper">
        <ParticlesBackground />

        {browserSupportsSpeechRecognition && (
          <div className="microphone-container1">
            <p>Microphone: {listening ? "on" : "off"}</p>
            <button
              onClick={SpeechRecognition.startListening}
              className="start"
            >
              Start
            </button>
            <button onClick={SpeechRecognition.stopListening} className="stop">
              Stop
            </button>
            <button onClick={resetTranscript} className="reset">
              Reset
            </button>{" "}
            <button
              id="webcamButton"
              className="webcamButton"
              onClick={enableCam}
              ref={(button) => setEnableWebcamButton(button)}
            >
              <span className="mdc-button__ripple"></span>
              <span className="mdc-button__label">ENABLE WEBCAM</span>
            </button>
            <p>{transcript}</p>
          </div>
        )}
        <div>{isOpenPopup && <Popup setIsOpenPopup={setIsOpenPopup} />}</div>
        <div className="webcamvid">
          <div className="wrapperwebcam">
            <div className="Webcam">
              <Webcam ref={webcamRef} />
            </div>
            <div>
              <ExampleCard1 />
            </div>
            <div>
              <canvas className="Canvas" ref={canvasRef} />
            </div>
          </div>
          <div className="video-container">
            <Player>
              <source src={BoyDemo} />
            </Player>
          </div>
        </div>
      </div>
    </body>
  );
};

export default Model1Component;

/*const FaceLandmarkerComponent = () => {


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
          
          <div style={{ position: "relative" }}>
            <video id="webcam" ref={webcamRef} autoPlay playsInline></video>
            <canvas
              className="output_canvas"
              id="output_canvas"
              ref={canvasRef}
              style={{ position: "absolute", left: "0px", top: "0px" }}
            ></canvas>
          </div>
        </div>
      
      </section>
    </div>
  );
};

//export default FaceLandmarkerComponent;*/
