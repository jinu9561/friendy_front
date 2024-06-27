import { Fragment, useState, useEffect, useContext } from 'react';
import Paginator from 'react-hooks-paginator';
import { useLocation } from "react-router-dom";
import SEO from "../../../components/seo";
import LayoutOne from '../../../layouts/LayoutOne';
import Breadcrumb from '../../../wrappers/breadcrumb/Breadcrumb';
import { LogingedContext } from "../../../App";
import ReportList from '../../wrappers/ReportList';
import axios from 'axios';
import ReportTopActionFilter from "../../components/ReportTopActionFilter";

const AdminReport = () => {
    const [layout, setLayout] = useState('list');
    const [sortType, setSortType] = useState('');
    const [sortValue, setSortValue] = useState('');
    const [filterSortType, setFilterSortType] = useState('');
    const [filterSortValue, setFilterSortValue] = useState('');
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentData, setCurrentData] = useState([]);
    const [sortedReports, setSortedReports] = useState([]);

    const [reportDataList, setReportDataList] = useState([]);
    const pageLimit = 10;
    let { pathname } = useLocation();
    let logingedCon = useContext(LogingedContext);

    const homPath = logingedCon.isAdminIn ? process.env.PUBLIC_URL + '/adminReport' : process.env.PUBLIC_URL + '/';

    const getLayout = (layout) => {
        setLayout(layout);
    }

    const getFilterSortParams = (sortType, sortValue) => {
        setFilterSortType(sortType);
        setFilterSortValue(sortValue);
    }

    const getSortedReports = (reports, sortType, sortValue) => {
        if (sortType && sortValue) {
            if (sortValue === 'regDate') {
                return reports.sort((a, b) => new Date(b.reportRegDate) - new Date(a.reportRegDate));
            } else if (sortValue === 'update') {
                return reports.sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate));
            } else if (sortValue === 'lastLogin') {
                return reports.sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin));
            } else if (sortValue === 'userRate') {
                return reports.sort((a, b) => b.userRate - a.userRate);
            }
        }
        return reports;
    }

    useEffect(() => {
        let url = "http://localhost:9000/admin/report/";

        axios.get(url, {
            headers: { Authorization: sessionStorage.getItem("Authorization") },
        })
            .then((response) => {
                setReportDataList(response.data);
            })
            .catch((err) => {
                if (err.response && err.response.data && err.response.data.title === undefined) {
                    alert("로그아웃 후 다시 로그인해 주세요");
                } else {
                    alert(err.response.data.title);
                }
            });
    }, [filterSortValue]);

    useEffect(() => {
        const sortedReports = getSortedReports(reportDataList, sortType, sortValue);
        setSortedReports(sortedReports);
        setCurrentData(sortedReports.slice(offset, offset + pageLimit));
    }, [offset, reportDataList, sortType, sortValue]);

    return (
        <Fragment>
            <SEO
                titleTemplate="Admin Report"
                description="Admin Report Controller."
            />

            <LayoutOne headerTop="visible">
                <Breadcrumb
                    pages={[
                        {label: "Home", path: homPath },
                        {label: "ADMIN REPORT", path: process.env.PUBLIC_URL + pathname }
                    ]}
                />

                <div className="shop-area pt-95 pb-100">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <ReportTopActionFilter getLayout={getLayout} getFilterSortParams={getFilterSortParams} reportCount={reportDataList.length} sortedReportCount={currentData.length}/>

                                <ReportList layout={layout} reportDataList={currentData}/>

                                <div className="pro-pagination-style text-center mt-30">
                                    <Paginator
                                        totalRecords={reportDataList.length}
                                        pageLimit={pageLimit}
                                        pageNeighbours={2}
                                        setOffset={setOffset}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        pageContainerClass="mb-0 mt-0"
                                        pagePrevText="«"
                                        pageNextText="»"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LayoutOne>
        </Fragment>
    )
}

export default AdminReport;
