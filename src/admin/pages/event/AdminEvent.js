import React, { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {useLocation, useParams, useNavigate, Link} from "react-router-dom";
import { getSortedProducts } from "../../../helpers/product";
import SEO from "../../../components/seo";
import LayoutOne from "../../../layouts/LayoutOne";
import Breadcrumb from "../../../wrappers/breadcrumb/Breadcrumb";
import EventTopbarFilter from "../../../wrappers/event/EventTopbarFilter";
import AdminEventList from "../../../pages/event/AdminEventList";
import AdminEventDeadLine from "../../../pages/event/AdminEventDeadLine";
import AdminEventUpdate from "../../components/event/AdminEventUpdate";
import AdminEventInsert from "../../components/event/AdminEventInsert";
import AdminEventDelete from "../../components/event/AdminEventDelete";
import '../../../assets/css/Event.css';


const AdminEvent = ({ location }) => {
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
  const [selectedEventSeq, setSelectedEventSeq] = useState(null);
  const navigate = useNavigate();


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

  const handleEventSelection = (eventSeq) => {
    setSelectedEventSeq(eventSeq);
  };

  const handleReturnToList = () => {
    setSelectedEventSeq(null); // 이벤트 수정 상태 초기화
  };

  const handleDeleteSuccess = () => {
    setSelectedEventSeq(null); // 삭제 후 이벤트 선택 초기화
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
            titleTemplate="관리자 이벤트 페이지"
            description="관리자 이벤트 관리 페이지"
        />

        <LayoutOne headerTop="visible">
          {/* breadcrumb */}
          <Breadcrumb
              pages={[
                {label: "Home", path: process.env.PUBLIC_URL + "/" },
                {label: "AdminEvent", path: process.env.PUBLIC_URL + pathname }
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
                  {/*등록하기*/}
                  <div className="pro-details-cart btn-hover">
                    <Link to="/adminEventInsert">
                      <button type="button" style={{ border: '0.5px solid black' }}>등록하기</button>
                    </Link>
                  </div>
                  <br/>
                  <div className="pro-details-cart btn-hover">
                  <Link to="/adminEventDetailImgInsert">
                    <button type="button" style={{ border: '0.5px solid black' }}>세부이미지등록하기</button>
                  </Link>
                  </div>
                  {/*수정하기*/}
                  {/*{selectedEventSeq && (*/}
                  {/*    <AdminEventUpdate eventSeq={selectedEventSeq}*/}
                  {/*                      returnToList={handleReturnToList}*/}
                  {/*    />*/}
                  {/*)}*/}

                  {/*삭제하기*/}
                  <div className="pro-details-cart btn-hover" style={{ marginTop: '20px' }}>
                  {selectedEventSeq && (
                      <AdminEventDelete
                          eventSeq={selectedEventSeq}
                          onDeleteSuccess={handleDeleteSuccess}
                      />
                  )}
                  </div>
                  {/* 이벤트 리스트 */}
                  <div className= "event-list-container">
                    {selectedFilter === "default" ? (
                        <AdminEventList onEventSelect={handleEventSelection} />
                    ) : (
                        <AdminEventDeadLine onEventSelect={handleEventSelection} />
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </LayoutOne>
      </Fragment>
  );
};

export default AdminEvent;