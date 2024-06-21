import { Fragment, useEffect, useState } from "react";
import clsx from "clsx";
import defaultProfileImage from '../../assets/img/prof/default.jpeg';
import DetailIcon from '../../assets/img/admin/user-detail-icon.png';
import PlaceDetail from "./PlaceDetail";
import axios from "axios";


const Place = ({
   place,
  currency,
  spaceBottomClass,
   getStatus,
   status
}) => {
  const [modalShow, setModalShow] = useState(false);
  const [curplace,setCurPlace] = useState({...place})

  console.log(curplace);


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
                src={getImg(true,curplace.placeMainImgName)}
                alt=""
              />
              {place.placeDetailImgList.length > 0 ? (
                <img
                  className="hover-img"
                  src={getImg(false,curplace.placeDetailImgList[0].placeDetailImgName)}
                  alt=""
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
            <h3>{curplace.placeName}</h3>
        </div>
          
        
       {/*프로필 상세보기 */}
       <PlaceDetail
        show={modalShow}
        onHide={()=>setModalShow(false)}
        placeData={curplace}
        currency={currency}
        getImg={getImg}
        getStatus={getStatus}
        placeDetailImgList={curplace.placeDetailImgList}
        status={status}
      />
    </Fragment>
  );
};



export default Place;
