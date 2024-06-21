import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import Place from "../components/Place";

const PlaceList = ({
  places,
<<<<<<< HEAD
  spaceBottomClass
=======
  spaceBottomClass,
 getStatus,
 status
>>>>>>> 0a5eaa0e5ec1eb5db14f847738ee2bcf588612a0
}) => {
  const currency = useSelector((state) => state.currency);
  console.log(places);
  
  return (
    <Fragment>
      {places.map(place => {
        return (
          <div className="col-xl-4 col-sm-6" key={place.placeSeq}>
            <Place
              spaceBottomClass={spaceBottomClass}
              place={place}
              currency={currency}
<<<<<<< HEAD
=======
              getStatus={getStatus}
              status={status}
>>>>>>> 0a5eaa0e5ec1eb5db14f847738ee2bcf588612a0
            />
          </div>
        );
      })}
    </Fragment>
  );
};

export default PlaceList;
