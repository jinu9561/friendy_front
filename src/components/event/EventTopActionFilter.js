import PropTypes from "prop-types";
import React, { Fragment } from "react";


const EventTopActionFilter = ({onFilterChange}) => {
  const handleSortChange = (e) => {
    const value = e.target.value;
    if (onFilterChange) {
      onFilterChange(value);
    }
  };

  return (
    <Fragment>
      <div className="shop-top-bar mb-35">
        <div className="select-shoing-wrap">
          <div className="shop-select">
            <select onChange={handleSortChange}>
              <option value="default">등록순</option>
              <option value="deadLine">마감순</option>
            </select>
          </div>
        </div>

        <div className="filter-active">
          
        </div>
      </div>

     
    </Fragment>
  );
};

EventTopActionFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default EventTopActionFilter;
