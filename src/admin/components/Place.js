import { Fragment, useEffect, useState } from "react";
import clsx from "clsx";
import defaultProfileImage from '../../assets/img/prof/default.jpeg';
import DetailIcon from '../../assets/img/admin/user-detail-icon.png';
import PlaceDetail from "./PlaceDetail";


const Place = ({
   place,
  currency,
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

  return (
    <Fragment>
        <div className={clsx("product-wrap", spaceBottomClass)}>
          <div className="product-img">
              <img
                className="default-img"
                src={getImg(true,place.placeMainImgName)}
                alt=""
              />
              {place.placeDetailImgList.length > 0 ? (
                <img
                  className="hover-img"
                  src={getImg(false,place.placeDetailImgList[0].placeDetailImgName)}
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
            <h3>{place.placeName}</h3>
        </div>
          
        
       {/*프로필 상세보기 */}
       <PlaceDetail
        show={modalShow}
        onHide={() => setModalShow(false)}
        placeData={place}
        currency={currency}
        getImg={getImg}
        placeDetailImgList={place.placeDetailImgList}
      />
    </Fragment>
  );
};



export default Place;
