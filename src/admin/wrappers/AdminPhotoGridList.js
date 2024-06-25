import PropTypes from "prop-types";
import React, { Fragment } from "react";

import '../../assets/css/photoGrid.css';
import AdminPhoto from "./AdminPhoto";

const AdminPhotoGridList = ({
  photos, // photos 배열을 props로 받습니다.
  spaceBottomClass,
  handelUpdate
}) => {
  return (
      <Fragment>
        <div className="photo-grid">
          {photos?.map((photo) => (
              <div key={photo.photoBoardSeq} className="photo-grid-item">
                <AdminPhoto
                    spaceBottomClass={spaceBottomClass} // 추가할 CSS 클래스
                    photo={photo} // 개별 사진 데이터
                    handelUpdate={handelUpdate}
                />
                <div className="photo-title">
                  <h3>{photo.photoBoardTitle}</h3>
                </div>
              </div>
          ))}
        </div>
      </Fragment>
  );
};

AdminPhotoGridList.propTypes = {
  photos: PropTypes.array, // photos는 배열 타입이어야 합니다.
  spaceBottomClass: PropTypes.string, // spaceBottomClass는 문자열 타입이어야 합니다.
};

export default AdminPhotoGridList; // PhotoGridList 컴포넌트를 내보냅니다.
