import React, { Fragment, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BlogComment = ({ replyList }) => {
  const [replyContent, setReplyContent] = useState("");
  const [replies, setReplies] = useState(replyList);
  const { commBoardSeq } = useParams();

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userSeq = localStorage.getItem("userSeq");

    const replyDTO = {
      userSeq: userSeq,
      replyContent: replyContent
    };

    try {
      const response = await axios.post(
        `http://localhost:9000/community-boards/${commBoardSeq}/replies`,
          replyDTO
      );
      
       // 새 댓글을 기존 댓글 목록에 추가
      setReplies([...replies, response.data]);
      setReplyContent(""); // 입력 필드를 초기화
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  return (
    <Fragment>
      <div className="blog-comment-wrapper mt-55">
        <h4 className="blog-dec-title">
          comments : {replies.length.toString().padStart(2, "0")}
        </h4>
        {replies.map((reply, index) => (
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
        <div className="blog-reply-wrapper mt-50">
          <h4 className="blog-dec-title">post a comment</h4>
          <form className="blog-form" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12">
                <div className="text-leave">
                  <textarea
                    placeholder="Message"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <input type="submit" value="SEND MESSAGE" />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default BlogComment;
