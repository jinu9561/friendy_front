import { Fragment, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import BlogComment from "../../wrappers/blog/BlogComment";
import BlogPost from "../../wrappers/blog/BlogPost";

const PublicDetail = () => {
  const { pathname } = useLocation();
  const { commBoardSeq } = useParams();
  const location = useLocation();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:9000/community-boards/${commBoardSeq}`)
      .then((response) => response.json())
      .then((data) => {
        setPost(data);
      })
      .catch((error) => console.error("Error fetching post:", error));
  }, [commBoardSeq, post]);

  if (!post) return <div>Loading...</div>;

  return (
    <Fragment>
      <SEO title={post.boardTitle} />
      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Blog Post", path: process.env.PUBLIC_URL + pathname },
          ]}
        />
        <div className="blog-area pt-100 pb-100">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-9">
                <div className="blog-details-wrapper ml-20">
                  <BlogPost post={post} />
                  <BlogComment comments={post.replyList} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default PublicDetail;
