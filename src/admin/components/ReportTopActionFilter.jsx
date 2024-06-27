import React, { Fragment } from "react";
import PropTypes from "prop-types";

const ReportTopActionFilter = ({ getFilterSortParams, reportCount, sortedReportCount }) => {
    return (
        <Fragment>
            <div className="shop-top-bar mb-35">
                <div className="select-shoing-wrap">
                    <div className="shop-select">
                        <select onChange={(e) => getFilterSortParams("filterSort", e.target.value)}>
                            <option value="default">최신순</option>
                            <option value="processing">처리중</option>
                        </select>
                    </div>
                    <p>Showing {sortedReportCount} of {reportCount} results</p>
                </div>
            </div>
        </Fragment>
    );
};

ReportTopActionFilter.propTypes = {
    getFilterSortParams: PropTypes.func.isRequired,
    reportCount: PropTypes.number.isRequired,
    sortedReportCount: PropTypes.number.isRequired,
};

export default ReportTopActionFilter;
