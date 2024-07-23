import { Fragment, useState } from "react";
import { EffectFade, Thumbs } from 'swiper';
import { Modal } from "react-bootstrap";
import Swiper, { SwiperSlide } from "../../components/swiper";
import defaultProfileImage from '../../assets/img/prof/default.jpeg';
import moment from 'moment';
import axios from "axios";
import '../../assets/css/detailPink.css';

function UserDetail({ profileData, currency,show, onHide,profileDetailList }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const [curProfileData, setCurProfileData] = useState({ ...profileData });
  const [curProfileDetailData,setCurProfileDetailData] = useState({...profileDetailList})
  const [formData, setFormData] = useState({ ...profileData });
  const [mainImage, setMainImage] = useState(profileData.profileMainImgName);
  const [isMainImage, setIsMainImage] = useState(true); // 상태 값 추가
  const [selectedImgStatus, setSelectedImgStatus] = useState(curProfileData.imgStatus); // Add state for selected image status


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

  const getImg = (main,imgName) => {

    if(main){
      return  imgName ? "http://localhost:9000/profile/main/img?imgName="  + imgName : defaultProfileImage ;
    }

    return  imgName ? "http://localhost:9000/profile/detail/img?imgName=" + imgName : defaultProfileImage ;
  };

  const handleSave = () => {

    const saveData = isMainImage ? formData : {
      profileSeq: profileData.profileSeq,
      imgStatus: formData.imgStatus,
      profileDetailImgName : mainImage,
    };

    const url = isMainImage ?
        "http://localhost:9000/admin/users/profile" :
        `http://localhost:9000/admin/users/profile/detail/${profileData.userSeq}`;

    axios({
      method: "PUT",
      url: url,
      data: saveData,
      headers: {
        Authorization: sessionStorage.getItem("Authorization"),
      }
     })
        .then((res) => {
          alert(res.data);
          return axios.get(`http://localhost:9000/admin/users/profile/${curProfileData.userSeq}`);
        })
        .then((res) => {
          setFormData(res.data);
          setCurProfileData(res.data);
          if (!isMainImage) {
            return axios.get(`http://localhost:9000/admin/users/profile/detail/${curProfileData.userSeq}`);
          }
        })
        .then((res) => {
          if (res) {
            setCurProfileDetailData(res.data);
            const detailImg = res.data.find(img => img.profileDetailImgName === mainImage);
            setSelectedImgStatus(detailImg ? detailImg.imgStatus : selectedImgStatus);
          }
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.title === undefined) {
            alert("로그아웃 후 다시 로그인해 주세요");
          } else {
            alert(err.response.data.title);
          }
        });

    console.log('Saved data:', formData);
    console.log('detail data:', curProfileDetailData);
  };

  const formatDateTimeArray = (dateTimeArray) => {
    if (Array.isArray(dateTimeArray) && dateTimeArray.length === 7) {
      const [year, month, day, hour, minute, second, nanosecond] = dateTimeArray;
      const dateTimeString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}.${String(nanosecond).slice(0, 3)}Z`;
      return moment(dateTimeString).isValid() ? moment(dateTimeString).format('YYYY-MM-DD HH:mm:ss') : 'Invalid date';
    }
    return 'Invalid date';
  };

  const handleImageClick = (imgName, isMain) => {
    setMainImage(imgName);
    setIsMainImage(isMain);
    if (isMain) {
      setSelectedImgStatus(curProfileData.imgStatus); // Update the status for main image
      console.log(selectedImgStatus);
    } else {
      const selectedImg = curProfileDetailData.find(img => img.profileDetailImgName === imgName);
      setSelectedImgStatus(selectedImg.imgStatus); // Update the status for selected detail image
      console.log(selectedImgStatus);
    }
  };

  const handleUserStateChange = (status)=>{
    setFormData({ ...formData, userState: status });
  }



  return (
    <Modal show={show} onHide={onCloseModal} className="product-quickview-modal-wrapper">
    <Modal.Header closeButton></Modal.Header>

    <div className="modal-body">
      <div className="row">
        <div className="col-md-5 col-sm-12 col-xs-12">
          <div className="product-large-image-wrapper">
            <Swiper options={gallerySwiperParams}>
                    <SwiperSlide key={formData.userSeq}>
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
              {profileDetailList.length > 0  &&
                profileDetailList.map((img, i) => {
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
              <SwiperSlide key={formData.userSeq}>
                <div className="single-image" onClick={() => handleImageClick(profileData.profileMainImgName, true)}>
                  <img
                      src={getImg(true, profileData.profileMainImgName)}
                      className="img-fluid"
                      alt={profileData.profileMainImgName}
                  />
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
        <div className="col-md-7 col-sm-12 col-xs-12">
          <div>
            <h2>사용자 이름: {formData.userName}</h2>
            <div className="product-details-price">
              <Fragment>
                <div className="mb-3">
                  <label>현재 닉네임: {curProfileData.nickName}</label>
                  <input
                      type="text"
                      name="nickName"
                      value={formData.nickName}
                      onChange={handleChange}
                      className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label>Email</label>
                  <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control"
                      readOnly={true}
                  />
                </div>
                <div className="mb-3">
                  <label>Phone</label>
                  <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-control"
                      readOnly={true}
                  />
                </div>
                <div className="mb-3">
                  <h4>사용자 상태 : {curProfileData.userState}</h4>
                  <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleUserStateChange('WAITING')}
                  >
                    대기
                  </button>
                  {"   "}
                  <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => handleUserStateChange('NORMAL')}
                  >
                    정상
                  </button>
                  {"   "}
                  <button
                      type="button"
                      className="btn btn-info"
                      onClick={() => handleUserStateChange('CERTIFIED')}
                  >
                    인증
                  </button>
                  {"   "}
                  <button
                      type="button"
                      className="btn btn-dark"
                      onClick={() => handleUserStateChange('DORMANT')}
                  >
                    탈퇴
                  </button>
                  {"   "}
                  <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleUserStateChange('TEMPORARY_STOP')}
                  >
                    일시정지
                  </button>
                  {"   "}
                  <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleUserStateChange('PERMANENT_STOP')}
                  >
                    영구정지
                  </button>
                  {"   "}
                  <br></br>
                  <br></br>
                  <label>클릭 버튼 : {formData.userState}</label>
                </div>
                <br></br>
                <br></br>

                <div className="mb-3">
                  <h4>선택한 이미지 : {mainImage}</h4>
                  <h5>선택한 이미지 상태: {selectedImgStatus}</h5>
                  <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleStatusChange('PENDING')}
                  >
                    대기
                  </button>
                  {"   "}
                  <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => handleStatusChange('APPROVED')}
                  >
                    승인
                  </button>
                  {"   "}
                  <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleStatusChange('REJECTED')}
                  >
                    반려
                  </button>
                  {"   "}
                </div>
                <label>클릭 버튼 : {formData.imgStatus}</label>
                <br></br>
                <br></br>
              </Fragment>
            </div>
            <div className="pro-details-rating-wrap">
              <div className="pro-details-rating">
                매너 온도 : {curProfileData.userRate}
              </div>
              <div>
                <input
                    type="range"
                    name="userRate"
                    min="1"
                    max="100"
                    value={formData.userRate}
                    onChange={(e) => handleRatingChange(parseInt(e.target.value))}
                    className="slider"
                />
                <span>{formData.userRate}</span>
              </div>


            </div>
            <div className="pro-details-list">
              <br></br>
              <h5>현재 자기소개 : {curProfileData.introduce}</h5>
              <input
                  type="text"
                  name="introduce"
                  value={formData.introduce}
                  onChange={handleChange}
                  className="form-control"
              />
              <br></br>
              <p>가입일 : {formatDateTimeArray(formData.regDate)}</p>
              <br></br>
              <p>마지막 로그인 : {formatDateTimeArray(formData.lastLoginDate)}</p>
            </div>
          </div>
          <br></br>
          <div className="pro-details-cart btn-hover">
            <button onClick={handleSave} className="btn btn-primary">
              수정하기
            </button>
          </div>
        </div>
      </div>
      </div>

  </Modal>
  );
}


export default UserDetail;
