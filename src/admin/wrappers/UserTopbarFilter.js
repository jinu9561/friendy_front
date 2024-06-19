import PropTypes from "prop-types";
import React, { Fragment } from "react";
import UserTopActionFilter from "../components/UserTopActionFilter";

const UserTopbarFilter = ({
  getLayout,
  getFilterSortParams,
  productCount,
  sortedProductCount,
  products,
  getSortParams
}) => {
  return (
    <Fragment>
      {/* shop top action */}
      <UserTopActionFilter
        getLayout={getLayout}
        getFilterSortParams={getFilterSortParams}
        productCount={productCount}
        sortedProductCount={sortedProductCount}
        products={products}
        getSortParams={getSortParams}
      />
    </Fragment>
  );
};

UserTopbarFilter.propTypes = {
  getFilterSortParams: PropTypes.func,
  getLayout: PropTypes.func,
  getSortParams: PropTypes.func,
  productCount: PropTypes.number,
  products: PropTypes.array,
  sortedProductCount: PropTypes.number
};

export default UserTopbarFilter;
