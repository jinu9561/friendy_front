import React from "react";
import Korean from "../../assets/img/prof/Korean.png";
import Nations from "../../assets/img/prof/Nations.png";
import Approve from "../../assets/img/prof/Approve.png";
import defaultProfileImage from "../../assets/img/prof/default.jpeg";
import removeIcon from "../../assets/img/prof/remove-icon.png";

const Profile = ({ profileData, handledeleteImg }) => {
  const getMainImg = (imgName, profileMainApprove) => {
    if (profileMainApprove === "APPROVED") {
      return "http://localhost:9000/profile/main/img?imgName=" + imgName;
    }
    return defaultProfileImage;
  };

  return (
    <div className="profile-container">
      <div className="profile-image-container">
        <img
          src={getMainImg(
            profileData.profileMainImgName,
            profileData.profileMainApprove
          )}
          alt="Profile"
          className="round-image"
        />
        {profileData.userState === "CERTIFIED" && (
          <img
            src={Approve}
            alt="Phone Verified"
            className="icon"
            style={{ left: -12 }}
          />
        )}
        {profileData.country === "KOREAN" ? (
          <img src={Korean} alt="Korean" className="icon" />
        ) : (
          <img src={Nations} alt="Foreigner" className="icon" />
        )}
        <img
          src={removeIcon}
          alt="Remove"
          className="remove-icon"
          onClick={handledeleteImg}
        />
      </div>
      <div className="profile-details">
        <p>
          <strong>이름 : </strong> {profileData.userName}
        </p>
        <p>
          <strong>닉네임 : </strong> {profileData.nickName}
        </p>
        <p>
          <strong>매너 온도 : </strong> {profileData.userRate}도
        </p>
        <p>
          <strong>국적 : </strong>{" "}
          {profileData.country === "KOREAN" ? "내국인" : "외국인"}
        </p>
        <p>
          <strong>성별 : </strong>{" "}
          {profileData.gender === "MALE" ? "남자" : "여자"}
        </p>
        <p>
          <strong>보유 젤리 : </strong> {profileData.userJelly} 개
        </p>
        <p>
          <strong>자기소개 : </strong> {profileData.introduce}
        </p>
      </div>
    </div>
  );
};

export default Profile;
