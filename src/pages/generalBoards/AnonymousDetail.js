import { Fragment, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import BlogComment from "./BlogComment";
import BlogPost from "./BlogPost";

// 게시글 상세페이지
const AnonymousDetail = () => {
  const { pathname } = useLocation();
  const { commBoardSeq } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:9000/community-boards/${commBoardSeq}`)
      .then((response) => response.json())
      .then((data) => {
        setPost(data);
      })
      .catch((error) => console.error("Error fetching post:", error));
  }, [commBoardSeq]);

  if (!post) return <div>Loading...</div>;

  return (
    <Fragment>
      <SEO title={post.boardTitle} />
      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            {
              label: "AnonymousBoard",
              path: process.env.PUBLIC_URL + pathname,
            },
            { label: `num : ${commBoardSeq}` },
          ]}
        />
        <div className="blog-area pt-100 pb-100">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-9">
                <div className="blog-details-wrapper ml-20">
                  <BlogPost post={post} />
                  <BlogComment replyList={post.replyList} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default AnonymousDetail;
