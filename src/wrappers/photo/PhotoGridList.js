import PropTypes from "prop-types";
import React, { Fragment } from "react";
import Test from "./Test";

const PhotoGridList = ({
  photos, // photos 배열을 props로 받습니다.
  spaceBottomClass, // 추가할 CSS 클래스를 props로 받습니다.
}) => {
  return (
    <Fragment>
      {photos?.map((photo) => (
        <div className="col-xl-4 col-sm-6" key={photo.photoBoardSeq}>
          <Test
            spaceBottomClass={spaceBottomClass} // 추가할 CSS 클래스
            photo={photo} // 개별 사진 데이터
          />
        </div>
      ))}
    </Fragment>
  );
};

PhotoGridList.propTypes = {
  photos: PropTypes.array, // photos는 배열 타입이어야 합니다.
  spaceBottomClass: PropTypes.string, // spaceBottomClass는 문자열 타입이어야 합니다.
};

export default PhotoGridList; // PhotoGridList 컴포넌트를 내보냅니다.
