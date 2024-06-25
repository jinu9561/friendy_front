import {Fragment, useContext, useState} from "react";
import clsx from "clsx";
import PlaceDetail from '../../components/place/PlaceDetail';
import defaultProfileImage from '../../assets/img/prof/default.jpeg';
import placeIcon from '../../assets/img/place/place-icon.png';
import '../../assets/css/placeRecommend.css';
import {LogingedContext} from "../../App";

const PlaceRecommend = ({
    place,
    currency,
    spaceBottomClass,
    colorClass,
}) => {
    const [modalShow, setModalShow] = useState(false);

    const getImg = (main,imgName) => {

      if(main){
        
        return  imgName ? "http://localhost:9000/place/main/img?imgName=" + imgName : defaultProfileImage ;
      }

      return  imgName ? "http://localhost:9000/place/detail/img?imgName=" + imgName : defaultProfileImage ;
    };

    let logingedCon =useContext(LogingedContext);
    const handleRegisterClick = () => {
        if (logingedCon.isLoggedIn) {
            setModalShow(true);
        } else {
            alert("로그인 후 이용해주세요!");
        }
    };
    

    return (
        <Fragment>
            <div className={clsx("product-wrap-2", spaceBottomClass, colorClass)}>
                <div className="product-img">
                    <img
                        className="default-img"
                        src={getImg(true, place.placeMainImgName)}
                        alt={place.placeName}
                    />
                    {place.placeDetailImgList.length > 0 ? (
                        <img
                            className="hover-img"
                            src={getImg(false, place.placeDetailImgList[0].placeDetailImgName)}
                            alt=""
                        />
                    ) : (
                        ""
                    )}

                    <div className="product-action-2">
                        <button onClick={handleRegisterClick} title="Quick View">
                            <img src={placeIcon} alt="Quick View" className="quick-view-icon" />
                        </button>
                    </div>
                </div>
                <div className="product-content-2">
                    <div className={`title-price-wrap-2`}>
                        <h3 className="place-name">
                            <strong>{place.placeName}</strong>
                        </h3>
                        <div className="price-2">
                            <Fragment>
                                <div className="place-details">
                                    <div className="place-address">
                                        <span className="currency-symbol">{currency.currencySymbol}</span>
                                        <span className="address-text">{place.placeAddress}</span>
                                    </div>
                                </div>
                            </Fragment>
                        </div>
                    </div>
                </div>
            </div>
            {/* 눌렀을때 팝업창으로 디테일 정보 보기*/}
             <PlaceDetail
                show={modalShow}
                onHide={() => setModalShow(false)}
                place={place}
                currency={currency}
            />
        </Fragment>
    );
};



export default PlaceRecommend;
