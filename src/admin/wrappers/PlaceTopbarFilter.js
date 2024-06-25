import PropTypes from "prop-types";
import React, { Fragment } from "react";
import PlaceTopActionFilter from "../components/PlaceTopActionFilter";

const PlaceTopbarFilter = ({
  getLayout,
  getFilterSortParams,
  productCount,
  sortedProductCount,
  places,
  getSortParams,
  handleUpdate
}) => {
  return (
    <Fragment>
      {/* shop top action */}
      <PlaceTopActionFilter
        getLayout={getLayout}
        getFilterSortParams={getFilterSortParams}
        productCount={productCount}
        sortedProductCount={sortedProductCount}
        places={places}
        getSortParams={getSortParams}
        handleUpdate={handleUpdate}
      />
    </Fragment>
  );
};

PlaceTopbarFilter.propTypes = {
  getFilterSortParams: PropTypes.func,
  getLayout: PropTypes.func,
  getSortParams: PropTypes.func,
  productCount: PropTypes.number,
  products: PropTypes.array,
  sortedProductCount: PropTypes.number
};

export default PlaceTopbarFilter;
