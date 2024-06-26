import React, { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import BlogSidebar from "../../wrappers/blog/BlogSidebar";
import BlogPagination from "../../wrappers/blog/BlogPagination";
import BlogPosts from "./BlogPosts";

const AnonymousBoard = () => {
  let { pathname } = useLocation();
  const [posts, setPosts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    fetch("http://localhost:9000/community-boards/anonymous")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
        setSearchResults(data); // 초기 검색 결과를 전체 게시물로 설정
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleWriteClick = () => {
    navigate("/anonymous-board/write");
  };

  const handleSearch = (keyword) => {
    if (keyword.trim() === "") {
      setSearchResults(posts); // 검색어가 없으면 전체 게시물 표시
      return;
    }

    fetch(`http://localhost:9000/community-boards/search?boardType=1&keyword=${keyword}`)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data);
        setCurrentPage(1); // 검색 시 페이지를 첫 페이지로 리셋
      })
      .catch((error) => console.error("Error fetching search results:", error));
  };

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = searchResults.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <Fragment>
      <SEO
        titleTemplate="Blog"
        description="Blog of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            {
              label: "ANONYMOUS-BOARD",
              path: process.env.PUBLIC_URL + pathname,
            },
          ]}
        />
        <div className="blog-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-9">
                <div className="mr-20">
                  <div className="row">
                    {/* blog posts */}
                    <BlogPosts posts={currentPosts} pathname={pathname} />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      style={{
                        backgroundColor: "#ff6289",
                        opacity: 0.8,
                        border: "none",
                      }}
                      className="btn btn-secondary btn-lg"
                      onClick={handleWriteClick}
                    >
                      글쓰기
                    </button>
                  </div>

                  {/* blog pagination */}
                  <BlogPagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPosts={searchResults.length}
                    postsPerPage={postsPerPage}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                {/* blog sidebar */}
                <BlogSidebar onSearch={handleSearch} />
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default AnonymousBoard;
