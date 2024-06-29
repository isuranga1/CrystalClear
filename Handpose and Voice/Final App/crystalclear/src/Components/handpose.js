import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "./handpose.css";
import { drawHand } from "./utilities";
import * as fp from "fingerpose";
import victory from "./victory.png";
import thumbs_up from "./thumbs_up.png";
import YouTube from "react-youtube";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

// Import FingerCurl and FingerDirection from fingerpose

const { FingerCurl, FingerDirection } = fp;
let Try = "Try Again";

let UA = 0;
let delay = 100;

const HandposeComponent = () => {
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
                if (maxScoreGestureName === "AAA" && UA != 2) {
                  console.log("UA:", UA);
                  console.log("UAword:", UAword);
                  console.log("maxScoreGestureName:", maxScoreGestureName);
                  //SpeechRecognition.startListening();
                  //console.log(currentTranscript);
                  UA = 1;
                }
                if (maxScoreGestureName === "UUU" && UA === 1) {
                  //setEmoji("victory" || null);

                  UA = 2;
                  //UAword= 0;
                }

                console.log("Gesture with Max Score:", maxScoreGestureName);
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
      if (transcript === "Boy." && UA == 2) {
        console.log("correct broh");
        //setTimeout(() => {
        Try = "Correct broh";
        setEmoji("victory" || null);
        //}, 1000);

        //setEmoji("victory" || null);

        UA = 0;
      }
    }
  }, [transcript, browserSupportsSpeechRecognition]);

  useEffect(() => {
    console.log("Emoji updated:", emoji);
  }, [emoji]);

  return (
    <div className="handpose">
      <header className="handpose-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginRight: "800px",
            zIndex: 9,
            width: 500,
            height: 355,
            borderRadius: "70px",
            boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.7)",
          }}
        />

        {emoji !== null && (
          <img
            src={images[emoji]}
            style={{
              position: "absolute",
              marginRight: "800px",
              textAlign: "center",
              zIndex: 10,
              width: 500,
              height: 355,
            }}
            alt="Emoji"
          />
        )}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginRight: "800px",
            textAlign: "center",
            zIndex: 9,
            width: 500,
            height: 355,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "75%", // Center horizontally
            top: "200px", // Adjust this value to move it up or down
            transform: "translateX(-50%)",
            zIndex: 0,
            width: 800,
            height: 800,
          }}
        >
          {/* YouTube component */}
          <YouTube videoId={videoId} />
        </div>

        {browserSupportsSpeechRecognition && (
          <div className="microphone-container" style={{}}>
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
            </button>
            <p>{transcript}</p>
          </div>
        )}
        <div
          className="colored-box"
          style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.6)" }}
        >
          <p style={{ fontWeight: "bold" }}>Now It's Your Time to Shine !</p>
        </div>
      </header>
    </div>
  );
};

export default HandposeComponent;
