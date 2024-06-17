import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";

const Test = ({ photo, spaceBottomClass }) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <Fragment>
      <div className={`product-wrap ${spaceBottomClass}`}>
        <div className="product-img">
          <img
            className="default-img"
            src={process.env.PUBLIC_URL + photo.photoImgSrc}
            alt={photo.photoBoardTitle}
            onClick={() => setModalShow(true)}
          />
        </div>
        <div className="product-content text-center">
          <h3>{photo.photoBoardTitle}</h3>
          <div className="product-date">
            <span>
              {new Date(photo.photoBoardRegDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Test.propTypes = {
  photo: PropTypes.shape({
    photoBoardSeq: PropTypes.number.isRequired,
    photoBoardTitle: PropTypes.string.isRequired,
    photoImgSrc: PropTypes.string.isRequired,
    //photoBoardRegDate: PropTypes.string.isRequired,
  }).isRequired,
  spaceBottomClass: PropTypes.string,
};

export default Test;
