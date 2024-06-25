import React, {Fragment, useEffect, useState} from "react";
import { EffectFade, Thumbs } from 'swiper';
import { Modal } from "react-bootstrap";
import Swiper, { SwiperSlide } from "../../components/swiper";
import axios from "axios";
import removeIcon from '../../assets/img/prof/remove-icon.png'
import PropTypes from "prop-types";
import Place from "./Place";
import '../../assets/css/photoUpload.css';


function PlaceUpload({show,onHide,handleUpdate }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isDetail, setIsDetail] = useState(false);

  const [formData, setFormData] = useState({
    placeSeq: '',
    placeName: '',
    placeAddress: '',
    placeDescription: '',
    placeMainImgName: '',
    placeDetailList: []  // Ensure placeDetailList is an array
  });
  const [mainSaveImage, setMainSaveImage] = useState(null);
  const [detailImage,setDetailImage] = useState(null);
  const [detailSaveImage, setDetailSaveImage] = useState(null);
  const [curPlaceData, setCurPlaceData] = useState({
    msg:"",
    placeSeq:"",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData);
  };

  const getImg = (main, imgName) => {
    if (!imgName) {
      return "";
    }
    return main ? `http://localhost:9000/place/main/img?imgName=${imgName}` : `http://localhost:9000/place/detail/img?imgName=${imgName}`;
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

    let errorMessage = "";

    if (!formData.placeName) {
      errorMessage = "장소이름을 등록해 주세요.";
    } else if (!formData.placeAddress) {
      errorMessage = "주소를 등록해 주세요.";
    } else if (!formData.placeDescription) {
      errorMessage = "설명을 등록해 주세요.";
    } else if (!mainSaveImage) {
      errorMessage = "사진을 등록해 주세요.";
    }

    if (errorMessage !== "") {
      alert(errorMessage);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("placeName", formData.placeName);
    formDataToSend.append("placeAddress", formData.placeAddress);
    formDataToSend.append("placeDescription", formData.placeDescription);
    formDataToSend.append("file", mainSaveImage);

    axios({
      method: "POST",
      url: `http://localhost:9000/admin/place/upload`,
      data: formDataToSend,
      headers: {
        Authorization: sessionStorage.getItem("Authorization"),
      }
     })
        .then((res) => {
          alert(res.data.msg);
          setCurPlaceData(res.data);
          const isCheck = window.confirm("사진을 추가 등록 하시겠습니까?");
          setIsDetail(isCheck);
          handleUpdate();
        })
        .catch((err) => {
          alert(err.response?.data?.title || "오류가 발생했습니다. 다시 시도해 주세요.");
        });
  };


  const handleFileChange = (e) => {
      const { name, files } = e.target;
      if (name === "placeMainImg") {
        setMainSaveImage(files[0]);
      } else {
        setDetailSaveImage(files[0]);
      }
  };


  useEffect(() => {
    if (show) {
      resetForm();
    }
  }, [show]);


  const resetForm = () => {
    setFormData({
      placeSeq: '',
      placeName: '',
      placeAddress: '',
      placeDescription: '',
      placeMainImgName: '',
      placeDetailList: []
    });
    setMainSaveImage(null);
  };


  const handleDetailSave = () => {
    let errorMessage = "";

    if (!detailSaveImage) {
      errorMessage = "사진을 등록해 주세요.";
    }
    if (errorMessage !== "") {
      alert(errorMessage);
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("file", detailSaveImage);

    axios({
      method: "POST",
      url: `http://localhost:9000/admin/place/detail/${curPlaceData.placeSeq}`,
      data: formDataToSend,
      headers: {
        Authorization: sessionStorage.getItem("Authorization"),
      }
    })
        .then((res) => {
          alert(res.data);
          const isCheck = window.confirm("사진을 추가 등록 하시겠습니까?");
          setIsDetail(isCheck);
          handleUpdate();
        })
        .catch((err) => {
          alert(err.response?.data?.title || "오류가 발생했습니다. 다시 시도해 주세요.");
        });
  };




  return (
      <Modal show={show} onHide={onCloseModal} className="product-quickview-modal-wrapper">
        <Modal.Header closeButton></Modal.Header>

        <div className="modal-body">
          <div className="row">
            <div>
              <div>
                <div className="product-details-price">
                  <Fragment>
                  { !isDetail&&
                    <>
                    <div className="mb-3">
                      <label>Place Name : {formData.placeName}</label>
                      <input
                          type="text"
                          name="placeName"
                          value={formData.placeName}
                          onChange={handleChange}
                          className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label>Address : {formData.placeAddress}</label>
                      <input
                          type="text"
                          name="placeAddress"
                          value={formData.placeAddress}
                          onChange={handleChange}
                          className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label>Place Description: {formData.placeDescription}</label>
                      <input
                          type="text"
                          name="placeDescription"
                          value={formData.placeDescription}
                          onChange={handleChange}
                          className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <h4>Main Image</h4>
                      <input
                          type="file"
                          name="placeMainImg"
                          onChange={handleFileChange}
                          className="form-control"
                      />
                    </div>

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSave}
                    >
                      Register Place
                    </button>
                    {"  "}
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={onCloseModal}
                    >
                      Cancel
                    </button>
                    </>
                    }
                    {
                      isDetail &&
                         <>
                            <div className="mb-3">
                              <h4>Detail Image</h4>
                              <input
                                  type="file"
                                  name="placeDetailImg"
                                  onChange={handleFileChange}
                                  className="form-control"
                              />
                            </div>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleDetailSave}
                            >
                              Register Place
                            </button>
                      </>
                    }
                  </Fragment>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
  );
}

PlaceUpload.propTypes = {
  handleUpdate: PropTypes.func,
};


export default PlaceUpload;
