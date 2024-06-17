import React from 'react';

const ProfileDetail = ({profileData}) => {
    return (
        <div>
            <div className="profile-container">
                <div className="profile-details">
                    <p><strong>주소 : </strong> {profileData.address}</p>
                    <p><strong>전화번호 : </strong> {profileData.phone}</p>
                    <p><strong>이메일 : </strong> {profileData.email}</p>
                    <p><strong>닉네임 : </strong> {profileData.nickName}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileDetail;