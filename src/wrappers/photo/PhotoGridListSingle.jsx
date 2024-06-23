import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import PhotoModal from "../../components/photo/PhotoModal";

const PhotoGridListSingle = ({ photo, spaceBottomClass }) => {
  const [modalShow, setModalShow] = useState(false);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const getImg = (imgName) => {
    return "http://localhost:9000/photo-board/main/img?imgName=" + imgName;
  };

  return (
    <Fragment>
      <div className={`product-wrap ${spaceBottomClass}`}>
        <div className="product-img">
          <img
            className="default-img"
            src={getImg(photo.photoMainImgSrc)}
            alt={photo.photoBoardTitle}
            onClick={() => setModalShow(true)}
          />
        </div>
        <div className="product-content text-center">
          <h3>{photo.photoBoardTitle}</h3>
          <div className="product-date">
            <span>
              {new Date(photo.photoBoardRegDate).toLocaleDateString(
                "ko-KR",
                options
              )}
            </span>
            <p>좋아요 수 : {photo.photoBoardLike}</p>
            <p>취미 카테고리 번호 : {photo.interestSeq}</p>
            <p>파일명: {photo.photoMainImgSrc}</p>
          </div>
        </div>
      </div>
      <PhotoModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        photo={photo}
      />
    </Fragment>
  );
};

PhotoGridListSingle.propTypes = {
  photo: PropTypes.shape({
    photoBoardSeq: PropTypes.number.isRequired,
    photoBoardTitle: PropTypes.string.isRequired,
    photoBoardRegDate: PropTypes.string.isRequired,
  }).isRequired,
  spaceBottomClass: PropTypes.string,
};

export default PhotoGridListSingle;
