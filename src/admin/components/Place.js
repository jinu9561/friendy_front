import { Fragment, useEffect, useState } from "react";
import clsx from "clsx";
import defaultProfileImage from '../../assets/img/prof/default.jpeg';
import DetailIcon from '../../assets/img/admin/user-detail-icon.png';
import PlaceDetail from "./PlaceDetail";
<<<<<<< HEAD
=======
import axios from "axios";
>>>>>>> 0a5eaa0e5ec1eb5db14f847738ee2bcf588612a0


const Place = ({
   place,
  currency,
<<<<<<< HEAD
  spaceBottomClass
}) => {
  const [modalShow, setModalShow] = useState(false);


  console.log(place);


    const getImg = (main,imgName) => {

        if(main){

            return  imgName ? "http://localhost:9000/place/main/img?imgName=" + imgName : defaultProfileImage ;
        }

        return  imgName ? "http://localhost:9000/place/detail/img?imgName=" + imgName : defaultProfileImage ;
    };

=======
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


>>>>>>> 0a5eaa0e5ec1eb5db14f847738ee2bcf588612a0
  return (
    <Fragment>
        <div className={clsx("product-wrap", spaceBottomClass)}>
          <div className="product-img">
              <img
                className="default-img"
<<<<<<< HEAD
                src={getImg(true,place.placeMainImgName)}
=======
                src={getImg(true,curplace.placeMainImgName)}
>>>>>>> 0a5eaa0e5ec1eb5db14f847738ee2bcf588612a0
                alt=""
              />
              {place.placeDetailImgList.length > 0 ? (
                <img
                  className="hover-img"
<<<<<<< HEAD
                  src={getImg(false,place.placeDetailImgList[0].placeDetailImgName)}
=======
                  src={getImg(false,curplace.placeDetailImgList[0].placeDetailImgName)}
>>>>>>> 0a5eaa0e5ec1eb5db14f847738ee2bcf588612a0
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
<<<<<<< HEAD
            <h3>{place.placeName}</h3>
=======
            <h3>{curplace.placeName}</h3>
>>>>>>> 0a5eaa0e5ec1eb5db14f847738ee2bcf588612a0
        </div>
          
        
       {/*프로필 상세보기 */}
       <PlaceDetail
        show={modalShow}
<<<<<<< HEAD
        onHide={() => setModalShow(false)}
        placeData={place}
        currency={currency}
        getImg={getImg}
        placeDetailImgList={place.placeDetailImgList}
=======
        onHide={()=>setModalShow(false)}
        placeData={curplace}
        currency={currency}
        getImg={getImg}
        getStatus={getStatus}
        placeDetailImgList={curplace.placeDetailImgList}
        status={status}
>>>>>>> 0a5eaa0e5ec1eb5db14f847738ee2bcf588612a0
      />
    </Fragment>
  );
};



export default Place;
