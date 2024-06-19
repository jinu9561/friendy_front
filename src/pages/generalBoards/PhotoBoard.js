import axios from "axios";
import { Fragment, useState, useEffect } from "react";
import Paginator from "react-hooks-paginator";
import { useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import ShopTopbarFilter from "../../wrappers/product/ShopTopbarFilter";
import PhotoGridList from "../../wrappers/photo/PhotoGridList"; // 추가된 import
import { Button, Col, Row } from "react-bootstrap";

const PhotoBoard = () => {
  const [layout, setLayout] = useState("grid three-column"); // 레이아웃 상태 설정
  const [sortType, setSortType] = useState("date"); // 정렬 유형 상태 설정
  const [sortValue, setSortValue] = useState("desc"); // 정렬 값 상태 설정
  const [offset, setOffset] = useState(0); // 오프셋 상태 설정
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 설정
  const [currentData, setCurrentData] = useState([]); // 현재 데이터 상태 설정
  const [photos, setPhotos] = useState([]); // 사진 배열 상태 설정

  const pageLimit = 6; // 페이지당 항목 수 설정
  let { pathname } = useLocation(); // 현재 경로 가져오기

  useEffect(() => {
    axios
      .get("http://localhost:9000/photo-board/") // API 호출
      .then((response) => {
        setPhotos(response.data); // 응답 데이터로 사진 배열 설정
        console.log(response); // 응답 데이터 콘솔 출력
      })
      .catch((error) => {
        console.error("Error fetching photos:", error); // 오류 메시지 콘솔 출력
      });
  }, []); // 컴포넌트 마운트 시 실행

  useEffect(() => {
    const sortedPhotos = [...photos].sort((a, b) => {
      const dateA = new Date(a.photoBoardRegDate); // 첫 번째 사진의 등록 날짜 가져오기
      const dateB = new Date(b.photoBoardRegDate); // 두 번째 사진의 등록 날짜 가져오기
      return sortValue === "desc" ? dateB - dateA : dateA - dateB; // 정렬 값에 따라 정렬
    });

    setCurrentData(sortedPhotos.slice(offset, offset + pageLimit)); // 페이지 오프셋에 따라 현재 데이터 설정
    console.log("currentData = ", currentData); // 현재 데이터 콘솔 출력
  }, [offset, photos, sortValue]); // 의존성 배열 설정

  const getLayout = (layout) => {
    setLayout(layout); // 레이아웃 상태 업데이트
  };

  return (
    <Fragment>
      <SEO
        titleTemplate="Photo Gallery" // SEO 타이틀 템플릿 설정
        description="Photo gallery page of the application." // SEO 설명 설정
      />
      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" }, // 홈 페이지 경로 설정
            { label: "Gallery", path: process.env.PUBLIC_URL + pathname }, // 갤러리 페이지 경로 설정
          ]}
        />
        <div className="shop-area pt-95 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <ShopTopbarFilter
                  getLayout={getLayout} // 레이아웃 변경 함수 전달
                  productCount={photos.length} // 전체 사진 수 전달
                  sortedProductCount={currentData.length} // 정렬된 현재 데이터 수 전달
                />
                <PhotoGridList //사진그리드 리스트 렌더링
                  layout={layout}
                  photos={currentData}
                />
                <div className="pro-pagination-style text-center mt-30">
                  <Paginator
                    totalRecords={photos.length} // 전체 레코드 수 전달
                    pageLimit={pageLimit} // 페이지당 레코드 수 전달
                    pageNeighbours={2} // 페이지 이웃 수 설정
                    setOffset={setOffset} // 오프셋 설정 함수 전달
                    currentPage={currentPage} // 현재 페이지 전달
                    setCurrentPage={setCurrentPage} // 현재 페이지 설정 함수 전달
                    pageContainerClass="mb-0 mt-0" // 페이지 컨테이너 클래스 설정
                    pagePrevText="«" // 이전 페이지 텍스트 설정
                    pageNextText="»" // 다음 페이지 텍스트 설정
                  />
                </div>
                <Row>
                  <Col className="d-flex justify-content-end">
                    <Button variant="secondary" size="lg" className="me-2">
                      글쓰기
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default PhotoBoard; // PhotoBoard 컴포넌트 내보내기
