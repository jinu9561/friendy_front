import { Fragment, useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import Paginator from 'react-hooks-paginator';
import { useLocation } from "react-router-dom"
import { getSortedProducts } from '../../helpers/product';
import SEO from "../../components/seo";
import LayoutOne from '../../layouts/LayoutOne';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import ShopTopbarFilter from '../../wrappers/product/ShopTopbarFilter';
import ShopProducts from '../../wrappers/product/ShopProducts';

const ShopGridFilter = () => {
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

    const pageLimit = 15;
    let { pathname } = useLocation();

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

    /**
     * useEffect는 배열 내의 상태나 props가 변경될 때마다 실행.
     * 여기서 주어진 배열에는 offset, products, sortType, sortValue, filterSortType, filterSortValue, photos가 포함되어 있으므로,
     * 이들 중 하나라도 변경되면 useEffect 내의 함수가 실행된다.
     */

    useEffect(() => {
        let sortedProducts = getSortedProducts(products, sortType, sortValue);  //products : 정렬대상, sortType : 정렬 기준, sortValue : 정렬 방법
        const filterSortedProducts = getSortedProducts(sortedProducts, filterSortType, filterSortValue);    //필터에 따라 다시 한 번 정렬.
        sortedProducts = filterSortedProducts;
        setSortedProducts(sortedProducts); //sortedProducts : 최종 정렬된 상품 목록
        setCurrentData(sortedProducts.slice(offset, offset + pageLimit));   //페이지네이션을 위해 sortedProducts 목록에서 현재 페이지에 해당하는 데이터만 잘라냄. 
        //예를 들어, offset이 0이고 pageLimit이 15라면, 첫 15개의 제품을 선택. 잘라낸 데이터는 currentData 상태에 저장
    }, [offset, products, sortType, sortValue, filterSortType, filterSortValue ]);//이 배열 내의 값들이 변경될 때마다 useEffect가 재실행. offset이 변경되면, 페이지네이션 범위가 변경되므로, 현재 페이지에 해당하는 데이터를 다시 설정.

    return (
        <Fragment>
            <SEO
                titleTemplate="Shop Page"
                description="Shop page of flone react minimalist eCommerce template."
            />

            <LayoutOne headerTop="visible">
                {/* breadcrumb */}
                <Breadcrumb 
                    pages={[
                        {label: "Home", path: process.env.PUBLIC_URL + "/" },
                        {label: "Shop", path: process.env.PUBLIC_URL + pathname }
                    ]} 
                />

                <div className="shop-area pt-95 pb-100">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                {/* shop topbar filter */}
                                <ShopTopbarFilter getLayout={getLayout} getFilterSortParams={getFilterSortParams} productCount={products.length} sortedProductCount={currentData.length} products={products} getSortParams={getSortParams}/>

                                {/* shop page content default */}
                                <ShopProducts layout={layout} products={currentData} />

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



export default ShopGridFilter;
