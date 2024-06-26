import React, { Fragment, useState, useEffect } from "react";
import Paginator from "react-hooks-paginator"; 
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getSortedProducts } from "../../helpers/product";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import EventTopbarFilter from "../../wrappers/event/EventTopbarFilter";
import ShopProducts from "../../wrappers/product/ShopProducts";
import EventList from "./EventList";
import EventDeadLine from "./EventDeadLine";
import '../../assets/css/Event.css';

const Event = ({ location }) => {
  const [layout, setLayout] = useState("list two-column");
  const [sortType, setSortType] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [filterSortType, setFilterSortType] = useState("");
  const [filterSortValue, setFilterSortValue] = useState("");
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const { products } = useSelector((state) => state.product);
  const [selectedFilter, setSelectedFilter] = useState("default");

  const pageLimit = 16;
  let { pathname } = useLocation();

  const getLayout = layout => {
    setLayout(layout);
  };

  const getSortParams = (sortType, sortValue) => {
    setSortType(sortType);
    setSortValue(sortValue);
  };

  const getFilterSortParams = (sortType, sortValue) => {
    setFilterSortType(sortType);
    setFilterSortValue(sortValue);
  };

  const handleFilterChange = (value) => {
    setSelectedFilter(value);
  };

  useEffect(() => {
    let sortedProducts = getSortedProducts(products, sortType, sortValue);
    const filterSortedProducts = getSortedProducts(
      sortedProducts,
      filterSortType,
      filterSortValue
    );
    sortedProducts = filterSortedProducts;
    setSortedProducts(sortedProducts);
    setCurrentData(sortedProducts.slice(offset, offset + pageLimit));
  }, [offset, products, sortType, sortValue, filterSortType, filterSortValue]);

  return (
    <Fragment>
      <SEO
        titleTemplate="이벤트 페이지"
        description="Shop page of flone react minimalist eCommerce template."
      />

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "Event", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />

        <div className="shop-area pt-95 pb-100">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                
                {/* 상단 목록 보기 */}
                <EventTopbarFilter
                  onFilterChange={handleFilterChange}
                  getLayout={getLayout}
                  getFilterSortParams={getFilterSortParams}
                  productCount={products.length}
                  sortedProductCount={currentData.length}
                  products={products}
                  getSortParams={getSortParams}
                />
                <div style={{ width: '70%', height: '70%', marginLeft: '15%' }}>
                {/* 이벤트 리스트 */}
                <div className= "event-list-container">
                {selectedFilter === "default" ? (
                  <EventList />
                ) : (
                  <EventDeadLine />
                )}
                </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Event;