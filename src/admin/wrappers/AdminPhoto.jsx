import PropTypes from "prop-types";
import React, {Fragment, useContext, useEffect, useState} from "react";
import moment from "moment";
import FaHeart from '../../assets/img/photo/heart-icon2.png';
import {LogingedContext} from "../../App";
import AdminPhotoDetail from "../components/AdminPhotoDetail";

const  AdminPhoto = ({ photo, spaceBottomClass ,handelUpdate}) => {
  const [modalShow, setModalShow] = useState(false);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const getImg = (main,imgName) => {

    if(main){
      return imgName ? "http://localhost:9000/photo/main/img?imgName=" + imgName : "";
    }
      return imgName ? "http://localhost:9000/photo/detail/img?imgName=" + imgName : "";

  };


  const formatDateTimeArray = (dateTimeArray) => {
    if (Array.isArray(dateTimeArray) && dateTimeArray.length === 7) {
      const [year, month, day, hour, minute, second, nanosecond] = dateTimeArray;
      const dateTimeString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}.${String(nanosecond).slice(0, 3)}Z`;
      return moment(dateTimeString).isValid() ? moment(dateTimeString).format('YYYY-MM-DD HH:mm:ss') : 'Invalid date';
    }
    return 'Invalid date';
  };


  return (
      <Fragment>
        <div className={`product-wrap ${spaceBottomClass}`}>
          <div className="product-img">
            <img
                className="default-img"
                src={getImg(true, photo.photoMainImgName)}
                alt={photo.photoBoardTitle}
                onClick={()=> setModalShow(true)}
            />
            <div className="like-icon">
              <img
                  className="heart-icon"
                  src={FaHeart}
                  alt="heart icon"
                  onClick={()=> setModalShow(true)}
              />
              <span className="like-count">{photo.photoBoardLike}</span>
            </div>
          </div>
        </div>

        {/*Photo 상세보기 */}
        <AdminPhotoDetail
            show={modalShow}
            onHide={()=>setModalShow(false)}
            photoData={photo}
            getImg={getImg}
            photoBoardDetailImgList={photo.photoBoardDetailImgList}
            handleUpdate={handelUpdate}
        />

      </Fragment>
  );
};

AdminPhoto.propTypes = {
  photo: PropTypes.shape({
    photoBoardSeq: PropTypes.number.isRequired,
    photoBoardTitle: PropTypes.string.isRequired,
    //photoImgSrc: PropTypes.string.isRequired,
    //photoBoardRegDate: PropTypes.string.isRequired,
  }).isRequired,
  spaceBottomClass: PropTypes.string,
};

export default AdminPhoto;
