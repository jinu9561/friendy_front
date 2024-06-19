import PropTypes from "prop-types";
import React, { Fragment } from "react";
import EventTopActionFilter from "../../components/event/EventTopActionFilter";
import Event from '../../pages/event/Event';

const EventTopbar = ({
  onFilterChange, 
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
      <EventTopActionFilter
        onFilterChange={onFilterChange}
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

EventTopbar.propTypes = {
  onFilterChange:PropTypes.func.isRequired,
  getFilterSortParams: PropTypes.func,
  getLayout: PropTypes.func,
  getSortParams: PropTypes.func,
  productCount: PropTypes.number,
  products: PropTypes.array,
  sortedProductCount: PropTypes.number
};

export default EventTopbar;
