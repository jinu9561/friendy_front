import axios from "axios";
import {Fragment, useState, useEffect, useContext} from "react";
import Paginator from "react-hooks-paginator";
import { useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import PhotoGridList from "../../wrappers/photo/PhotoGridList";
import PhotoTopbarFilter from "../../wrappers/photo/PhotoTopbarFilter";
import {LogingedContext} from "../../App"; // 추가된 import
import '../../assets/css/photoBoard.css';

const PhotoBoard = () => {
    const [layout, setLayout] = useState("grid three-column");
    const [sortType, setSortType] = useState("date");
    const [sortValue, setSortValue] = useState("desc");
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [filterSortType, setFilterSortType] = useState('');
    const [filterSortValue, setFilterSortValue] = useState('');

    const [photos, setPhotos] = useState([]);
    const [interestCategory, setInterestCategory] = useState([]);
    const [selectInterest , setSelectInterest] = useState('');

    const [paginatedPhotos, setPaginatedPhotos] = useState([]);

    const pageLimit = 10;
    let { pathname } = useLocation();
    let logingedCon =useContext(LogingedContext);

    useEffect(() => {
        //게시글 가져오기
        axios
            .get("http://localhost:9000/photo/")
            .then((response) => {
                console.log(response.data)
                setPhotos(response.data);

            })
            .catch((error) => {
                console.error("Error fetching photos:", error);
            });

        // 관심사 카테고리 가져오기
        axios.get("http://localhost:9000/interest/")
            .then((res) => {
                setInterestCategory(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    const handelUpdate = () =>{
        refresh();
    }

    const refresh = ()=>{
        axios
            .get("http://localhost:9000/photo/")
            .then((response) => {
                console.log(response.data)
                setPhotos(response.data);

            })
            .catch((error) => {
                console.error("Error fetching photos:", error);
            });
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
        // 정렬할때 쓰는거
        let url = "http://localhost:9000/photo/";

        if (filterSortValue === 'regDate') {
            url = "http://localhost:9000/photo/regDate";
        }else if(filterSortValue === 'update') {
            url = "http://localhost:9000/photo/update";
        }else if(filterSortValue === 'like'){
            url = "http://localhost:9000/photo/like";
        }else if(filterSortValue === 'user'){
            url = "http://localhost:9000/photo/user/"+logingedCon.userSeq;
        }

        axios
            .get(url)
            .then((response) => {
                console.log(response.data)
                setPhotos(response.data);
            })
            .catch((error) => {
                console.error("Error fetching photos:", error);
            });

    }, [filterSortValue]);

    const getLayout = (layout) => {
        setLayout(layout);
    };

    const handleInterest = (e) => {
        const { innerText } = e.target;
        if (innerText === "전체 보기") {
            setSelectInterest("all");
        } else {
            setSelectInterest(innerText);
        }
    };

    useEffect(() => {
        if (selectInterest) {
            const url = selectInterest === "all"
                ? "http://localhost:9000/photo/"
                : `http://localhost:9000/photo/interest/${selectInterest}`;

            axios.get(url)
                .then((response) => {
                    setPhotos(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching photos:", error);
                });
        }
    }, [selectInterest]);

    useEffect(() => {
        const updatePaginatedPhotos = () => {
            const start = offset;
            const end = offset + pageLimit;
            setPaginatedPhotos(photos.slice(start, end));
        };

        updatePaginatedPhotos();
    }, [offset, photos]);

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
                        { label: "photoboard", path: process.env.PUBLIC_URL + pathname },
                    ]}
                />
                <div className="shop-area pt-95 pb-100">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <PhotoTopbarFilter
                                    getLayout={getLayout}
                                    productCount={photos.length}
                                    sortedProductCount={photos.length}
                                    handelUpdate={handelUpdate}
                                    photos={photos}
                                    getFilterSortParams={getFilterSortParams}
                                />
                                <div className="interest-categories">
                                    <div className="interest-category" onClick={handleInterest}>
                                        전체 보기
                                    </div>
                                    {interestCategory.map((category, index) => (
                                        <div key={index} className="interest-category" onClick={handleInterest}>
                                            {category.interestCategory}
                                        </div>
                                    ))}
                                </div>
                                <PhotoGridList layout={layout} photos={paginatedPhotos} handelUpdate={handelUpdate}/>
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
