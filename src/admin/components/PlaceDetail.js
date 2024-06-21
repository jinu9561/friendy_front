import React, { Fragment, useState } from "react";
import { EffectFade, Thumbs } from 'swiper';
import { Modal } from "react-bootstrap";
import Swiper, { SwiperSlide } from "../../components/swiper";
import defaultProfileImage from '../../assets/img/prof/default.jpeg';
import moment from 'moment';
import axios from "axios";
import removeIcon from '../../assets/img/prof/remove-icon.png'


function PlaceDetail({ placeData, currency,show,placeDetailImgList,getImg,onHide,getStatus,status }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const [curPlaceData, setCurPlaceData] = useState({ ...placeData });
  const [curPlaceDetailList, setCurPlaceDetailList] = useState([{...placeDetailImgList}])
  const [formData, setFormData] = useState({ ...placeData });
  const [mainImage, setMainImage] = useState(placeData.placeMainImgName);
  const [isMainImage, setIsMainImage] = useState(true); // 상태 값 추가
  const [mainImgSeq,setMainImgSeq] = useState(curPlaceData.placeSeq);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
    getStatus(!status)
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

  const handleImageClick = (imgName, isMain, imgSeq) => {
    setMainImage(imgName);
    setIsMainImage(isMain);
    setMainImgSeq(imgSeq);
    if (isMain) {
      console.log(mainImage);
      console.log(isMain);
      console.log(mainImgSeq);
    } else {
      const selectedImg = curPlaceDetailList.find(img => img.placeDetailImgName === imgName);
      console.log(mainImage);
      console.log(isMain);
      console.log(mainImgSeq);
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0], // files is an array, take the first file
    });
  };

  const handleDeleteImage = (imgName) => {
    //setCurPlaceDetailList(curPlaceDetailList.filter(img => img.placeDetailImgName !== imgName));
    let url = "http://localhost:9000/admin/place/delete/main/"+mainImgSeq;
    if(!isMainImage){
      url = "http://localhost:9000/admin/place/delete/detail/"+mainImgSeq;
    }
    axios({
      method:"DELETE",
      url : url,
      headers :  {
        Authorization: sessionStorage.getItem("Authorization"),
      }
    })
        .then((res) => {
          alert(res.data);
          return axios.get(`http://localhost:9000/admin/place/${curPlaceData.placeSeq}`);
        })
        .then((res)=>{
          setCurPlaceData(res.data);
          setCurPlaceDetailList(res.data.placeDetailImgList);
        })
        .catch((err)=>{
          if (err.response && err.response.data && err.response.data.title === undefined) {
            alert("로그아웃 후 다시 로그인해 주세요");
          } else {
            alert(err.response.data.title);
          }
        });
  };

  const handleDelete = ()=>{

    axios({
      method:"DELETE",
      url : "http://localhost:9000/admin/place/delete/"+curPlaceData.placeSeq,
      headers :  {
        Authorization: sessionStorage.getItem("Authorization"),
      }
    })
        .then((res) => {
          alert(res.data);
        })
        .catch((err)=>{
          if (err.response && err.response.data && err.response.data.title === undefined) {
            alert("로그아웃 후 다시 로그인해 주세요");
          } else {
            alert(err.response.data.title);
          }
        });
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
                    {mainImage && (
                        <div className="single-image">
                          <img
                              src={getImg(isMainImage, mainImage)}
                              className="img-fluid"
                              alt={mainImage}
                          />
                          <img
                              src={removeIcon}
                              alt="Remove"
                              className="remove-icon"
                              onClick={() => handleDeleteImage(mainImage)}
                              style={{ position: "absolute", top: "10px", right: "10px", width: "20px", height: "20px", cursor: "pointer" }}
                          />
                        </div>
                    )}
                  </SwiperSlide>
                </Swiper>

              </div>
              <div className="product-small-image-wrapper mt-15">
                <Swiper options={thumbnailSwiperParams}>
                  {placeDetailImgList.length > 0 &&
                      placeDetailImgList.map((img, i) => (
                          <SwiperSlide key={i}>
                            <div className="single-image"
                                 onClick={() => handleImageClick(img.placeDetailImgName, false,img.placeDetailImgSeq)}>
                              <img
                                  src={getImg(false, img.placeDetailImgName)}
                                  className="img-fluid"
                                  alt={img.placeDetailImgName}
                              />
                            </div>
                          </SwiperSlide>
                      ))}
                  <SwiperSlide key={curPlaceData.placeSeq}>
                    <div className="single-image" onClick={() => handleImageClick(curPlaceData.placeMainImgName, true,curPlaceData.placeSeq)}>
                      <img
                          src={getImg(true, curPlaceData.placeMainImgName)}
                          className="img-fluid"
                          alt={curPlaceData.placeMainImgName}
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
                      <label>현재 장소 이름: {curPlaceData.placeName}</label>
                      <input
                          type="text"
                          name="placeName"
                          value={formData.placeName}
                          onChange={handleChange}
                          className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label>현재 주소: {curPlaceData.placeAddress}</label>
                      <input
                          type="text"
                          name="placeAddress"
                          value={formData.placeAddress}
                          onChange={handleChange}
                          className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label>현재 설명: {curPlaceData.placeDescription}</label>
                      <input
                          type="text"
                          name="placeDescription"
                          value={formData.placeDescription}
                          onChange={handleChange}
                          className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <h4>메인 이미지 등록하기</h4>
                      <input
                          type="file"
                          name="placeMainImg"
                          onChange={handleFileChange}
                          className="form-control"
                      />
                      <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleSave}
                      >
                        등록하기
                      </button>
                    </div>
                    <br/><br/>

                    <div className="mb-3">
                      <h4>상세 이미지 등록하기</h4>
                      <input
                          type="file"
                          name="placeDetailImgName"
                          onChange={handleFileChange}
                          className="form-control"
                      />
                      <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleSave}
                      >
                        등록하기
                      </button>

                    </div>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSave}
                    >
                      내용 수정
                    </button>
                    {"  "}
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={handleDelete}
                    >
                      전체 삭제하기
                    </button>
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
