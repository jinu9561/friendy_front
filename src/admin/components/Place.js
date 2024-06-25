import { Fragment, useEffect, useState } from "react";
import clsx from "clsx";
import DetailIcon from '../../assets/img/admin/user-detail-icon.png';
import PlaceDetail from "./PlaceDetail";
import PropTypes from "prop-types";



const Place = ({
   place,
                   currency,
   spaceBottomClass,
   status,
   getStatus,
                   handleUpdate
}) => {

  const [modalShow, setModalShow] = useState(false);



    const getImg = (main, imgName) => {
        if (!imgName) {
            return "";
        }
        return main ? `http://localhost:9000/place/main/img?imgName=${imgName}` : `http://localhost:9000/place/detail/img?imgName=${imgName}`;
    };


  return (
    <Fragment>
        <div className={clsx("product-wrap", spaceBottomClass)}>
          <div className="product-img">
              <img
                className="default-img"
                src={getImg(true,place.placeMainImgName)}
                alt=""
              />
              {place.placeDetailImgList && place.placeDetailImgList.length > 0 ? (
                  <img
                      className="hover-img"
                      src={getImg(false, place.placeDetailImgList[0].placeDetailImgName)}
                      alt=""
                      onClick={() => setModalShow(true)}
                  />
              ) : (
                  ""
              )}
            <div className="product-action">
              <div className="pro-same-action pro-quickview">
                  <button onClick={() => setModalShow(true)} title="Quick View">
                      <img
                          className="default-img"
                          src={DetailIcon}
                          alt=""
                      />
                  </button>
              </div>
            </div>
          </div>
        </div>
        {/* 이미지 밑에 내용*/}
        <div className="shop-list-content">
            <h3>{place.placeName}</h3>
        </div>

       {/*프로필 상세보기 */}
        <PlaceDetail
            show={modalShow}
            onHide={()=>setModalShow(false)}
            placeData={place}
            currency={currency}
            getImg={getImg}
            getStatus={getStatus}
            placeDetailImgList={place.placeDetailImgList}
            status={status}
            handleUpdate={handleUpdate} />
    </Fragment>
  );
};
Place.propTypes = {
    handleUpdate: PropTypes.func,
};



export default Place;
