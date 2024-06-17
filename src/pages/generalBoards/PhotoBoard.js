import axios from "axios";
import { Fragment, useState, useEffect } from "react";
import Paginator from "react-hooks-paginator";
import { useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import ShopTopbarFilter from "../../wrappers/product/ShopTopbarFilter";
import PhotoGridList from "../../wrappers/photo/PhotoGridList"; // 추가된 import
import { getType } from "@reduxjs/toolkit";

const PhotoBoard = () => {
  const [layout, setLayout] = useState("grid three-column");
  const [sortType, setSortType] = useState("date");
  const [sortValue, setSortValue] = useState("desc");
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [photos, setPhotos] = useState([]);

  const pageLimit = 15;
  let { pathname } = useLocation();

  useEffect(() => {
    axios
      .get("http://localhost:9000/photo-boards/")
      .then((response) => {
        setPhotos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching photos:", error);
      });
  }, []);

  useEffect(() => {
    const sortedPhotos = [...photos].sort((a, b) => {
      const dateA = new Date(a.photoBoardRegDate);
      const dateB = new Date(b.photoBoardRegDate);
      return sortValue === "desc" ? dateB - dateA : dateA - dateB;
    });

    setCurrentData(sortedPhotos.slice(offset, offset + pageLimit));
    console.log("currentData = ", currentData);
  }, [offset, photos, sortValue]);

  const getLayout = (layout) => {
    setLayout(layout);
  };

  const getSortParams = (sortType, sortValue) => {
    setSortType(sortType);
    setSortValue(sortValue);
  };

  return (
    <Fragment>
      <SEO
        titleTemplate="Photo Gallery"
        description="Photo gallery page of the application."
      />
      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Gallery", path: process.env.PUBLIC_URL + pathname },
          ]}
        />
        <div className="shop-area pt-95 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <ShopTopbarFilter
                  getLayout={getLayout}
                  productCount={photos.length}
                  sortedProductCount={currentData.length}
                />
                <PhotoGridList layout={layout} photos={currentData} />
                <div className="pro-pagination-style text-center mt-30">
                  <Paginator
                    totalRecords={photos.length}
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
  );
};

export default PhotoBoard;
