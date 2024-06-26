import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import './BlogPosts.css';

//게시판(~Board)에 포함되는 게시글 목록
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

  
  const truncateContent = (content, limit) => {
    if (content.length > limit) {
      return content.substring(0, limit) + "...";
    }
    return content;
  };


  if (Array.isArray(posts) && posts.length > 0) {
    return (
      <Fragment>
        {posts.map((post) => (
          <div className="col-lg-6 col-md-6 col-sm-12" key={post.commBoardSeq}>
            <div className="blog-wrap-2 mb-30">
              <div className="blog-content-2 cute-card">
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
                        {post.replyList.length}{" "}
                        <i className="fa fa-comments-o" />
                      </a>
                    </li>
                  </ul>
                </div>
                <h4>
                  <Link
                    to={process.env.PUBLIC_URL + detailPath + post.commBoardSeq} //해당 commBoardSeq의 주소를 가지는 publicDatail로 연결
                  >
                    {truncateContent(post.boardTitle,10)}
                  </Link>
                </h4>
                <p>{truncateContent(post.boardContent, 50)}</p>
                <div className="blog-share-comment">
                  <div className="blog-btn-2">
                    <Link
                      to={
                        process.env.PUBLIC_URL + detailPath + post.commBoardSeq
                      }
                    >
                      read more
                    </Link>
                  </div>
                  <div className="blog-share">
                    <span>
                      {detailPath === "/anonymous-board/"
                        ? "익명"
                        : post.nickName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Fragment>
    );
  } else {
    // posts가 비어있거나 배열이 아니면 "게시물이 없습니다" 메시지 표시
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h3>게시물이 없습니다.</h3>
      </div>
    );
  }
};

export default BlogPosts;
