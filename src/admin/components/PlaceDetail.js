import React, { Fragment, useEffect, useState } from "react";
import { EffectFade, Thumbs } from 'swiper';
import { Modal } from "react-bootstrap";
import Swiper, { SwiperSlide } from "../../components/swiper";
import axios from "axios";
import removeIcon from '../../assets/img/prof/remove-icon.png'
import PropTypes from "prop-types";
import '../../assets/css/photoDetail.css';

function PlaceDetail({ placeData, currency, show, placeDetailImgList, getImg, onHide, getStatus, status, handleUpdate }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [curPlaceData, setCurPlaceData] = useState({ ...placeData });
  const [curPlaceDetailList, setCurPlaceDetailList] = useState([...placeDetailImgList]);
  const [formData, setFormData] = useState({ ...placeData });
  const [mainImage, setMainImage] = useState(placeData.placeMainImgName);
  const [isMainImage, setIsMainImage] = useState(true); // 상태 값 추가
  const [mainImgSeq, setMainImgSeq] = useState(curPlaceData.placeSeq);
  const [mainSaveImage, setMainSaveImage] = useState(null);
  const [detailImage, setDetailImage] = useState(null);

  useEffect(() => {
    console.log("placeDetailImgList updated:", placeDetailImgList);
    setCurPlaceDetailList(placeDetailImgList);
  }, [placeDetailImgList]);

  useEffect(() => {
    console.log("curPlaceData updated:", curPlaceData);
    handleUpdate();
  }, [curPlaceData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
    setThumbsSwiper(null);
    getStatus(!status);
    onHide();
  }

  const handleSave = () => {
    axios({
      method: "PUT",
      url: `http://localhost:9000/admin/place/alter/${curPlaceData.placeSeq}`,
      data: formData,
      headers: {
        Authorization: sessionStorage.getItem("Authorization"),
      }
    })
        .then((res) => {
          alert(res.data);
          return axios.get(`http://localhost:9000/admin/place/${curPlaceData.placeSeq}`);
        })
        .then((res) => {
          setFormData(res.data);
          setCurPlaceData(res.data);
          handleUpdate();
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.title === undefined) {
            alert("로그아웃 후 다시 로그인해 주세요");
          } else {
            alert(err.response.data.title);
          }
        });
  };

  const handleImageClick = (imgName, isMain, imgSeq) => {
    setMainImage(imgName);
    setIsMainImage(isMain);
    setMainImgSeq(imgSeq);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "placeMainImg") {
      setMainSaveImage(files[0]);
    } else if (name === "placeDetailImgName") {
      setDetailImage(files[0]);
    }
  };

  const handleDeleteImage = (imgName) => {
    let url = `http://localhost:9000/admin/place/delete/main/${mainImgSeq}`;
    if (!isMainImage) {
      url = `http://localhost:9000/admin/place/delete/detail/${mainImgSeq}`;
    }
    axios({
      method: "DELETE",
      url: url,
      headers: {
        Authorization: sessionStorage.getItem("Authorization"),
      }
    })
        .then((res) => {
          alert(res.data);
          return axios.get(`http://localhost:9000/admin/place/${curPlaceData.placeSeq}`);
        })
        .then((res) => {
          setCurPlaceData(res.data);
          setCurPlaceDetailList(res.data.placeDetailImgList);
          handleUpdate();
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.title === undefined) {
            alert("로그아웃 후 다시 로그인해 주세요");
          } else {
            alert(err.response.data.title);
          }
        });
  };

  const handleDelete = () => {
    axios({
      method: "DELETE",
      url: `http://localhost:9000/admin/place/delete/${curPlaceData.placeSeq}`,
      headers: {
        Authorization: sessionStorage.getItem("Authorization"),
      }
    })
        .then((res) => {
          alert(res.data);
          handleUpdate();
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.title === undefined) {
            alert("로그아웃 후 다시 로그인해 주세요");
          } else {
            alert(err.response.data.title);
          }
        });
  };

  const handleMainSave = () => {
    let errorMessage = "";
    if (!mainSaveImage) {
      errorMessage = "사진을 등록해 주세요.";
    }
    if (errorMessage !== "") {
      alert(errorMessage);
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("file", mainSaveImage);

    axios({
      method: "PUT",
      url: `http://localhost:9000/admin/place/main/${curPlaceData.placeSeq}`,
      headers: {
        Authorization: sessionStorage.getItem("Authorization"),
      },
      data: formDataToSend,
    })
        .then((res) => {
          alert(res.data);
          setMainSaveImage(null);
          setDetailImage(null);
          return axios.get(`http://localhost:9000/admin/place/${curPlaceData.placeSeq}`);
        })
        .then((res) => {
          setCurPlaceData(res.data);
          setCurPlaceDetailList(res.data.placeDetailImgList);
          handleUpdate();
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.title === undefined) {
            alert("로그아웃 후 다시 로그인해 주세요");
          } else {
            alert(err.response.data.title);
          }
        });
  }

  const handleDetailSave = () => {
    let errorMessage = "";
    if (!detailImage) {
      errorMessage = "사진을 등록해 주세요.";
    }
    if (errorMessage !== "") {
      alert(errorMessage);
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("file", detailImage);

    axios({
      method: "POST",
      url: `http://localhost:9000/admin/place/detail/${curPlaceData.placeSeq}`,
      headers: {
        Authorization: sessionStorage.getItem("Authorization"),
      },
      data: formDataToSend,
    })
        .then((res) => {
          alert(res.data);
          setMainSaveImage(null);
          setDetailImage(null);
          return axios.get(`http://localhost:9000/admin/place/${curPlaceData.placeSeq}`);
        })
        .then((res) => {
          setCurPlaceData(res.data);
          setCurPlaceDetailList(res.data.placeDetailImgList);
          handleUpdate();
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.title === undefined) {
            alert("로그아웃 후 다시 로그인해 주세요");
          } else {
            alert(err.response.data.title);
          }
        });
  }

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
                  {curPlaceDetailList.length > 0 &&
                      curPlaceDetailList.map((img, i) => (
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
                      <label>Place Name: {curPlaceData.placeName}</label>
                      <input
                          type="text"
                          name="placeName"
                          value={formData.placeName}
                          onChange={handleChange}
                          className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label>Place Address: {curPlaceData.placeAddress}</label>
                      <input
                          type="text"
                          name="placeAddress"
                          value={formData.placeAddress}
                          onChange={handleChange}
                          className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label>Place Description: {curPlaceData.placeDescription}</label>
                      <input
                          type="text"
                          name="placeDescription"
                          value={formData.placeDescription}
                          onChange={handleChange}
                          className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label>Change Main Image:</label>
                      <input
                          type="file"
                          name="placeMainImg"
                          onChange={handleFileChange}
                          className="form-control"
                      />
                      <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleMainSave}
                      >
                        Main Image Update
                      </button>
                    </div>
                    <br/><br/>

                    <div className="mb-3">
                      <label>Change Detail Image:</label>
                      <input
                          type="file"
                          name="placeDetailImgName"
                          onChange={handleFileChange}
                          className="form-control"
                      />
                      <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleDetailSave}
                      >
                        Detail Image Update
                      </button>

                    </div>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSave}
                    >
                      Place Update
                    </button>
                    {"  "}
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={handleDelete}
                    >
                      Place Delete
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
PlaceDetail.propTypes = {
  handleUpdate: PropTypes.func,
};



export default PlaceDetail;
