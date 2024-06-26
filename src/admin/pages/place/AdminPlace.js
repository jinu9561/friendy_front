import { Fragment, useState, useEffect, useContext } from 'react';
import { useSelector } from "react-redux";
import Paginator from 'react-hooks-paginator';
import { useLocation } from "react-router-dom"
import { getSortedProducts } from '../../../helpers/product';
import SEO from "../../../components/seo";
import LayoutOne from '../../../layouts/LayoutOne';
import Breadcrumb from '../../../wrappers/breadcrumb/Breadcrumb';
import { LogingedContext } from "../../../App";
import PlaceTopbarFilter from '../../wrappers/PlaceTopbarFilter';
import axios from 'axios';
import AdminPlacesList from "../../wrappers/AdminPlacesList";

const AdminPlace = () => {
    const [layout, setLayout] = useState('grid three-column');
    const [sortType, setSortType] = useState('');
    const [sortValue, setSortValue] = useState('');
    const [filterSortType, setFilterSortType] = useState('');
    const [filterSortValue, setFilterSortValue] = useState('');
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentData, setCurrentData] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]);
    const { products } = useSelector((state) => state.product);

    const currency = useSelector((state) => state.currency);
    const [places,setPlaces] = useState([]);
    const [status,setStatus] = useState(false);



    const pageLimit = 10;
    let { pathname } = useLocation();
    let logingedCon =useContext(LogingedContext);

    const homPath = logingedCon.isAdminIn ? process.env.PUBLIC_URL + '/adminUser' : process.env.PUBLIC_URL + '/';
    

    const getLayout = (layout) => {
        setLayout(layout)
    }

    const getSortParams = (sortType, sortValue) => {
        setSortType(sortType);
        setSortValue(sortValue);
    }

    const getFilterSortParams = (sortType, sortValue) => {
        setFilterSortType(sortType);
        setFilterSortValue(sortValue);
    }

    useEffect(() => {

        let url = "http://localhost:9000/admin/place/";

        if (filterSortValue === 'regDate') {
            url = "http://localhost:9000/admin/place/regdate";
        }else if(filterSortValue === 'update') {
            url = "http://localhost:9000/admin/place/update";
        }

        axios({
            method:"GET",
            url : url,
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((res) => {
                setPlaces(res.data);
            })
            .catch((err)=>{
                console.log(err)
                console.log(err.response.data.title);
            });

    },[filterSortValue]);

    const getStatus = (status)=>{
        setStatus(status);
    }

    const refresh= () => {

        axios({
            method:"GET",
            url : "http://localhost:9000/admin/place/",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((res) => {
                setPlaces(res.data);
            })
            .catch((err)=>{
                console.log(err)
                console.log(err.response.data.title);
            });

    }

    const handleUpdate = ()=>{
        refresh();
    }

    useEffect(() => {
        const updateCurrentData = () => {
            const start = offset;
            const end = offset + pageLimit;
            setCurrentData(places.slice(start, end));
        };

        updateCurrentData();
    }, [offset, places]);


    return (
        <Fragment>
            <SEO
                titleTemplate="Admin User"
                description="Admin User Controller."
            />

            <LayoutOne headerTop="visible">
                {/* breadcrumb */}
                <Breadcrumb 
                    pages={[
                        {label: "Home", path: homPath },
                        {label: "Hot Place", path: process.env.PUBLIC_URL + pathname }
                    ]} 
                />

                <div className="shop-area pt-95 pb-100">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                {/* 필터 종류 설정 */}
                                <PlaceTopbarFilter
                                    getLayout={getLayout}
                                    getFilterSortParams={getFilterSortParams}
                                    productCount={places.length}
                                    sortedProductCount={currentData.length}
                                    places={places}
                                    getSortParams={getSortParams}
                                    handleUpdate={handleUpdate} // Ensure handleUpdate is passed
                                />

                                {/* 현재 페이지에 데이터 뿌려주기*/}
                                <AdminPlacesList layout={layout} places={places} getStatus={getStatus} status={status} handleUpdate={handleUpdate} />


                                {/* shop product pagination */}
                                <div className="pro-pagination-style text-center mt-30">
                                    <Paginator
                                        totalRecords={places.length}
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



export default AdminPlace;