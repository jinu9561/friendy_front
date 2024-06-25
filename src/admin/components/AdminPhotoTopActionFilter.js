import PropTypes from "prop-types";
import React, {Fragment, useContext, useState} from "react";
import registerIcon from "../../assets/img/admin/register-icon.png";
import {LogingedContext} from "../../App";

const AdminPhotoTopActionFilter = ({
  getFilterSortParams,
  productCount,
  sortedProductCount,
  photos,
  getSortParams,
  handelUpdate
}) => {

    let logingedCon =useContext(LogingedContext);

  return (
    <Fragment>
      <div className="shop-top-bar mb-35">
        <div className="select-shoing-wrap">
          <div className="shop-select">
              <select
                  onChange={e => getFilterSortParams("filterSort", e.target.value)}
              >
                  <option value="default">기본</option>
                  <option value="regDate">최신 등록순</option>
                  <option value="update">최근 수정순</option>
              </select>
          </div>
            <p>
            Showing {sortedProductCount} of {productCount} result
          </p>
        </div>

        <div className="filter-active">

        </div>

      </div>


    </Fragment>
  );
};

AdminPhotoTopActionFilter.propTypes = {
  getFilterSortParams: PropTypes.func,
  getSortParams: PropTypes.func,
  productCount: PropTypes.number,
  products: PropTypes.array,
  sortedProductCount: PropTypes.number
};

export default AdminPhotoTopActionFilter;
