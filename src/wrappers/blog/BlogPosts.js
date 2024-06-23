import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const BlogPosts = ({ posts, pathname }) => {
  const detailPath = pathname.includes("/anonymous-board")
    ? "/anonymous-board/"
    : "/public-board/";

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return (
    <Fragment>
      {posts.map((post) => (
        <div className="col-lg-6 col-md-6 col-sm-12" key={post.commBoardSeq}>
          <div className="blog-wrap-2 mb-30">
            <div className="blog-content-2">
              <div className="blog-meta-2">
                <ul>
                  <li>
                    {new Date(post.boardRegDate).toLocaleDateString(
                      "ko-KR",
                      options
                    )}
                  </li>
                  <li>
                    <a href="#!">
                      {post.replyList.length} <i className="fa fa-comments-o" />
                    </a>
                  </li>
                </ul>
              </div>
              <h4>
                <Link
                  to={process.env.PUBLIC_URL + detailPath + post.commBoardSeq}
                >
                  {post.boardTitle}
                </Link>
              </h4>
              <p>{post.boardContent}</p>
              <div className="blog-share-comment">
                <div className="blog-btn-2">
                  <Link
                    to={process.env.PUBLIC_URL + detailPath + post.commBoardSeq}
                  >
                    read more
                  </Link>
                </div>
                <div className="blog-share">
                  <span>share :</span>
                  <div className="share-social">
                    <ul>
                      <li>
                        <a className="facebook" href="#!">
                          <i className="fa fa-facebook" />
                        </a>
                      </li>
                      <li>
                        <a className="twitter" href="#!">
                          <i className="fa fa-twitter" />
                        </a>
                      </li>
                      <li>
                        <a className="instagram" href="#!">
                          <i className="fa fa-instagram" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </Fragment>
  );
};

export default BlogPosts;
