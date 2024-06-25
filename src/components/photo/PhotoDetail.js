import React, {Fragment, useContext, useEffect, useState} from "react";
import { EffectFade, Thumbs } from 'swiper';
import { Modal } from "react-bootstrap";
import Swiper, { SwiperSlide } from "../../components/swiper";
import axios from "axios";
import removeIcon from '../../assets/img/prof/remove-icon.png'
import PropTypes from "prop-types";
import PhotoInterestList from "./PhotoInterestList";
import Select from "react-select";
import {LogingedContext} from "../../App";
import defaultProfileImage from "../../assets/img/prof/default.jpeg";
import Approve from "../../assets/img/prof/Approve.png";
import Korean from "../../assets/img/prof/Korean.png";
import Nations from "../../assets/img/prof/Nations.png";
import Like from '../../assets/img/photo/like-icon.png';
import UnLike from '../../assets/img/photo/unlike-icon.png';
import '../../assets/css/photoDetail.css';


function PhotoDetail({ photoData,show,photoBoardDetailImgList,getImg,onHide,getStatus,status,handleUpdate}) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const [curPhotoData, setCurPhotoData] = useState({ ...photoData });
  const [curPhtoDetailList, setCurPhtoDetailList] = useState([{...photoBoardDetailImgList}])
  const [formData, setFormData] = useState({
    ...photoData,
    interestCategory: [] // Initialize interestCategory as an empty array
  });
  const [mainImage, setMainImage] = useState(curPhotoData.photoMainImgName);
  const [isMainImage, setIsMainImage] = useState(true); // 상태 값 추가
  const [mainImgSeq,setMainImgSeq] = useState(curPhotoData.photoBoardSeq);
  const [mainSaveImage, setMainSaveImage] = useState(null);
  const [detailImage, setDetailImage] = useState(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [interestOptions, setInterestOptions] = useState([]);
  const [profileData, setProfileData] = useState({
    userName:"",
    nickName:"",
    country:"",
    gender:"",
    userJelly:"",
    introduce:"",
    profileMainImgName:"",
    profileMainApprove:"",
    profileDetailImgList:[],
    interestList:[],
    address:"",
    phone:"",
    email:"",
    userState:"",
    purchaseHistory:[]
  })

  const [isLike, setIsLike] = useState(false);

  const logingedCon =useContext(LogingedContext);

  useEffect(() => {

    axios.get("http://localhost:9000/interest/", {
      headers: { Authorization: localStorage.getItem("Authorization") },
    })
        .then((res) => {
          const options = res.data.map(interest => ({
            value: interest.interestSeq,
            label: interest.interestCategory
          }));
          setInterestOptions(options);
        })
        .catch((err) => {
          console.error(err);
        });


  }, []);

  useEffect(()=>{
    axios.get(`http://localhost:9000/like/${curPhotoData.photoBoardSeq}/${logingedCon.userSeq}`, {
      headers: { Authorization: localStorage.getItem("Authorization") },
    })
        .then((res) => {
          setIsLike(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
  }, []);

  const handleInterestChange = (selectedOptions) => {
    const interests = selectedOptions ? selectedOptions.map(option => option.label) : [];
    setFormData({
      ...formData,
      interestCategory: interests
    });
    console.log(curPhotoData);
    console.log(curPhtoDetailList);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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


  const handleImageClick = (imgName, isMain, imgSeq) => {
    setMainImage(imgName);
    setIsMainImage(isMain);
    console.log(imgSeq);
    setMainImgSeq(imgSeq);

    if (isMain) {
      console.log(mainImage);
      console.log(isMain);
      console.log(mainImgSeq);
    } else {
      //const selectedImg = curPlaceDetailList.find(img => img.placeDetailImgName === imgName);
      console.log(mainImage);
      console.log(isMain);
      console.log(mainImgSeq);
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "photoMainImg") {
      setMainSaveImage(files[0]);
    } else {
      setDetailImage(files[0]);
    }
  };

  const handleSave = ()=>{

    axios({
      method:"PUT",
      url : "http://localhost:9000/photo/alert/"+curPhotoData.photoBoardSeq,
      data: formData,
      headers :  {
        Authorization: localStorage.getItem("Authorization"),
      }
    })
        .then((res) => {
          alert(res.data);
          return axios.get(`http://localhost:9000/photo/${curPhotoData.photoBoardSeq}`);
        })
        .then((res)=>{
          setCurPhotoData(res.data);
          setCurPhtoDetailList(res.data.photoBoardDetailImgList);
          fetch()
        })
        .catch((err)=>{
          if (err.response && err.response.data && err.response.data.title === undefined) {
            alert("로그아웃 후 다시 로그인해 주세요");
          } else {
            alert(err.response.data.title);
          }
        });

  }

  const handleMainImg = ()=>{

    let errorMessage = "";

    // 필드 검증
    if (!mainSaveImage) {
      errorMessage = "사진을 등록해 주세요.";
    }

    if (errorMessage !=="") {
      alert(errorMessage);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("file", mainSaveImage);

    axios({
      method:"PUT",
      url : "http://localhost:9000/photo/main/"+curPhotoData.photoBoardSeq,
      data: formDataToSend,
      headers :  {
        Authorization: localStorage.getItem("Authorization"),
      }
    })
        .then((res) => {
          alert(res.data);
          return axios.get(`http://localhost:9000/photo/${curPhotoData.photoBoardSeq}`);
        })
        .then((res)=>{
          setCurPhotoData(res.data);
          setCurPhtoDetailList(res.data.photoBoardDetailImgList);
          fetch()
        })
        .catch((err)=>{
          if (err.response && err.response.data && err.response.data.title === undefined) {
            alert("로그아웃 후 다시 로그인해 주세요");
          } else {
            alert(err.response.data.title);
          }
        });

  }

  const handleDetailImg = ()=>{

    let errorMessage = "";

    // 필드 검증
    if (!detailImage) {
      errorMessage = "사진을 등록해 주세요.";
    }

    if (errorMessage !=="") {
      alert(errorMessage);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("file", detailImage);

    axios({
      method:"POST",
      url : "http://localhost:9000/photo/detail/"+curPhotoData.photoBoardSeq,
      data: formDataToSend,
      headers :  {
        Authorization: localStorage.getItem("Authorization"),
      }
    })
        .then((res) => {
          alert(res.data);
          return axios.get(`http://localhost:9000/photo/${curPhotoData.photoBoardSeq}`);
        })
        .then((res)=>{
          setCurPhotoData(res.data);
          setCurPhtoDetailList(res.data.photoBoardDetailImgList);
          fetch()
        })
        .catch((err)=>{
          if (err.response && err.response.data && err.response.data.title === undefined) {
            alert("로그아웃 후 다시 로그인해 주세요");
          } else {
            alert(err.response.data.title);
          }
        });

  }

  const fetch = ()=>{
    setMainSaveImage(null);
    setMainSaveImage(null);
    setIsEditMode(false)
    handleUpdate();
  }


  const handleDelete = ()=>{
    
    let check  = window.confirm("등록된 게시글을 삭제하시겠습니까?");

    if(!check)
      return
    
    axios({
      method:"DELETE",
      url : "http://localhost:9000/photo/delete/"+curPhotoData.photoBoardSeq,
      headers :  {
        Authorization: localStorage.getItem("Authorization"),
      }
    })
        .then((res) => {
          alert(res.data);
          handleUpdate();
        })
        .catch((err)=>{
          if (err.response && err.response.data && err.response.data.title === undefined) {
            alert("로그아웃 후 다시 로그인해 주세요");
          } else {
            alert(err.response.data.title);
          }
        });
  };

  const handleDeleteImage = () => {

    let check  = window.confirm("등록된 사진을 삭제하시겠습니까?");
    
    if(!check)
      return

    let url = "http://localhost:9000/photo/delete/main/"+mainImgSeq;

    if(!isMainImage){
      url = "http://localhost:9000/photo/delete/detail/"+mainImgSeq;
    }

    axios({
      method:"DELETE",
      url : url,
      headers :  {
        Authorization: localStorage.getItem("Authorization"),
      }
    })
        .then((res) => {
          alert(res.data);
          return axios.get(`http://localhost:9000/photo/${curPhotoData.photoBoardSeq}`);
        })
        .then((res)=>{
          setCurPhotoData(res.data);
          setCurPhtoDetailList(res.data.photoBoardDetailImgList);
          fetch()
        })
        .catch((err)=>{
          if (err.response && err.response.data && err.response.data.title === undefined) {
            alert("로그아웃 후 다시 로그인해 주세요");
          } else {
            alert(err.response.data.title);
          }
        });
  };

  useEffect(() => {
    setCurPhtoDetailList(photoBoardDetailImgList);
  }, [photoBoardDetailImgList]);

  const getProfileImg = (imgName, profileMainApprove) => {
    if (profileMainApprove === "APPROVED") {
      return "http://localhost:9000/profile/main/img?imgName=" + imgName;
    }
    return defaultProfileImage;
  };

  useEffect(() => {

    axios.get("http://localhost:9000/profile/"+photoData.userSeq,
        {
          headers :  {Authorization: localStorage.getItem("Authorization")},
        })
        .then((response) => {
          setProfileData(response.data);
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.title === undefined) {
            console.log(err);
          } else {
            alert(err.response.data.title);
          }
        });

  }, [photoData.userSeq]);

  const handleLike = () => {

    const updatedLikeStatus = !isLike;
    const updatedLikeCount = updatedLikeStatus ? curPhotoData.photoBoardLike + 1 : curPhotoData.photoBoardLike - 1;

    // Optimistically update the like status and count
    setIsLike(updatedLikeStatus);
    setCurPhotoData({
      ...curPhotoData,
      photoBoardLike: updatedLikeCount,
    });

    const url = updatedLikeStatus
        ? `http://localhost:9000/like/${curPhotoData.photoBoardSeq}/${logingedCon.userSeq}`
        : `http://localhost:9000/like/${curPhotoData.photoBoardSeq}/${logingedCon.userSeq}`;

    const method = updatedLikeStatus ? "POST" : "DELETE";

    axios({
      method: method,
      url: url,
      headers: {
        Authorization: localStorage.getItem("Authorization"),
      },
    })
        .then((res) => {
          if (res.data === updatedLikeCount) return;

          setCurPhotoData((prevData) => ({
            ...prevData,
            photoBoardLike: res.data,
          }));
          handleUpdate();
        })
        .catch((err) => {
          // 서버 요청이 실패했을 경우, 원래 상태로 복원
          setIsLike(!updatedLikeStatus);
          setCurPhotoData((prevData) => ({
            ...prevData,
            photoBoardLike: updatedLikeStatus ? prevData.photoBoardLike - 1 : prevData.photoBoardLike + 1,
          }));

          if (err.response && err.response.data && err.response.data.title === undefined) {
            console.log(err);
          } else {
            console.log(err.response.data.title);
          }
        });
  };



  return (
      <Modal show={show} onHide={onCloseModal} className="product-quickview-modal-wrapper">
        <Modal.Header closeButton />
        <div className="modal-body">
          <div className="row">
            <div className="col-md-5 col-sm-12 col-xs-12">
              <div className="product-large-image-wrapper">
                <Swiper options={gallerySwiperParams}>
                  <SwiperSlide key={curPhotoData.photoBoardSeq}>
                    {mainImage && (
                        <div className="single-image">
                          <img
                              src={getImg(isMainImage, mainImage)}
                              className="img-fluid"
                              alt={mainImage}
                          />
                          {isEditMode && (
                              <img
                                  src={removeIcon}
                                  alt="Remove"
                                  className="remove-icon"
                                  onClick={handleDeleteImage}
                                  style={{ position: 'absolute', top: '10px', right: '10px', width: '20px', height: '20px', cursor: 'pointer' }}
                              />
                          )}
                        </div>
                    )}
                  </SwiperSlide>
                </Swiper>
              </div>
              <div className="product-small-image-wrapper mt-15">
                <Swiper options={thumbnailSwiperParams}>
                  {curPhtoDetailList.length > 0 &&
                      curPhtoDetailList.map((img, i) => (
                          <SwiperSlide key={i}>
                            <div className="single-image" onClick={() => handleImageClick(img.photoDetailImgName, false, img.photoDetailImgSeq)}>
                              <img
                                  src={getImg(false, img.photoDetailImgName)}
                                  className="img-fluid"
                                  alt={img.photoDetailImgName}
                              />
                            </div>
                          </SwiperSlide>
                      ))}
                  <SwiperSlide key={curPhotoData.photoBoardSeq}>
                    <div className="single-image" onClick={() => handleImageClick(curPhotoData.photoMainImgName, true, curPhotoData.photoBoardSeq)}>
                      <img
                          src={getImg(true, curPhotoData.photoMainImgName)}
                          className="img-fluid"
                          alt={curPhotoData.photoMainImgName}
                      />
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
            <div className="col-md-7 col-sm-12 col-xs-12">
              <div className="profile-container">
                <div className="profile-image-container">
                  <img
                      src={getProfileImg(profileData.profileMainImgName, profileData.profileMainApprove)}
                      alt="Profile"
                      className="round-image"
                  />
                  {profileData.userState === "CERTIFIED" && (
                      <img
                          src={Approve}
                          alt="Phone Verified"
                          className="icon"
                          style={{ left: -7 }}
                      />
                  )}
                  {profileData.country === "KOREAN" ? (
                      <img src={Korean} alt="Korean" className="icon" />
                  ) : (
                      <img src={Nations} alt="Foreigner" className="icon" />
                  )}
                </div>
                <div className="profile-details">
                  <p>{profileData.nickName}</p>
                </div>
              </div>
              <div className="product-details-price">
                <Fragment>
                  {isEditMode ? (
                      <Fragment>
                        <div className="mb-3">
                          <label>Title:</label>
                          <input
                              type="text"
                              name="photoBoardTitle"
                              value={formData.photoBoardTitle}
                              onChange={handleChange}
                              className="form-control"
                          />
                          <button
                              type="button"
                              className="btn btn-primary mt-3"
                              onClick={handleSave}
                          >
                            Save
                          </button>
                        </div>
                        <div className="mb-3">
                          <Select
                              isMulti
                              name="interestCategory"
                              options={interestOptions}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={handleInterestChange}
                              value={interestOptions.filter(option => formData.interestCategory.includes(option.label))}
                          />
                          <button
                              type="button"
                              className="btn btn-primary mt-3"
                              onClick={handleSave}
                          >
                            Save
                          </button>
                        </div>
                        <div className="mb-3">
                          <label>Change Main Image:</label>
                          <input
                              type="file"
                              name="photoMainImg"
                              onChange={handleFileChange}
                              className="form-control"
                          />
                          <button
                              type="button"
                              className="btn btn-primary mt-3"
                              onClick={handleMainImg}
                          >
                            Save
                          </button>
                        </div>
                        <div className="mb-3">
                          <label>Change Detail Image:</label>
                          <input
                              type="file"
                              name="photoDetailImg"
                              onChange={handleFileChange}
                              className="form-control"
                          />
                          <button
                              type="button"
                              className="btn btn-primary mt-3"
                              onClick={handleDetailImg}
                          >
                            Save
                          </button>
                        </div>
                        <button
                            type="button"
                            className="btn btn-secondary mt-3"
                            onClick={() => setIsEditMode(false)}
                        >
                          Cancel
                        </button>
                      </Fragment>
                  ) : (
                      <Fragment>
                        <div className="mb-3">
                          <label>{curPhotoData.photoBoardTitle}</label>
                        </div>
                        <hr></hr>
                        <PhotoInterestList photoData={curPhotoData}/>
                        <hr></hr>
                        <div className="like-icon-container">
                          <img
                              src={isLike ? Like : UnLike}
                              alt="likeIcon"
                              className="likeIcon"
                              onClick={handleLike}
                          />
                          <span className="like-count">{photoData.photoBoardLike}</span>
                        </div>
                        <br></br>
                        {logingedCon.userSeq == curPhotoData.userSeq && (
                            <Fragment>
                              <button className="btn btn-secondary mr-2" onClick={() => setIsEditMode(true)}>
                                Edit
                              </button>
                              <button className="btn btn-danger ml-2" onClick={handleDelete}>
                                Delete
                              </button>
                            </Fragment>
                        )}
                      </Fragment>
                  )}
                </Fragment>
              </div>
            </div>

          </div>
        </div>
      </Modal>
  );
}

PhotoDetail.propTypes = {
  handleUpdate: PropTypes.func,
};


export default PhotoDetail;
