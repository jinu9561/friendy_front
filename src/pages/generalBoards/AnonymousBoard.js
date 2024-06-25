import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import BlogSidebar from "../../wrappers/blog/BlogSidebar";
import BlogPagination from "../../wrappers/blog/BlogPagination";
import BlogPosts from "../../wrappers/blog/BlogPosts";

const AnonymousBoard = () => {
  let { pathname } = useLocation();

  return (
    <Fragment>
      <SEO />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            {
              label: "Anonymous-Board",
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
                    <BlogPosts pathname={pathname} />
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

export default AnonymousBoard;
