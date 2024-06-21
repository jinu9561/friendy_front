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
<<<<<<< HEAD
=======
    const [status,setStatus] = useState(false);
>>>>>>> 0a5eaa0e5ec1eb5db14f847738ee2bcf588612a0


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
<<<<<<< HEAD

=======
>>>>>>> 0a5eaa0e5ec1eb5db14f847738ee2bcf588612a0
        // let url = "http://localhost:9000/admin/users/profile";
        //
        // if (filterSortValue === 'regDate') {
        //     url = "http://localhost:9000/admin/users/regDate";
        // }else if(filterSortValue === 'update') {
        //     url = "http://localhost:9000/admin/users/update";
        // }else if(filterSortValue === 'lastLogin') {
        //     url = "http://localhost:9000/admin/users/lastLogin";
        // }else if(filterSortValue === 'userRate') {
        //     url = "http://localhost:9000/admin/users/userRate";
        // }

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

<<<<<<< HEAD

    },[filterSortValue]);


=======
    },[filterSortValue,status]);

    const getStatus = (status)=>{
        setStatus(status);
    }
>>>>>>> 0a5eaa0e5ec1eb5db14f847738ee2bcf588612a0


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
                        {label: "추천 장소 관리", path: process.env.PUBLIC_URL + pathname }
                    ]} 
                />

                <div className="shop-area pt-95 pb-100">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                {/* 필터 종류 설정 */}
                                <PlaceTopbarFilter getLayout={getLayout} getFilterSortParams={getFilterSortParams} productCount={places.length} sortedProductCount={currentData.length} places={places} getSortParams={getSortParams}/>

                                {/* 현재 페이지에 데이터 뿌려주기*/}
<<<<<<< HEAD
                                <AdminPlacesList layout={layout} places={places}/>
=======
                                <AdminPlacesList layout={layout} places={places} getStatus={getStatus} status={status} />
>>>>>>> 0a5eaa0e5ec1eb5db14f847738ee2bcf588612a0

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