import PropTypes from "prop-types";
import React, { Fragment } from "react";
import AdminPhotoTopActionFilter from "../components/AdminPhotoTopActionFilter";

const AdminPhotoTopbar = ({
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
      <AdminPhotoTopActionFilter
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

AdminPhotoTopbar.propTypes = {
  getFilterSortParams: PropTypes.func,
  getLayout: PropTypes.func,
  getSortParams: PropTypes.func,
  productCount: PropTypes.number,
  products: PropTypes.array,
  sortedProductCount: PropTypes.number
};

export default AdminPhotoTopbar;
