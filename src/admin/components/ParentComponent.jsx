import React, { useState, useEffect } from 'react';
import ReportTopActionFilter from "./ReportTopActionFilter";
import ReportList from "../wrappers/ReportList";

const ParentComponent = ({ reportDataList }) => {
    const [filterCriteria, setFilterCriteria] = useState('default');
    const [sortedReportDataList, setSortedReportDataList] = useState(reportDataList);

    const getFilterSortParams = (type, value) => {
        if (type === "filterSort") {
            setFilterCriteria(value);
        }
    };

    useEffect(() => {
        let filteredData = [...reportDataList];
        if (filterCriteria === 'latest') {
            filteredData.sort((a, b) => new Date(b.reportRegDate) - new Date(a.reportRegDate));
        } else if (filterCriteria === 'processing') {
            filteredData = filteredData.filter(report => report.reportStatus === 0);
        }
        setSortedReportDataList(filteredData);
    }, [filterCriteria, reportDataList]);

    return (
        <div>
            <ReportTopActionFilter
                getFilterSortParams={getFilterSortParams}
                reportCount={reportDataList.length}
                sortedReportCount={sortedReportDataList.length}
            />
            <ReportList reportDataList={sortedReportDataList} />
        </div>
    );
};

export default ParentComponent;