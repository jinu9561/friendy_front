import PropTypes from "prop-types";
import React, {Fragment, useState} from "react";
import {toggleShopTopFilter} from "../../helpers/product";
import registerIcon from '../../assets/img/admin/register-icon.png';
import PlaceUpload from "./PlaceUpload";


const PlaceTopActionFilter = ({
                                  getFilterSortParams,
                                  productCount,
                                  sortedProductCount,
                                  handleUpdate // Ensure handleUpdate is received
}) => {
const [modalShow, setModalShow] = useState(false);
  return (
    <Fragment>
      <div className="shop-top-bar mb-35">
        <div className="select-shoing-wrap">
          <div className="shop-select">
            <select
                onChange={e => getFilterSortParams("filterSort", e.target.value)}
            >
              <option value="default">기본</option>
              <option value="regDate">최근 등록순</option>
              <option value="update">최근 수정순</option>
            </select>
          </div>
          <p>
            Showing {sortedProductCount} of {productCount} result
          </p>
        </div>
        <div className="filter-active">
          <button onClick={() => setModalShow(true)}>
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
        <PlaceUpload
            show={modalShow}
            onHide={()=>setModalShow(false)}
            handleUpdate={handleUpdate}
        />


    </Fragment>
  );
};

PlaceTopActionFilter.propTypes = {
    getFilterSortParams: PropTypes.func,
    getSortParams: PropTypes.func,
    productCount: PropTypes.number,
    products: PropTypes.array,
    sortedProductCount: PropTypes.number,
    handleUpdate: PropTypes.func // PropTypes validation for handleUpdate
};

export default PlaceTopActionFilter;
