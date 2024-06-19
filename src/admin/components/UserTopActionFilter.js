import PropTypes from "prop-types";
import React, { Fragment } from "react";

const UserTopActionFilter = ({
  getFilterSortParams,
  productCount,
  sortedProductCount,
  products,
  getSortParams
}) => {
  return (
    <Fragment>
      <div className="shop-top-bar mb-35">
        <div className="select-shoing-wrap">
          <div className="shop-select">
            <select
              onChange={e => getFilterSortParams("filterSort", e.target.value)}
            >
              <option value="default">기본</option>
              <option value="regDate">최근 가입자순</option>
              <option value="imgStatus">사진 등록순</option>
            </select>
          </div>
          <p>
            Showing {sortedProductCount} of {productCount} result
          </p>
        </div>

        
      </div>


    </Fragment>
  );
};

UserTopActionFilter.propTypes = {
  getFilterSortParams: PropTypes.func,
  getSortParams: PropTypes.func,
  productCount: PropTypes.number,
  products: PropTypes.array,
  sortedProductCount: PropTypes.number
};

export default UserTopActionFilter;
