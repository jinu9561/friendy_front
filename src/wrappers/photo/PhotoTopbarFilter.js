import PropTypes from "prop-types";
import React, { Fragment } from "react";
import PhotoTopActionFilter from "../../components/photo/PhotoTopActionFilter";

const PhotoTopbar = ({
  getLayout,
  getFilterSortParams,
  productCount,
  sortedProductCount,
   photos,
  getSortParams,
  handelUpdate,
}) => {
  return (
    <Fragment>
      {/* shop top action */}
      <PhotoTopActionFilter
        getLayout={getLayout}
        getFilterSortParams={getFilterSortParams}
        productCount={productCount}
        sortedProductCount={sortedProductCount}
        photos={photos}
        getSortParams={getSortParams}
        handelUpdate={handelUpdate}
      />
    </Fragment>
  );
};

PhotoTopbar.propTypes = {
  getFilterSortParams: PropTypes.func,
  getLayout: PropTypes.func,
  getSortParams: PropTypes.func,
  productCount: PropTypes.number,
  products: PropTypes.array,
  sortedProductCount: PropTypes.number
};

export default PhotoTopbar;
