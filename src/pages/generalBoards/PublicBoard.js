import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import BlogSidebar from "../../wrappers/blog/BlogSidebar";
import BlogPagination from "../../wrappers/blog/BlogPagination";
import BlogPosts from "./BlogPosts";
import Paginator from "react-hooks-paginator"; //페이지네이터

//실명 게시판
const PublicBoard = () => {
  let { pathname } = useLocation();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:9000/community-boards/realname")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleWriteClick = () => {
    navigate("/public-board/write");
  };

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
            { label: "Public-board", path: process.env.PUBLIC_URL + pathname },
          ]}
        />
        <div className="blog-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-9">
                <div className="mr-20">
                  <div className="row">
                    {/* blog posts */}
                    <BlogPosts posts={posts} pathname={pathname} />
                  </div>
                  <div class="d-flex justify-content-end">
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
                  <BlogPagination />
                </div>
              </div>
              <div className="col-lg-3">
                {/* blog sidebar */}
                <BlogSidebar />
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default PublicBoard;
