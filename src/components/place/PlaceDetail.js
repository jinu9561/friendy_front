import { Fragment, useState } from "react";
import Rating from "../../components/product/sub-components/ProductRating";
import { EffectFade, Thumbs } from 'swiper';
import { Modal } from "react-bootstrap";
import Swiper, { SwiperSlide } from "../swiper";
import { addToCart } from "../../store/slices/cart-slice";
import { addToWishlist } from "../../store/slices/wishlist-slice";
import { addToCompare } from "../../store/slices/compare-slice";
import defaultProfileImage from '../../assets/img/prof/default.jpeg';
import '../../assets/css/placeDetail.css';

const PlaceDetail = ({ place, currency, show, onHide }) => {

  const [thumbsSwiper, setThumbsSwiper] = useState(null);



  const gallerySwiperParams = {
    spaceBetween: 10,
    loop: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true
    },
    thumbs: { swiper: thumbsSwiper },
    modules: [EffectFade, Thumbs],
  };

  const thumbnailSwiperParams = {
    onSwiper: setThumbsSwiper,
    spaceBetween: 10,
    slidesPerView: 4,
    touchRatio: 0.2,
    freeMode: true,
    //loop: true,
    slideToClickedSlide: true,
    navigation: true
  };

  const onCloseModal = () => {
    setThumbsSwiper(null)
    onHide()

  }

  
  const getImg = (main,imgName) => {

    if(main){
      
      return  imgName ? "http://localhost:9000/place/main/img?imgName=" + imgName : defaultProfileImage ;
    }

    return  imgName ? "http://localhost:9000/place/detail/img?imgName=" + imgName : defaultProfileImage ;
  };


  return (
    <Modal show={show} onHide={onCloseModal} className="product-quickview-modal-wrapper">
    <Modal.Header closeButton></Modal.Header>
    <div className="modal-body">
      <div className="single-image">
        <img
          src={getImg(true, place.placeMainImgName)}
          className="img-fluid"
          alt="Product"
        />
      </div>
      <div className="product-details-content quickview-content">
        {/* 디테일 사진을 설명 위에 배치 */}
        {place.placeDetailImgList && place.placeDetailImgList.map((placeDetail, i) => (
          <div key={i} className="single-image" style={{ maxHeight: '300px', overflow: 'hidden' }}>
            <img
              src={getImg(false, placeDetail.placeDetailImgName)}
              className="img-fluid"
              alt=""
            />
          </div>
        ))}
        <br></br>
        <div className="product-details-price">
          <Fragment>
            <span>
              {currency.currencySymbol}
            </span>{" "}
            <span className="old">
              {currency.currencySymbol}
            </span>
          </Fragment>
          <span>{currency.currencySymbol}</span>
        </div>
        <div className="pro-details-list">
          <p>{place.placeDescription}</p>
        </div>
        <div className="pro-details-quality">
          <div className="pro-details-cart btn-hover">
            <button onClick={""}> 소모임 등록하러 가기 </button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
  );
}



export default PlaceDetail;
