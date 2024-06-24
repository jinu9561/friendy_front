import React, { Fragment } from "react";

const BlogComment = ({ replyList }) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return (
    <Fragment>
      <div className="blog-comment-wrapper mt-55">
        <h4 className="blog-dec-title">
          comments : {replyList.length.toString().padStart(2, "0")}
        </h4>
        {replyList.map((reply, index) => (
          <div className="single-comment-wrapper mt-35" key={index}>
            <div className="blog-comment-img">
              <img
                src={
                  process.env.PUBLIC_URL +
                  `/assets/img/blog/comment-${index + 1}.jpg`
                }
                alt=""
              />
            </div>
            <div className="blog-comment-content">
              <h4>{reply.nickName}</h4>
              <span>
                {new Date(reply.replyRegDate).toLocaleDateString(
                  "ko-KR",
                  options
                )}
              </span>
              <p>{reply.replyContent}</p>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default BlogComment;
