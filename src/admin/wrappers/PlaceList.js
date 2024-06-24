import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import Place from "../components/Place";
import PropTypes from "prop-types";
import AdminPlacesList from "./AdminPlacesList";

const PlaceList = ({
  places,
  spaceBottomClass,
 getStatus,
 status,
                       handleUpdate

}) => {
  const currency = useSelector((state) => state.currency);
  console.log(places);
  
  return (
    <Fragment>
      {places.map(place => {
        return (
          <div className="col-xl-4 col-sm-6" key={place.placeSeq}>
              <Place spaceBottomClass={spaceBottomClass} place={place} currency={currency} getStatus={getStatus} status={status} handleUpdate={handleUpdate} />
          </div>
        );
      })}
    </Fragment>
  );
};
PlaceList.propTypes = {
    handleUpdate: PropTypes.func,
};

export default PlaceList;
