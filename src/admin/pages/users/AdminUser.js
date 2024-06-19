import { Fragment, useState, useEffect, useContext } from 'react';
import { useSelector } from "react-redux";
import Paginator from 'react-hooks-paginator';
import { useLocation } from "react-router-dom"
import { getSortedProducts } from '../../../helpers/product';
import SEO from "../../../components/seo";
import LayoutOne from '../../../layouts/LayoutOne';
import Breadcrumb from '../../../wrappers/breadcrumb/Breadcrumb';
import { LogingedContext } from "../../../App";
import UserTopbarFilter from '../../wrappers/UserTopbarFilter';
import UserProfiles from '../../wrappers/UserProfiles';
import axios from 'axios';

const AdminUser = () => {
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
    
    const [profileDataList , setProfileDataList] = useState([]);


    const pageLimit = 15;
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
        let sortedProducts = getSortedProducts(products, sortType, sortValue);
        const filterSortedProducts = getSortedProducts(sortedProducts, filterSortType, filterSortValue);
        sortedProducts = filterSortedProducts;
        setSortedProducts(sortedProducts);
        setCurrentData(sortedProducts.slice(offset, offset + pageLimit));
    }, [offset, products, sortType, sortValue, filterSortType, filterSortValue ]);

    //user profile 데이터 받아 오기
    useEffect(()=>{

        // 메인 이미지
        axios.get("http://localhost:9000/admin/users/profile",
            {
              headers :  {Authorization: sessionStorage.getItem("Authorization")},
            })
              .then((response) => {
                // 날짜순으로 정렬
                //const sortedPurchaseHistory = [...response.data.purchaseHistory].sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
                //setProfileData({ ...response.data, purchaseHistory: sortedPurchaseHistory });
                setProfileDataList(response.data);
                console.log(profileDataList);
              })
              .catch((err) => {
                if (err.response && err.response.data && err.response.data.title === undefined) {
                  alert("로그아웃 후 다시 로그인해 주세요");
              } else {
                  alert(err.response.data.title);
              }
              });

    },[])

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
                        {label: "회원 조희", path: process.env.PUBLIC_URL + pathname }
                    ]} 
                />

                <div className="shop-area pt-95 pb-100">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                {/* 필터 종류 설정 */}
                                <UserTopbarFilter getLayout={getLayout} getFilterSortParams={getFilterSortParams} productCount={products.length} sortedProductCount={currentData.length} products={products} getSortParams={getSortParams}/>

                                {/* 현재 페이지에 데이터 뿌려주기*/}
                                <UserProfiles layout={layout} profileDataList={profileDataList}/>

                                {/* shop product pagination */}
                                <div className="pro-pagination-style text-center mt-30">
                                    <Paginator
                                        totalRecords={sortedProducts.length}
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



export default AdminUser;