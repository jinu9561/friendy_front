import PropTypes from "prop-types";
import React, {Fragment, useContext, useState} from "react";
import registerIcon from "../../assets/img/admin/register-icon.png";
import PhtoUpload from "./PhtoUpload";
import {LogingedContext} from "../../App";

const PhotoTopActionFilter = ({
  getFilterSortParams,
  productCount,
  sortedProductCount,
  photos,
  getSortParams,
  handelUpdate
}) => {
  const [modalShow, setModalShow] = useState(false);
    let logingedCon =useContext(LogingedContext);

    const handleRegisterClick = () => {
        if (logingedCon.isLoggedIn) {
            setModalShow(true);
        } else {
            alert("로그인 후 이용해주세요!");
        }
    };
  return (
    <Fragment>
      <div className="shop-top-bar mb-35">
        <div className="select-shoing-wrap">
          <div className="shop-select">
              <select
                  onChange={e => getFilterSortParams("filterSort", e.target.value)}
              >
                  <option value="default">기본</option>
                  <option value="like">좋아요 순</option>
                  <option value="regDate">최신 등록순</option>
                  <option value="update">최근 수정순</option>
                  { logingedCon.isLoggedIn &&
                    <option value="user">나의 게시글</option>
                  }
              </select>
          </div>
            <p>
            Showing {sortedProductCount} of {productCount} result
          </p>
        </div>

        <div className="filter-active">
          <button onClick={handleRegisterClick}>
            <img
                src={registerIcon}
                alt="Register"
                className="register-icon"
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "10px",
                  width: "50px",
                  height: "50px",
                  cursor: "pointer"
                }}
            />
          </button>

        </div>
      </div>

      {/*장소 추천 등록 폼 */}
      <PhtoUpload
          show={modalShow}
          onHide={()=>setModalShow(false)}
          handleUpdate={handelUpdate}
      />


    </Fragment>
  );
};

PhotoTopActionFilter.propTypes = {
  getFilterSortParams: PropTypes.func,
  getSortParams: PropTypes.func,
  productCount: PropTypes.number,
  products: PropTypes.array,
  sortedProductCount: PropTypes.number
};

export default PhotoTopActionFilter;
