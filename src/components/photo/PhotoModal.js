import { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap"; // react-bootstrap의 Modal 컴포넌트를 사용한 예시입니다.
import Swiper, { SwiperSlide } from "../../components/swiper";
import { EffectFade, Thumbs } from "swiper";
import { useDispatch } from "react-redux";

const PhotoModal = ({ show, onHide, photo, isLoggedIn }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null); // Thumbs Swiper 상태 관리
  const dispatch = useDispatch();
  const [isRecommended, setIsRecommended] = useState(false); // 추천 상태 관리

  // 갤러리 Swiper 설정
  const gallerySwiperParams = {
    spaceBetween: 10,
    loop: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    thumbs: { swiper: thumbsSwiper },
    modules: [EffectFade, Thumbs],
  };

  // 썸네일 Swiper 설정
  const thumbnailSwiperParams = {
    onSwiper: setThumbsSwiper,
    spaceBetween: 10,
    slidesPerView: 4,
    touchRatio: 0.2,
    freeMode: true,
    loop: true,
    slideToClickedSlide: true,
    navigation: true,
  };

  // 모달 닫기 핸들러
  const onCloseModal = () => {
    setThumbsSwiper(null);
    onHide();
  };

  // 추천 기능 핸들러
  const handleRecommend = () => {
    setIsRecommended(!isRecommended);
    //서버에 추천 상태 전송
  };

  const getImg = (imgName) => {
    return "http://localhost:9000/photo-board/main/img?imgName=" + imgName;
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      className="photo-quickview-modal-wrapper"
    >
      <Modal.Header closeButton></Modal.Header>
      <div className="modal-body">
        <div className="row">
          <div className="col-md-5 col-sm-12 col-xs-12">
            <div className="photo-large-image-wrapper">
              <Swiper options={gallerySwiperParams}>
                {photo.detailImgList &&
                  photo.detailImgList.map((img, i) => (
                    <SwiperSlide key={i}>
                      <div className="single-image">
                        <img
                          src={getImg(photo.photoMainImgSrc)}
                          className="img-fluid"
                          alt="Photo Detail"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
            <div className="photo-small-image-wrapper mt-15">
              <Swiper options={thumbnailSwiperParams}>
                {photo.detailImgList &&
                  photo.detailImgList.map((img, i) => (
                    <SwiperSlide key={i}>
                      <div className="single-image">
                        <img
                          src={process.env.PUBLIC_URL + img}
                          className="img-fluid"
                          alt="Thumbnail"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </div>
          <div className="col-md-7 col-sm-12 col-xs-12">
            <div className="photo-details-content quickview-content">
              <h2>{photo.title}</h2>
              <p>{photo.description}</p>
              <div className="d-flex justify-content-between">
                <div className="pro-details-wishlist">
                  <button
                    className={isRecommended ? "active" : ""}
                    onClick={handleRecommend}
                  >
                    <i className="pe-7s-like" />
                    {isRecommended ? "추천 해제" : "추천"}
                  </button>
                </div>
                {isLoggedIn && (
                  <div>
                    <Button variant="warning" className="me-2">
                      수정
                    </Button>
                    <Button variant="danger">삭제</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

PhotoModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  photo: PropTypes.shape({
    photoBoardTitle: PropTypes.string.isRequired,
    photoImgSrc: PropTypes.string.isRequired,
    photoBoardRegDate: PropTypes.string.isRequired,
  }).isRequired,
};

export default PhotoModal;
