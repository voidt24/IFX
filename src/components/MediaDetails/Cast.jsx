import { useContext } from "react";
import { Context } from "../../context/Context";
import { imageWithSize } from "../../helpers/api.config";
import Slider from "../Slider/Slider";

export const Cast = ({ cast }) => {
  const { castError } = useContext(Context);

  if (castError) {
    return <p className="p-2">Error loading cast </p>;
  }

  return (
    cast && (
      <>
        {/* <h3 style={{ marginTop: "40px" }}>Cast</h3> */}
        {cast.length > 0 ? (
          <Slider sideControls={true} expectingCards={false}>
            {cast.map((cast) => {
              return (
                <div className="cast__member flex-col-center text-[65%]" key={cast.id + 543425}>
                  <img
                    src={
                      cast.profile_path
                        ? `${imageWithSize("185")}${cast.profile_path}`
                        : "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
                    }
                    className="size-[65px] rounded-full object-cover"
                    alt="cast-member"
                  />
                  <p className="cast__member__name font-semibold">{cast.name}</p>
                  <p className="cast__member__character text-content-secondary">{cast.character}</p>
                </div>
              );
            })}
          </Slider>
        ) : (
          <p className="text-gray-500 text-center">No cast available</p>
        )}
      </>
    )
  );
};

export default Cast;
