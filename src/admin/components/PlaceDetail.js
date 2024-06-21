import { Fragment, useState } from "react";
import { EffectFade, Thumbs } from 'swiper';
import { Modal } from "react-bootstrap";
import Swiper, { SwiperSlide } from "../../components/swiper";
import defaultProfileImage from '../../assets/img/prof/default.jpeg';
import moment from 'moment';
import axios from "axios";

function PlaceDetail({ placeData, currency,show, onHide,placeDetailImgList,getImg }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const [curPlaceData, setPlaceData] = useState({ ...placeData });
  const [curPlaceDetailList, setCurPlaceDetailList] = useState({...placeDetailImgList})
  const [formData, setFormData] = useState({ ...placeData });
  const [mainImage, setMainImage] = useState(placeData.placeMainImg);
  const [isMainImage, setIsMainImage] = useState(true); // 상태 값 추가



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleStatusChange = (status) => {
    setFormData({ ...formData, imgStatus: status });
  };

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      userRate: rating,
    });
    console.log(formData);
  };

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
    loop: false,
    slideToClickedSlide: true,
    navigation: true
  };

  const onCloseModal = () => {
    setThumbsSwiper(null)
    onHide()
  }

  const handleSave = () => {

    // const saveData = isMainImage ? formData : {
    //   profileSeq: profileData.placeDetailImgList,
    //   imgStatus: formData.imgStatus,
    // };
    //
    // const url = isMainImage ?
    //     "http://localhost:9000/admin/users/profile" :
    //     `http://localhost:9000/admin/users/profile/detail/${profileData.userSeq}`;
    //
    // axios({
    //   method: "PUT",
    //   url: url,
    //   data: saveData,
    //   headers: {
    //     Authorization: sessionStorage.getItem("Authorization"),
    //   }
    //  })
    //     .then((res) => {
    //       alert(res.data);
    //       return axios.get(`http://localhost:9000/admin/users/profile/${curProfileData.userSeq}`);
    //     })
    //     .then((res) => {
    //       setFormData(res.data);
    //       setCurProfileData(res.data);
    //       if (!isMainImage) {
    //         return axios.get(`http://localhost:9000/admin/users/profile/detail/${curProfileData.userSeq}`);
    //       }
    //     })
    //     .then((res) => {
    //       if (res) {
    //         setCurProfileDetailData(res.data);
    //         const detailImg = res.data.find(img => img.profileDetailImgName === mainImage);
    //         setSelectedImgStatus(detailImg ? detailImg.imgStatus : selectedImgStatus);
    //       }
    //     })
    //     .catch((err) => {
    //       if (err.response && err.response.data && err.response.data.title === undefined) {
    //         alert("로그아웃 후 다시 로그인해 주세요");
    //       } else {
    //         alert(err.response.data.title);
    //       }
    //     });

    console.log('Saved data:', formData);
    console.log('detail data:', curPlaceDetailList);
  };

  const handleImageClick = (imgName, isMain) => {
    setMainImage(imgName);
    setIsMainImage(isMain);
    if (isMain) {
      //setSelectedImgStatus(curProfileData.imgStatus); // Update the status for main image
      console.log(imgName);
    } else {
      const selectedImg = curPlaceDetailList.find(img => img.profileDetailImgName === imgName);
      //setSelectedImgStatus(selectedImg.imgStatus); // Update the status for selected detail image
      console.log(imgName);
      console.log(selectedImg);
    }
  };




  return (
    <Modal show={show} onHide={onCloseModal} className="product-quickview-modal-wrapper">
    <Modal.Header closeButton></Modal.Header>

    <div className="modal-body">
      <div className="row">
        <div className="col-md-5 col-sm-12 col-xs-12">
          <div className="product-large-image-wrapper">
            <Swiper options={gallerySwiperParams}>
                    <SwiperSlide key={curPlaceData.placeSeq}>
                      <div className="single-image">
                        <img
                            src={getImg(isMainImage, mainImage)}
                            className="img-fluid"
                            alt={mainImage}
                        />
                      </div>
                    </SwiperSlide>
            </Swiper>
          </div>
          <div className="product-small-image-wrapper mt-15">
            <Swiper options={thumbnailSwiperParams}>
              {placeDetailImgList.length > 0  &&
                  placeDetailImgList.map((img, i) => {
                  return (
                    <SwiperSlide key={i}>
                      <div className="single-image" onClick={() => handleImageClick(img.profileDetailImgName, false)}>
                        <img
                          src={getImg(false,img.profileDetailImgName)}
                          className="img-fluid"
                          alt={img.profileDetailImgName}
                        />
                      </div>
                    </SwiperSlide>
                  );
                })}
              <SwiperSlide key={curPlaceData.placeSeq}>
                <div className="single-image" onClick={() => handleImageClick(placeData.profileMainImgName, true)}>
                  <img
                      src={getImg(true, placeData.profileMainImgName)}
                      className="img-fluid"
                      alt={placeData.profileMainImgName}
                  />
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
        <div className="col-md-7 col-sm-12 col-xs-12">
          <div>
            <div className="product-details-price">
              <Fragment>
                <div className="mb-3">
                  <label>장소 이름: {curPlaceData.placeName}</label>
                  <input
                      type="text"
                      name="placeName"
                      value={formData.placeName}
                      onChange={handleChange}
                      className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label>주소: {curPlaceData.placeAddress}</label>
                  <input
                      type="text"
                      name="placeAddress"
                      value={formData.placeAddress}
                      onChange={handleChange}
                      className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label>설명: {curPlaceData.placeDescription}</label>
                  <input
                      type="text"
                      name="placeDescription"
                      value={formData.placeDescription}
                      onChange={handleChange}
                      className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <h4>메인 이미지 : {curPlaceData.placeMainImg}</h4>
                  <input
                      type="file"
                      name="placeMainImg"
                      value={formData.placeMainImg}
                      onChange={handleChange}
                      className="form-control"
                  />
                  <button
                      type="button"
                      className="btn btn-danger"
                      value={"등록하기"}
                      onClick={""}
                  />
                </div>
                <br></br>
                <br></br>

                <div className="mb-3">
                  <h4>상세 이미지 : {curPlaceData.placeDetailImgName}</h4>
                  <input
                      type="file"
                      name="placeDetailImgName"
                      value={formData.placeDetailImgName}
                      onChange={handleChange}
                      className="form-control"
                  />
                  <button
                      type="button"
                      className="btn btn-danger"
                      value={"등록하기"}
                      onClick={""}
                  />
                </div>
              </Fragment>
            </div>
          </div>
        </div>


      </div>
      </div>

  </Modal>
  );
}


export default PlaceDetail;
