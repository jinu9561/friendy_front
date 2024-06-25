import React, { Fragment } from "react";
import PropTypes from "prop-types";

const ReportTopActionFilter = ({ getLayout, getFilterSortParams, reportCount, sortedReportCount, getSortParams }) => {
    return (
        <Fragment>
            <div className="shop-top-bar mb-35">
                <div className="select-shoing-wrap">
                    <div className="shop-select">
                        <select onChange={(e) => getFilterSortParams("filterSort", e.target.value)}>
                            <option value="regDate">기본</option>
                        </select>
                    </div>
                    <p>Showing {sortedReportCount} of {reportCount} results</p>
                </div>
            </div>
        </Fragment>
    );
};

ReportTopActionFilter.propTypes = {
    getLayout: PropTypes.func.isRequired,
    getFilterSortParams: PropTypes.func.isRequired,
    reportCount: PropTypes.number.isRequired,
    sortedReportCount: PropTypes.number.isRequired,
    getSortParams: PropTypes.func.isRequired,
};

export default ReportTopActionFilter;
