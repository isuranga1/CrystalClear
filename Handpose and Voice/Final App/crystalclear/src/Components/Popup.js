import { AiOutlineCloseSquare } from "react-icons/ai";
import GreatJob from "./GreatJob.png";
import Success from "./success.mp3";
const Popup = ({ setIsOpenPopup }) => {
  return (
    <div
      onClick={setIsOpenPopup.bind(this, false)}
      style={{
        position: "fixed",
        zIndex: 9999,
        background: "rgba(0,0,0,0.6)",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          background: "transparent",
          borderRadius: "8px",
          width: "60%",
          height: "60%",
          padding: "20px 10px",
          animation: "dropTop .3s linear",
        }}
      >
        <div>
          <div
            onClick={setIsOpenPopup.bind(this, false)}
            style={{
              cursor: "pointer",
              position: "absolute",
              top: 10,
              right: 10,
            }}
          >
            {/*<AiOutlineCloseSquare />*/}
          </div>
        </div>
        {/* Body */}
        <div>
          <img
            src={GreatJob}
            alt="Description"
            style={{ position: "relative", marginTop: "-25%" }}
          />
          <p
            style={{
              fontWeight: "bold",
              fontFamily: "Comic Sans MS",
              position: "absolute",
              top: "120%",
              left: "27%",
              fontSize: "250%",
              color: "#5DFFB3",
            }}
          >
            Lets try another one !
          </p>
          <audio autoPlay style={{ display: "none" }}>
            <source src={Success} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
        {/* Footer */}
      </div>
    </div>
  );
};
export default Popup;
