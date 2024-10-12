import { useState, useContext, useRef } from "react";
import { Context } from "../context/Context";
import { imageWithSize } from "../helpers/api.config";

export const Cast = ({ cast }) => {
  const { castError } = useContext(Context);

  const castContainerRef = useRef(null);
  const [castMaximized, setCastMaximized] = useState(false);

  if (castError) {
    return <p className="p-2">Error loading cast </p>;
  }

  return (
    cast && (
      <>
        <h3 style={{ marginTop: "40px" }}>Cast</h3>
        {cast.length > 0 ? (
          <div className="cast" ref={castContainerRef} style={{ zIndex: "1", height: cast.length < 10 ? "100%" : "200px", position: "relative" }}>
            {cast.map((cast) => {
              return (
                <div className="cast__member" key={cast.id + 543425}>
                  <img
                    src={
                      cast.profile_path
                        ? `${imageWithSize("185")}${cast.profile_path}`
                        : "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
                    }
                    alt="cast-member"
                  />
                  <p className="cast__member__name">{cast.name}</p>
                  <p className="cast__member__character">{cast.character}</p>
                </div>
              );
            })}
            <span
              style={{
                cursor: "pointer",
                display: cast.length < 10 ? "none" : "block",
                zIndex: "2",
                height: castMaximized ? "0" : "120px",
                width: "100%",
                position: "absolute",
                bottom: "0",
                left: "0",
                background: cast.length >= 10 ? "linear-gradient(rgba(0, 0, 0, 0.12), rgb(0 0 0 / 89%), black)" : "none",
              }}
            >
              <p
                onClick={() => {
                  (castContainerRef.current.style.height = "100%"), setCastMaximized(true);
                }}
                style={{ textDecoration: "underline", display: castMaximized ? "none" : "block", textAlign: "center", position: "absolute", bottom: "10px", left: "50%", transform: "translate(-50%)" }}
              >
                See all
              </p>
            </span>
          </div>
        ) : (
          <p style={{ textAlign: "center" }}>No cast available</p>
        )}
      </>
    )
  );
};

export default Cast;
