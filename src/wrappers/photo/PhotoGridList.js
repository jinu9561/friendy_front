import PropTypes from "prop-types";
import React, { Fragment } from "react";
import PhotoGridListSingle from "../../components/photo/PhotoGridListSingle";

const PhotoGridList = ({ photos, spaceBottomClass }) => {
  return (
    <Fragment>
      {photos?.map((photo) => (
        <div className="col-xl-4 col-sm-6" key={photo.photoBoardSeq}>
          <PhotoGridListSingle
            spaceBottomClass={spaceBottomClass}
            photo={photo}
          />
        </div>
      ))}
    </Fragment>
  );
};

PhotoGridList.propTypes = {
  photos: PropTypes.array,
  spaceBottomClass: PropTypes.string,
};

export default PhotoGridList;
