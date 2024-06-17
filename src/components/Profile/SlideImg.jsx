import React from 'react';
import Slider from 'react-slick';
import { CustomNextArrow, CustomPrevArrow } from './CustomArrow';
import defaultProfileImage from '../../assets/img/prof/default.jpeg';
import removeIcon from '../../assets/img/prof/remove-icon.png';
import axios from 'axios';

const SlideImg = ({ profileData,refresh }) => {

    const sliderSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        variableWidth: true,
        adaptiveHeight: true,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />
    };

    const getDetailImg = (imgName) => {
        return imgName ? "http://localhost:9000/profile/detail/img?imgName=" + imgName : defaultProfileImage;
    };

    const handleDeleteDetail = (profileDetailImgSeq) => {
        let check = window.confirm("등록된 사진을 삭제하시겠습니까?");

        if (check) {
            // 전송
            axios({
                method: "DELETE",
                url: "http://localhost:9000/profile/detail/img",
                data: profileDetailImgSeq,
                headers: {
                    Authorization: localStorage.getItem("Authorization"),
                }
            })
            .then((res) => {
                    alert(res.data);
                    refresh();
            })
            .catch((err) => {
                    if (err.response && err.response.data && err.response.data.title === undefined) {
                        alert("로그아웃 후 다시 로그인해 주세요");
                    } else {
                        alert(err.response.data.title);
                    }
            });
        }
    }



    return (
        <div className="profile-slider">
            <Slider {...sliderSettings}>
                {profileData.profileDetailImgList.filter(img => img.imgStatus === "APPROVED").map((proFileDetailImgDTO, index) => (
                    <div key={proFileDetailImgDTO.profileDetailImgSeq} className="slide">
                        <div className="slide-image-container">
                            <img src={getDetailImg(proFileDetailImgDTO.profileDetailImgName)} alt={`Detail ${index}`} className="slide-image" />
                            <img src={removeIcon} alt="Remove" className='remove-icon-detail' onClick={()=>handleDeleteDetail(proFileDetailImgDTO.profileDetailImgSeq)} />
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default SlideImg;